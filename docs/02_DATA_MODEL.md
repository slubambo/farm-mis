# Data Model & Entity Relationship Diagram (ERD)

**Version**: 1.0  
**Database**: PostgreSQL  
**Multi-tenancy**: Row-level security (RLS) via tenant_id on all tables  

---

## Core Principles

1. **Tenant Isolation**: Every table has `tenant_id` as the first column; all queries scoped by it
2. **Soft Deletes**: Animals/records marked `deleted_at` instead of hard deleted (sync-safe)
3. **Audit Trail**: Finance records immutable; all changes logged with user + timestamp
4. **Timestamps**: All records have `created_at`, `updated_at` for sync detection
5. **UUID Primary Keys**: All IDs are UUIDs (v4) for reliable offline sync

---

## Entity Relationship Diagram (Conceptual)

```
┌─────────────────────────────────────────────────────────────────┐
│                          TENANT (Farm)                          │
│  id, name, primary_color, secondary_color, logo_url, created_at │
└──────────────────────────────┬──────────────────────────────────┘
         │
         ├─────────────────────────────────────────────────────────────┐
         │                                                             │
    Has ├─────────────────────┐                              ┌────────┴───────────┐
         │                     │                              │                    │
         ▼                     ▼                              ▼                    ▼
    ┌─────────┐        ┌──────────────┐          ┌──────────────┐      ┌────────────┐
    │ USER    │        │   BRANCH     │          │   HOUSING    │      │   ANIMAL   │
    │         │        │ (Location)   │          │    UNIT      │      │ /BATCH     │
    └────┬────┘        └──────┬───────┘          └──────┬───────┘      └─────┬──────┘
         │                    │                         │                    │
    Has │         Has         │              Has        │          Has       │
         │         ├─────┐    │                ├────────┤                    │
         │         │     │    │                │        │                    │
         │         ▼     ▼    ▼                ▼        ▼                    │
         │      ┌─────────────────────┐    ┌────────────────────┐           │
         │      │   BRANCH_ACCESS     │    │  CURRENT_HOUSING   │           │
         │      │ (user → branch)     │    │  (animal's current │           │
         │      └─────────────────────┘    │   location)        │           │
         │                                 └────────────────────┘           │
         │                                                                   │
    ┌────┴───────────────────────────┬─────────────────────────┬───────────┴──────┐
    │                                │                         │                  │
    │     Activity Log         Partner        Feed & Consumables              Sales
    │                         Contributions       Inventory                   Finance
    │                                │                         │                  │
    ▼                                ▼                         ▼                  ▼
┌─────────────────┐        ┌──────────────────┐    ┌───────────────────┐  ┌──────────┐
│   ACTIVITY      │        │   PARTNER        │    │   FEED_ITEM       │  │  SALE    │
│ (event log)     │        │ (investor)       │    │ (feed type)       │  │ (sale    │
│ - Type          │        │ - Name, contact  │    │ - Species variant │  │  record) │
│ - Animal IDs    │        │ - Share %        │    │ - Unit (kg, bag)  │  │ - Date   │
│ - Housing       │        └────────┬─────────┘    └─────────┬─────────┘  │ - Animal │
│ - Notes/Photo   │                 │                       │             │ - Price  │
│ - created_by    │                 ▼                       ▼             │ - Buyer  │
└────────┬────────┘        ┌──────────────────┐    ┌───────────────────┐  └────┬─────┘
         │                 │  CONTRIBUTION    │    │  STOCK_BATCH      │       │
         │                 │ (cash/in-kind)   │    │ (purchase)        │       │
         ▼                 │ - Type, amount   │    │ - Supplier        │       │
    ┌──────────────┐       │ - Category       │    │ - Qty, cost       │       │
    │  ACTIVITY    │       │ - Date, notes    │    │ - Expiry, received│       ▼
    │  TYPE        │       └──────────────────┘    └─────────┬─────────┘   ┌──────────┐
    │ (Vaccination,│                                         │             │ EXPENSE  │
    │  Birth,      │                                         ▼             │ (cost    │
    │  Transfer,   │                               ┌───────────────────┐   │  record) │
    │  Death, etc) │                               │ STOCK_TRANSACTION │   │ - Date   │
    └──────────────┘                               │ (adjustment)      │   │ - Amount │
                                                   │ - Type (in/out)   │   │ - Vendor │
                                                   │ - Animal/batch    │   │ - Category
                                                   │ - Qty, date       │   └──────────┘
                                                   └───────────────────┘

                                                   ┌───────────────────┐
                                                   │  PAYROLL_ENTRY    │
                                                   │ (worker pay)      │
                                                   │ - Worker, period  │
                                                   │ - Rate, advances  │
                                                   │ - Net pay, date   │
                                                   └───────────────────┘

    ┌───────────────────────────────────────────────────────┐
    │           AUDIT_LOG (Immutable)                       │
    │ - Record type, ID, old_value, new_value             │
    │ - changed_by (user), changed_at                      │
    │ (For finance records: every change tracked)         │
    └───────────────────────────────────────────────────────┘
```

---

## Detailed Table Schema

### **1. TENANT (Farm Organization)**

```sql
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    primary_color VARCHAR(7), -- hex color
    secondary_color VARCHAR(7),
    logo_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP, -- soft delete
    
    CONSTRAINT tenant_name_not_empty CHECK (name != '')
);
```

---

### **2. USER**

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- bcrypt
    full_name VARCHAR(255),
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL DEFAULT 'viewer',
    -- Roles: 'owner', 'manager', 'caretaker', 'accountant', 'viewer'
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(tenant_id, email),
    CONSTRAINT valid_role CHECK (role IN ('owner', 'manager', 'caretaker', 'accountant', 'viewer'))
);

CREATE INDEX idx_user_tenant ON users(tenant_id);
```

---

### **3. BRANCH (Location/Sub-farm)**

```sql
CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL, -- e.g., "Dairy House", "Chicken Shed #1"
    description TEXT,
    location_lat FLOAT, -- optional GPS
    location_lng FLOAT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP,
    
    UNIQUE(tenant_id, name)
);

CREATE INDEX idx_branch_tenant ON branches(tenant_id);
```

---

### **4. BRANCH_ACCESS (User → Branch Restriction)**

```sql
CREATE TABLE branch_accesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    -- If not present, user can access all branches (default for owner/manager)
    
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(tenant_id, user_id, branch_id)
);

CREATE INDEX idx_branch_access_user ON branch_accesses(tenant_id, user_id);
CREATE INDEX idx_branch_access_branch ON branch_accesses(tenant_id, branch_id);
```

**Logic**: If branch_accesses has records for a user, restrict to only those branches.  
If empty for a user, grant access to all branches (fine-grained later).

---

### **5. HOUSING_UNIT (Pen, Room, Coop, Stall)**

```sql
CREATE TABLE housing_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL, -- e.g., "Barn A, Pen 1" or "Chicken Coop 3"
    unit_type VARCHAR(50), -- e.g., 'pen', 'coop', 'stall', 'room', 'pasture'
    capacity INT, -- max animals (optional)
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP,
    
    UNIQUE(tenant_id, branch_id, name)
);

CREATE INDEX idx_housing_branch ON housing_units(tenant_id, branch_id);
```

---

### **6. ANIMAL (Individual or Representative of Batch)**

```sql
CREATE TABLE animals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    
    -- Animal identity
    tag_id VARCHAR(100), -- e.g., "C-001" (unique within tenant per species)
    name VARCHAR(255), -- optional
    species VARCHAR(50) NOT NULL, -- 'cow', 'pig', 'chicken', 'goat', 'sheep', etc.
    breed VARCHAR(100),
    sex VARCHAR(20), -- 'male', 'female', 'unknown'
    
    -- Tracking type
    is_batch BOOLEAN DEFAULT false, -- true if represents batch (e.g., 200 broilers)
    batch_count INT, -- if is_batch=true, number in batch
    
    -- Dates & origin
    arrival_date DATE,
    birth_date DATE, -- if known; otherwise estimated from age
    age_estimate_weeks INT, -- if birth_date unknown
    origin VARCHAR(255), -- "local farm", "supplier name", etc.
    
    -- Current status
    status VARCHAR(50) DEFAULT 'active',
    -- 'active', 'sold', 'dead', 'transferred_out'
    status_changed_at TIMESTAMP,
    status_change_reason TEXT,
    
    -- Photo
    photo_url TEXT,
    
    -- Parentage (if tracked)
    mother_id UUID REFERENCES animals(id) ON DELETE SET NULL,
    father_id UUID REFERENCES animals(id) ON DELETE SET NULL,
    
    -- Timestamps for sync
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP,
    
    CONSTRAINT valid_status CHECK (status IN ('active', 'sold', 'dead', 'transferred_out')),
    CONSTRAINT batch_count_positive CHECK (batch_count IS NULL OR batch_count > 0)
);

CREATE INDEX idx_animal_tenant ON animals(tenant_id);
CREATE INDEX idx_animal_branch ON animals(tenant_id, branch_id);
CREATE INDEX idx_animal_species ON animals(tenant_id, species);
CREATE INDEX idx_animal_status ON animals(tenant_id, status);
CREATE INDEX idx_animal_tag ON animals(tenant_id, species, tag_id);
```

---

### **7. CURRENT_HOUSING (Animal's Current Location)**

```sql
CREATE TABLE current_housings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    animal_id UUID NOT NULL UNIQUE REFERENCES animals(id) ON DELETE CASCADE,
    housing_unit_id UUID NOT NULL REFERENCES housing_units(id) ON DELETE SET NULL,
    
    assigned_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(tenant_id, animal_id)
);

CREATE INDEX idx_current_housing_unit ON current_housings(tenant_id, housing_unit_id);
```

**Note**: Denormalized for fast lookup. Source of truth: latest ACTIVITY record of type 'transfer'.

---

### **8. ACTIVITY / EVENT LOG**

```sql
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    
    activity_type_id UUID NOT NULL REFERENCES activity_types(id) ON DELETE RESTRICT,
    -- e.g., 'vaccination', 'transfer', 'birth', 'death', 'feed_use', 'treatment'
    
    recorded_at TIMESTAMP NOT NULL, -- when the event happened
    recorded_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    
    -- Free text
    notes TEXT,
    photo_url TEXT,
    
    -- Linked animals (JSON array of UUIDs or separate junction table)
    related_animal_ids UUID[], -- animals involved in activity
    related_housing_unit_id UUID REFERENCES housing_units(id) ON DELETE SET NULL,
    
    -- Timestamps for sync
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP,
    
    -- Immutability flag (for financial records, once reviewed)
    is_locked BOOLEAN DEFAULT false
);

CREATE INDEX idx_activity_tenant ON activities(tenant_id);
CREATE INDEX idx_activity_branch ON activities(tenant_id, branch_id);
CREATE INDEX idx_activity_type ON activities(tenant_id, activity_type_id);
CREATE INDEX idx_activity_recorded_at ON activities(tenant_id, recorded_at DESC);
CREATE INDEX idx_activity_animal ON activities USING GIN(tenant_id, related_animal_ids);
```

---

### **9. ACTIVITY_TYPE (Extensible)**

```sql
CREATE TABLE activity_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    name VARCHAR(100) NOT NULL, -- e.g., 'Vaccination', 'Birth', 'Transfer', 'Death'
    description TEXT,
    
    -- Built-in or custom
    is_system BOOLEAN DEFAULT false, -- system types cannot be deleted
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(tenant_id, name)
);
```

**System types** (created at tenant init):
- Transfer
- Birth
- Death
- Treatment
- Vaccination
- Deworming
- Weighing
- Cleaning
- Feeding (if explicit)
- Milking (if applicable)
- Egg Collection (if applicable)

---

### **10. BIRTH_EVENT (Detailed Birth Tracking)**

```sql
CREATE TABLE birth_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    activity_id UUID NOT NULL UNIQUE REFERENCES activities(id) ON DELETE CASCADE,
    
    mother_id UUID REFERENCES animals(id) ON DELETE SET NULL,
    father_id UUID REFERENCES animals(id) ON DELETE SET NULL,
    
    number_born INT NOT NULL,
    number_deceased INT DEFAULT 0,
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_birth_mother ON birth_events(tenant_id, mother_id);
```

---

### **11. PARTNER (Investor/Contributor)**

```sql
CREATE TABLE partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    ownership_share DECIMAL(5, 2), -- optional %; e.g., 30.5
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP,
    
    UNIQUE(tenant_id, name)
);

CREATE INDEX idx_partner_tenant ON partners(tenant_id);
```

---

### **12. CONTRIBUTION (Cash or In-Kind)**

```sql
CREATE TABLE contributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
    
    contribution_type VARCHAR(50) NOT NULL, -- 'cash', 'in_kind'
    category VARCHAR(100), -- 'animals', 'feed', 'equipment', 'labor', 'other'
    
    amount_value DECIMAL(12, 2) NOT NULL, -- in local currency (or item cost estimate)
    currency VARCHAR(3) DEFAULT 'USD', -- for future multi-currency
    
    contribution_date DATE NOT NULL,
    notes TEXT,
    receipt_url TEXT, -- photo of receipt
    
    -- Optional link to batch/inventory entry if in-kind
    related_animal_id UUID REFERENCES animals(id) ON DELETE SET NULL,
    related_stock_batch_id UUID REFERENCES stock_batches(id) ON DELETE SET NULL,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT valid_contribution_type CHECK (contribution_type IN ('cash', 'in_kind'))
);

CREATE INDEX idx_contribution_partner ON contributions(tenant_id, partner_id);
CREATE INDEX idx_contribution_date ON contributions(tenant_id, contribution_date);
```

---

### **13. FEED_ITEM (Type/Category)**

```sql
CREATE TABLE feed_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    name VARCHAR(255) NOT NULL, -- e.g., "Layer Mash", "Grower Pellets", "Vaccine A"
    category VARCHAR(100), -- 'feed', 'medicine', 'vaccine', 'disinfectant', 'bedding'
    unit VARCHAR(50), -- 'kg', 'bag', 'liter', 'ml', 'tablet', 'dose'
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP,
    
    UNIQUE(tenant_id, name)
);

CREATE INDEX idx_feed_item_tenant ON feed_items(tenant_id);
```

---

### **14. STOCK_BATCH (Purchase/Received Batch)**

```sql
CREATE TABLE stock_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    
    feed_item_id UUID NOT NULL REFERENCES feed_items(id) ON DELETE RESTRICT,
    
    received_date DATE NOT NULL,
    supplier_name VARCHAR(255),
    
    quantity_received DECIMAL(12, 2) NOT NULL,
    unit VARCHAR(50), -- must match feed_item.unit
    cost_per_unit DECIMAL(10, 2),
    total_cost DECIMAL(12, 2),
    
    expiry_date DATE,
    notes TEXT,
    receipt_url TEXT,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_stock_batch_tenant ON stock_batches(tenant_id);
CREATE INDEX idx_stock_batch_item ON stock_batches(tenant_id, feed_item_id);
CREATE INDEX idx_stock_batch_branch ON stock_batches(tenant_id, branch_id);
```

---

### **15. STOCK_TRANSACTION (Usage, Wastage, Transfers)**

```sql
CREATE TABLE stock_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    
    stock_batch_id UUID NOT NULL REFERENCES stock_batches(id) ON DELETE RESTRICT,
    
    transaction_type VARCHAR(50), -- 'usage', 'wastage', 'transfer', 'adjust'
    quantity DECIMAL(12, 2) NOT NULL,
    unit VARCHAR(50),
    
    -- Context of usage
    related_animal_id UUID REFERENCES animals(id) ON DELETE SET NULL,
    related_housing_unit_id UUID REFERENCES housing_units(id) ON DELETE SET NULL,
    related_activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,
    
    transaction_date DATE NOT NULL,
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP,
    
    CONSTRAINT valid_transaction_type CHECK (transaction_type IN ('usage', 'wastage', 'transfer', 'adjust'))
);

CREATE INDEX idx_stock_transaction_tenant ON stock_transactions(tenant_id);
CREATE INDEX idx_stock_transaction_batch ON stock_transactions(tenant_id, stock_batch_id);
CREATE INDEX idx_stock_transaction_animal ON stock_transactions(tenant_id, related_animal_id);
```

---

### **16. SALE (Animal/Product Sale)**

```sql
CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    
    sale_date DATE NOT NULL,
    buyer_name VARCHAR(255),
    buyer_contact VARCHAR(255),
    
    -- Sale items (JSON array or separate junction table)
    -- sale_items: [{ animal_id: UUID, quantity: 1, unit_price: 50000, description: "" }]
    sale_items JSONB NOT NULL,
    
    quantity_total INT,
    unit_price DECIMAL(12, 2),
    total_price DECIMAL(14, 2),
    
    payment_status VARCHAR(50) DEFAULT 'unpaid', -- 'paid', 'partial', 'unpaid'
    payment_method VARCHAR(100), -- 'cash', 'bank_transfer', 'check', 'other'
    amount_received DECIMAL(12, 2),
    balance_due DECIMAL(12, 2),
    
    notes TEXT,
    receipt_url TEXT,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP,
    
    CONSTRAINT valid_payment_status CHECK (payment_status IN ('paid', 'partial', 'unpaid'))
);

CREATE INDEX idx_sale_tenant ON sales(tenant_id);
CREATE INDEX idx_sale_branch ON sales(tenant_id, branch_id);
CREATE INDEX idx_sale_date ON sales(tenant_id, sale_date DESC);
```

---

### **17. EXPENSE (Cost/Purchase)**

```sql
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    
    expense_date DATE NOT NULL,
    category VARCHAR(100), -- 'feed', 'vet', 'fuel', 'repairs', 'utilities', 'transport', 'labor', 'other'
    
    description VARCHAR(255),
    vendor_name VARCHAR(255),
    amount DECIMAL(12, 2) NOT NULL,
    
    payment_method VARCHAR(100), -- 'cash', 'bank_transfer', 'check', 'credit'
    payment_status VARCHAR(50) DEFAULT 'paid', -- 'paid', 'pending', 'approved'
    
    notes TEXT,
    receipt_url TEXT,
    
    -- Approval workflow (optional)
    requires_approval BOOLEAN DEFAULT false,
    approved_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP,
    
    CONSTRAINT valid_category CHECK (category IN ('feed', 'vet', 'fuel', 'repairs', 'utilities', 'transport', 'labor', 'other')),
    CONSTRAINT valid_payment_status CHECK (payment_status IN ('paid', 'pending', 'approved'))
);

CREATE INDEX idx_expense_tenant ON expenses(tenant_id);
CREATE INDEX idx_expense_branch ON expenses(tenant_id, branch_id);
CREATE INDEX idx_expense_date ON expenses(tenant_id, expense_date DESC);
CREATE INDEX idx_expense_category ON expenses(tenant_id, category);
```

---

### **18. PAYROLL_ENTRY (Worker Pay)**

```sql
CREATE TABLE payroll_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    
    worker_user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- optional: link to user
    worker_name VARCHAR(255) NOT NULL,
    worker_contact VARCHAR(255),
    
    pay_period_start DATE NOT NULL,
    pay_period_end DATE NOT NULL,
    
    wage_type VARCHAR(50), -- 'daily', 'weekly', 'monthly'
    wage_rate DECIMAL(12, 2) NOT NULL,
    days_worked INT,
    gross_pay DECIMAL(12, 2),
    
    advances_given DECIMAL(12, 2) DEFAULT 0,
    loans_given DECIMAL(12, 2) DEFAULT 0,
    deductions DECIMAL(12, 2) DEFAULT 0,
    
    net_pay DECIMAL(12, 2),
    payment_date DATE,
    payment_method VARCHAR(100),
    payment_status VARCHAR(50) DEFAULT 'unpaid', -- 'paid', 'partial', 'unpaid'
    
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP,
    
    CONSTRAINT valid_wage_type CHECK (wage_type IN ('daily', 'weekly', 'monthly')),
    CONSTRAINT valid_payment_status CHECK (payment_status IN ('paid', 'partial', 'unpaid'))
);

CREATE INDEX idx_payroll_tenant ON payroll_entries(tenant_id);
CREATE INDEX idx_payroll_worker ON payroll_entries(tenant_id, worker_name);
CREATE INDEX idx_payroll_period ON payroll_entries(tenant_id, pay_period_start);
```

---

### **19. AUDIT_LOG (Immutable Change History for Finance)**

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    record_type VARCHAR(100) NOT NULL, -- 'sale', 'expense', 'payroll', 'contribution'
    record_id UUID NOT NULL,
    
    change_type VARCHAR(50), -- 'created', 'updated', 'deleted'
    
    old_values JSONB, -- full object state before change
    new_values JSONB, -- full object state after change
    
    changed_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    changed_at TIMESTAMP DEFAULT NOW(),
    
    ip_address VARCHAR(45), -- for security
    user_agent TEXT
);

CREATE INDEX idx_audit_log_tenant ON audit_logs(tenant_id);
CREATE INDEX idx_audit_log_record ON audit_logs(tenant_id, record_type, record_id);
CREATE INDEX idx_audit_log_changed_at ON audit_logs(tenant_id, changed_at DESC);
```

---

## Key Design Decisions

### **1. Multi-Tenancy via Row-Level Security (RLS)**

Every table has `tenant_id`. PostgreSQL RLS policies enforce:

```sql
CREATE POLICY tenant_isolation ON animals
    USING (tenant_id = current_setting('app.tenant_id')::UUID);

ALTER TABLE animals ENABLE ROW LEVEL SECURITY;
```

Backend sets `SET LOCAL app.tenant_id = $1` at connection start. All queries automatically scoped.

**Benefit**: No accidental cross-tenant data leakage.

---

### **2. Soft Deletes for Sync Safety**

Instead of hard DELETE:

```sql
-- Don't do this:
DELETE FROM animals WHERE id = $1;

-- Do this:
UPDATE animals SET deleted_at = NOW() WHERE id = $1;
```

Mobile devices querying for changes see the deletion and sync it correctly.

---

### **3. UUIDs for Offline Sync**

All primary keys are UUIDs (v4). Allows offline creation of records without incrementing server IDs.

```sql
-- Mobile device can create:
INSERT INTO animals (id, tenant_id, ...) 
VALUES (uuid_generate_v4(), ...)
-- This UUID syncs to server without collision risk
```

---

### **4. Timestamps for Change Detection**

`updated_at` tracks when record was last modified. Sync engine queries:

```sql
SELECT * FROM animals 
WHERE tenant_id = $1 
  AND updated_at > $last_sync_timestamp
```

**Benefit**: Efficient incremental sync.

---

### **5. Activity Log as Source of Truth**

All events logged in `activities` table with full context. Example:

- **Birth Event**: 
  - ACTIVITY record (type: 'birth', mother_id, father_id, notes)
  - BIRTH_EVENT record (detailed metadata)
  - Animal records created for offspring

- **Animal Transfer**:
  - ACTIVITY record (type: 'transfer', animal_id, housing_unit_id)
  - CURRENT_HOUSING updated
  - History preserved in activities

**Benefit**: Audit trail, ability to replay state, reports per date range.

---

### **6. Denormalization for Read Performance**

- `current_housings` table is denormalized for fast lookup
- `animals.batch_count` reduces child record counts for batch operations
- `sales.sale_items` (JSONB) avoids join for simple reports

**Trade-off**: Update multiple tables on key changes, but queries stay fast.

---

### **7. Extensible Activity System**

`activity_types` table allows custom event types per tenant. System types (Transfer, Birth, Death, Vaccination) created at tenant init. Tenants can add custom types.

**Benefit**: Farms can track domain-specific events without schema changes.

---

## Views for Reporting (Optional, for Performance)

### Stock On Hand (Current)

```sql
CREATE MATERIALIZED VIEW stock_on_hand AS
SELECT 
    sb.tenant_id,
    sb.branch_id,
    fi.id as feed_item_id,
    fi.name,
    sb.quantity_received as quantity_in,
    COALESCE(SUM(st.quantity), 0) as quantity_out,
    (sb.quantity_received - COALESCE(SUM(st.quantity), 0)) as current_quantity,
    sb.unit,
    sb.expiry_date
FROM stock_batches sb
JOIN feed_items fi ON sb.feed_item_id = fi.id
LEFT JOIN stock_transactions st ON sb.id = st.stock_batch_id
GROUP BY sb.id, fi.id, sb.unit, sb.expiry_date
WHERE sb.deleted_at IS NULL;
```

---

## Sync Conflict Resolution Rules

See [SYNC_STRATEGY.md](./03_SYNC_STRATEGY.md) for detailed conflict handling.

---

## Indexes Strategy

- **Tenant isolation**: Every index includes `tenant_id` as first column
- **Activity log**: Index on `recorded_at` for timeline queries
- **Animal lookup**: Index on species, status, tag_id
- **Stock lookup**: Index on feed_item_id, branch_id
- **Reports**: Index on date fields for filtering

---

## Future Enhancements

- **Sharding by tenant_id** if scale exceeds 10TB
- **Columnar storage** (e.g., Citus) for analytical workloads
- **Time-series DB** (InfluxDB) for weighing/production metrics
- **Document storage** (Elasticsearch) for full-text search on notes

