# REST API Specification (OpenAPI 3.0)

**Version**: 1.0  
**Base URL**: https://api.farm-mis.io/api/v1  
**Auth**: JWT Bearer Token  
**Content-Type**: application/json  

---

## Quick Reference

### Authentication

All endpoints require JWT token in header:

```
Authorization: Bearer <jwt_token>
```

Token includes: `user_id`, `tenant_id`, `role`, `exp`

### Response Format

**Success (200, 201)**:
```json
{
  "data": { ... },
  "meta": { "timestamp": "2026-02-14T10:30:00Z" }
}
```

**Error (4xx, 5xx)**:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Animal tag_id is required",
    "details": [
      { "field": "tag_id", "issue": "required" }
    ]
  }
}
```

---

## 1. Authentication Endpoints

### 1.1 Register User

**POST** `/auth/register`

Create a new user account and initialize first tenant.

```
Request:
{
  "email": "owner@farm.com",
  "password": "SecurePass123!",
  "full_name": "John Farm Owner",
  "farm_name": "Sunrise Dairy Farm"
}

Response (201):
{
  "data": {
    "user_id": "uuid",
    "tenant_id": "uuid",
    "email": "owner@farm.com",
    "role": "owner",
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 86400
  }
}
```

**Validation**:
- Email: valid format, unique
- Password: min 8 chars, 1 uppercase, 1 number, 1 special char
- farm_name: required, max 255 chars

---

### 1.2 Login

**POST** `/auth/login`

Authenticate user and issue JWT.

```
Request:
{
  "email": "owner@farm.com",
  "password": "SecurePass123!"
}

Response (200):
{
  "data": {
    "user_id": "uuid",
    "tenant_id": "uuid",
    "access_token": "eyJh...",
    "expires_in": 86400,
    "user": {
      "email": "owner@farm.com",
      "full_name": "John Farm Owner",
      "role": "owner"
    }
  }
}
```

**Errors**:
- 401: Invalid email or password
- 429: Too many attempts (rate limit 5 per minute)

---

### 1.3 Logout

**POST** `/auth/logout`

Invalidate token (optional; client can just discard token).

```
Request: (empty body)

Response (200):
{
  "data": { "message": "Logged out successfully" }
}
```

---

## 2. Tenant Endpoints

### 2.1 Get Current Tenant

**GET** `/tenants/me`

Get tenant details for authenticated user.

```
Response (200):
{
  "data": {
    "id": "uuid",
    "name": "Sunrise Dairy Farm",
    "primary_color": "#2E7D32",
    "secondary_color": "#81C784",
    "logo_url": "https://...jpg",
    "created_at": "2026-02-01T00:00:00Z",
    "updated_at": "2026-02-14T10:00:00Z"
  }
}
```

---

### 2.2 Update Tenant (Branding)

**PATCH** `/tenants/me`

Update tenant branding (admin only).

```
Request:
{
  "name": "Sunrise Dairy Farm",
  "primary_color": "#2E7D32",
  "secondary_color": "#81C784",
  "logo": <base64 or file upload>
}

Response (200):
{
  "data": { ... updated tenant ... }
}
```

**Permissions**: owner, manager

---

## 3. User Management Endpoints

### 3.1 Invite User

**POST** `/users/invite`

Invite user to tenant.

```
Request:
{
  "email": "caretaker@email.com",
  "role": "caretaker",
  "branch_ids": ["uuid", "uuid"] // optional; if empty, access to all branches
}

Response (201):
{
  "data": {
    "invitation_id": "uuid",
    "email": "caretaker@email.com",
    "role": "caretaker",
    "invitation_sent_at": "2026-02-14T10:30:00Z"
  }
}
```

**Roles**: owner | manager | caretaker | accountant | viewer

**Permissions**: owner, manager (if configured)

---

### 3.2 List Users

**GET** `/users`

List all users in tenant.

```
Query Params:
- role: optional filter (owner | manager | caretaker)
- is_active: true | false

Response (200):
{
  "data": [
    {
      "id": "uuid",
      "email": "owner@farm.com",
      "full_name": "John Farm Owner",
      "role": "owner",
      "is_active": true,
      "last_login_at": "2026-02-14T10:00:00Z"
    },
    ...
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 50
  }
}
```

**Permissions**: owner, manager

---

### 3.3 Get User

**GET** `/users/:user_id`

Get user details.

```
Response (200):
{
  "data": { ... user ... }
}
```

---

### 3.4 Update User

**PATCH** `/users/:user_id`

Update user (only manager/owner, or self for limited fields).

```
Request:
{
  "full_name": "John Smith",
  "phone": "+1234567890",
  "role": "manager" // only owner/admin can change this
}

Response (200):
{ ... updated user ... }
```

---

### 3.5 Deactivate User

**POST** `/users/:user_id/deactivate`

Deactivate user (soft; doesn't delete).

```
Response (200):
{
  "data": { "is_active": false }
}
```

**Permissions**: owner

---

## 4. Branch / Location Endpoints

### 4.1 Create Branch

**POST** `/branches`

Create a new branch/location.

```
Request:
{
  "name": "Dairy House",
  "location_lat": 1.2345,
  "location_lng": 36.7890,
  "description": "Main milking facility"
}

Response (201):
{
  "data": {
    "id": "uuid",
    "name": "Dairy House",
    "created_at": "2026-02-14T10:30:00Z"
  }
}
```

**Permissions**: owner, manager

---

### 4.2 List Branches

**GET** `/branches`

List all branches in tenant.

```
Response (200):
{
  "data": [ ... ],
  "meta": { "total": 3 }
}
```

---

### 4.3 Get Branch

**GET** `/branches/:branch_id`

Get branch detail.

```
Response (200):
{
  "data": { ... branch ... }
}
```

---

### 4.4 Update Branch

**PATCH** `/branches/:branch_id`

Update branch details.

```
Request:
{
  "name": "Dairy House (Updated)",
  "description": "..."
}

Response (200):
{ ... updated branch ... }
```

**Permissions**: owner, manager

---

### 4.5 Delete Branch

**DELETE** `/branches/:branch_id`

Soft delete branch (if no animals assigned).

```
Response (200):
{
  "data": { "deleted_at": "2026-02-14T10:30:00Z" }
}
```

**Permissions**: owner

---

## 5. Housing Unit Endpoints

### 5.1 Create Housing Unit

**POST** `/branches/:branch_id/housing-units`

Create pen, room, coop, stall, etc.

```
Request:
{
  "name": "Pen 1",
  "unit_type": "pen",
  "capacity": 50,
  "description": "Dairy cow pen"
}

Response (201):
{
  "data": {
    "id": "uuid",
    "name": "Pen 1",
    "unit_type": "pen",
    "capacity": 50,
    "branch_id": "uuid"
  }
}
```

**unit_type**: pen | coop | stall | room | pasture | other

---

### 5.2 List Housing Units

**GET** `/branches/:branch_id/housing-units`

List all housing units in a branch.

```
Response (200):
{
  "data": [ ... ],
  "meta": { "total": 12 }
}
```

---

### 5.3 Get Housing Unit Detail

**GET** `/housing-units/:housing_unit_id`

Get detail + current animals in it.

```
Response (200):
{
  "data": {
    "id": "uuid",
    "name": "Pen 1",
    "capacity": 50,
    "current_count": 23,
    "animals_in_unit": [
      { "id": "uuid", "tag_id": "C-001", "species": "cow" },
      ...
    ]
  }
}
```

---

### 5.4 Update Housing Unit

**PATCH** `/housing-units/:housing_unit_id`

Update details.

```
Request:
{
  "name": "Pen 1A",
  "capacity": 60
}

Response (200):
{ ... updated unit ... }
```

---

### 5.5 Delete Housing Unit

**DELETE** `/housing-units/:housing_unit_id`

Soft delete (if empty).

```
Response (200):
{ ... }
```

---

## 6. Animal Endpoints

### 6.1 Create Animal

**POST** `/animals`

Create individual animal or batch.

```
Request:
{
  "species": "cow",
  "breed": "Friesian",
  "sex": "female",
  "tag_id": "C-001",
  "name": "Bessie",
  "is_batch": false,
  "batch_count": null,
  "arrival_date": "2025-12-01",
  "age_estimate_weeks": 52,
  "origin": "Local supplier",
  "branch_id": "uuid",
  "housing_unit_id": "uuid"
}

Response (201):
{
  "data": {
    "id": "uuid",
    "tag_id": "C-001",
    "species": "cow",
    "status": "active",
    "created_at": "2026-02-14T10:30:00Z"
  }
}
```

**Batch Example**:
```json
{
  "species": "chicken",
  "breed": "Broiler",
  "is_batch": true,
  "batch_count": 200,
  "arrival_date": "2026-01-15",
  "branch_id": "uuid",
  "housing_unit_id": "uuid"
}
```

**Permissions**: caretaker, manager, owner

---

### 6.2 List Animals

**GET** `/animals`

List animals with filters.

```
Query Params:
- branch_id: uuid
- species: string (cow, pig, chicken, goat, sheep)
- status: active | sold | dead | transferred_out
- housing_unit_id: uuid
- page: 1 (default)
- limit: 50 (default)
- search: tag_id, name (partial match)

Response (200):
{
  "data": [
    {
      "id": "uuid",
      "tag_id": "C-001",
      "name": "Bessie",
      "species": "cow",
      "breed": "Friesian",
      "status": "active",
      "arrival_date": "2025-12-01",
      "current_housing": {
        "id": "uuid",
        "name": "Pen 1"
      },
      "is_batch": false,
      "batch_count": null
    },
    ...
  ],
  "meta": {
    "total": 250,
    "page": 1,
    "limit": 50
  }
}
```

---

### 6.3 Get Animal Detail

**GET** `/animals/:animal_id`

Get full animal details + timeline.

```
Query Params:
- include_timeline: true (default false for performance)

Response (200):
{
  "data": {
    "id": "uuid",
    "tag_id": "C-001",
    "name": "Bessie",
    "species": "cow",
    "breed": "Friesian",
    "sex": "female",
    "status": "active",
    "arrival_date": "2025-12-01",
    "age_estimate_weeks": 52,
    "birth_date": null,
    "origin": "Local supplier",
    "photo_url": "https://...",
    "mother_id": null,
    "father_id": null,
    "current_housing": {
      "id": "uuid",
      "name": "Pen 1",
      "branch": { "id": "uuid", "name": "Dairy House" }
    },
    "created_at": "2025-12-01T00:00:00Z",
    "updated_at": "2026-02-14T10:30:00Z",
    
    "timeline": [ // if include_timeline=true
      {
        "id": "uuid",
        "activity_type": "vaccination",
        "recorded_at": "2026-02-10T14:00:00Z",
        "recorded_by": { "id": "uuid", "full_name": "John Caretaker" },
        "notes": "Vaccinated against FMD",
        "photo_url": null
      },
      ...
    ]
  }
}
```

---

### 6.4 Update Animal

**PATCH** `/animals/:animal_id`

Update animal details (not status change).

```
Request:
{
  "name": "Bessie Jr.",
  "breed": "Friesian",
  "age_estimate_weeks": 53
}

Response (200):
{ ... updated animal ... }
```

**Permissions**: caretaker (own branch), manager, owner

---

### 6.5 Mark Animal as Sold

**POST** `/animals/:animal_id/mark-sold`

Mark animal status as "sold".

```
Request:
{
  "sale_id": "uuid" // link to sale record
}

Response (200):
{
  "data": {
    "id": "uuid",
    "status": "sold",
    "status_changed_at": "2026-02-14T10:30:00Z"
  }
}
```

---

### 6.6 Mark Animal as Dead

**POST** `/animals/:animal_id/mark-dead`

Mark status as "dead".

```
Request:
{
  "cause": "Disease",
  "date": "2026-02-14"
}

Response (200):
{
  "data": {
    "id": "uuid",
    "status": "dead",
    "status_changed_at": "2026-02-14T18:00:00Z"
  }
}
```

---

### 6.7 Delete Animal

**DELETE** `/animals/:animal_id`

Soft delete animal.

```
Response (200):
{ ... }
```

**Permissions**: owner

---

## 7. Activity / Event Endpoints

### 7.1 Create Activity

**POST** `/activities`

Record an event/activity.

```
Request:
{
  "activity_type_id": "uuid",// or "activity_type_name": "vaccination"
  "related_animal_ids": ["uuid", "uuid"],
  "related_housing_unit_id": "uuid",
  "recorded_at": "2026-02-14T14:30:00Z",
  "notes": "Vaccinated against FMD",
  "photo_url": null
}

Response (201):
{
  "data": {
    "id": "uuid",
    "activity_type": "vaccination",
    "recorded_at": "2026-02-14T14:30:00Z",
    "recorded_by": { "id": "uuid", "full_name": "John Caretaker" },
    "created_at": "2026-02-14T15:00:00Z"
  }
}
```

**Transfer Activity Example**:
```json
{
  "activity_type_name": "transfer",
  "related_animal_ids": ["uuid"],
  "related_housing_unit_id": "uuid-pen-2",
  "recorded_at": "2026-02-14T10:00:00Z",
  "notes": "Moved to Pen 2"
}
```

**Birth Event Example**:
```json
{
  "activity_type_name": "birth",
  "related_animal_ids": ["uuid-mother"],
  "recorded_at": "2026-02-14T09:00:00Z",
  "notes": "5 calves born",
  "birth_event_data": {
    "mother_id": "uuid-mother",
    "father_id": "uuid-father",
    "number_born": 5,
    "number_deceased": 0
  }
}
```

---

### 7.2 List Activities

**GET** `/activities`

List activities with filters.

```
Query Params:
- branch_id: uuid
- animal_id: uuid
- activity_type: string (filter by type)
- start_date: 2026-02-01
- end_date: 2026-02-14
- page: 1
- limit: 100 (default)

Response (200):
{
  "data": [
    {
      "id": "uuid",
      "activity_type": "vaccination",
      "recorded_at": "2026-02-10T14:00:00Z",
      "recorded_by": { "id": "uuid", "full_name": "John Caretaker" },
      "related_animals": [ ... ],
      "notes": "..."
    },
    ...
  ],
  "meta": {
    "total": 1250,
    "page": 1,
    "limit": 100
  }
}
```

---

### 7.3 Get Activity Detail

**GET** `/activities/:activity_id`

Get full activity with all linked records.

```
Response (200):
{
  "data": {
    "id": "uuid",
    "activity_type": "birth",
    "recorded_at": "2026-02-14T09:00:00Z",
    "recorded_by": { ... },
    "related_animals": [
      { "id": "uuid", "tag_id": "C-001", "name": "Bessie (mother)" },
      { "id": "uuid", "tag_id": "C-002", "name": "Calf 1 (offspring)" },
      ...
    ],
    "related_housing_unit": { ... },
    "notes": "...",
    "photo_url": "...",
    
    "birth_event": {
      "number_born": 5,
      "number_deceased": 0
    },
    
    "created_at": "2026-02-14T09:30:00Z"
  }
}
```

---

### 7.4 Update Activity

**PATCH** `/activities/:activity_id`

Update activity notes, etc.

```
Request:
{
  "notes": "Updated note"
}

Response (200):
{ ... updated activity ... }
```

**Note**: Once activity is archived/locked (immutable), cannot edit.

---

### 7.5 Delete Activity

**DELETE** `/activities/:activity_id`

Soft delete activity (only if not locked).

```
Response (200):
{ ... }
```

---

### 7.6 Get Animal Timeline

**GET** `/animals/:animal_id/timeline`

Timeline of all activities related to animal.

```
Query Params:
- limit: 50
- offset: 0

Response (200):
{
  "data": [
    { "id": "uuid", "activity_type": "birth", "recorded_at": "..." },
    { "id": "uuid", "activity_type": "transfer", "recorded_at": "..." },
    { "id": "uuid", "activity_type": "vaccination", "recorded_at": "..." },
    ...
  ]
}
```

---

### 7.7 List Activity Types

**GET** `/activity-types`

Get all activity types (system + custom).

```
Response (200):
{
  "data": [
    { "id": "uuid", "name": "Transfer", "is_system": true },
    { "id": "uuid", "name": "Birth", "is_system": true },
    { "id": "uuid", "name": "Death", "is_system": true },
    { "id": "uuid", "name": "Vaccination", "is_system": true },
    { "id": "uuid", "name": "Treatment", "is_system": true },
    { "id": "uuid", "name": "Weighing", "is_system": false },
    ...
  ]
}
```

---

## 8. Feed & Inventory Endpoints

### 8.1 Create Feed Item

**POST** `/feed-items`

Create a feed/medicine/vaccine type.

```
Request:
{
  "name": "Layer Mash",
  "category": "feed",
  "unit": "kg"
}

Response (201):
{
  "data": {
    "id": "uuid",
    "name": "Layer Mash",
    "category": "feed",
    "unit": "kg"
  }
}
```

**Categories**: feed | medicine | vaccine | disinfectant | bedding | other

---

### 8.2 List Feed Items

**GET** `/feed-items`

List all feed types.

```
Query Params:
- category: feed (filter)

Response (200):
{
  "data": [ ... ]
}
```

---

### 8.3 Create Stock Batch (Purchase)

**POST** `/stock-batches`

Record feed purchase.

```
Request:
{
  "feed_item_id": "uuid",
  "branch_id": "uuid",
  "received_date": "2026-02-10",
  "supplier_name": "Feed Supplier Co.",
  "quantity_received": 500,
  "unit": "kg",
  "cost_per_unit": 10,
  "total_cost": 5000,
  "expiry_date": "2026-08-10",
  "notes": "Good quality"
}

Response (201):
{
  "data": {
    "id": "uuid",
    "feed_item": { "id": "uuid", "name": "Layer Mash" },
    "quantity_received": 500,
    "quantity_remaining": 500,
    "expiry_date": "2026-08-10"
  }
}
```

---

### 8.4 List Stock Batches

**GET** `/stock-batches`

List purchases.

```
Query Params:
- branch_id: uuid
- feed_item_id: uuid
- include_expired: false

Response (200):
{
  "data": [
    {
      "id": "uuid",
      "feed_item": { "name": "Layer Mash" },
      "quantity_received": 500,
      "quantity_remaining": 340,
      "expiry_date": "2026-08-10",
      "received_date": "2026-02-10"
    },
    ...
  ]
}
```

---

### 8.5 Record Stock Transaction (Usage/Wastage)

**POST** `/stock-transactions`

Record usage, wastage, or transfer of feed.

```
Request:
{
  "stock_batch_id": "uuid",
  "transaction_type": "usage",
  "quantity": 50,
  "unit": "kg",
  "related_animal_id": "uuid",
  "related_housing_unit_id": "uuid",
  "transaction_date": "2026-02-14",
  "notes": "Fed 10 cattle"
}

Response (201):
{
  "data": {
    "id": "uuid",
    "transaction_type": "usage",
    "quantity": 50,
    "transaction_date": "2026-02-14"
  }
}
```

**transaction_type**: usage | wastage | transfer | adjust

---

### 8.6 Get Stock on Hand

**GET** `/stock/on-hand`

Current stock levels by item.

```
Query Params:
- branch_id: uuid (optional)

Response (200):
{
  "data": [
    {
      "feed_item_id": "uuid",
      "feed_item_name": "Layer Mash",
      "total_on_hand": 3400,
      "unit": "kg",
      "low_stock_threshold": 500,
      "is_low": false,
      "batches": [
        { "batch_id": "uuid", "quantity": 500, "expiry": "2026-08-10" },
        ...
      ]
    },
    ...
  ]
}
```

---

### 8.7 List Stock Transactions

**GET** `/stock-transactions`

Usage history.

```
Query Params:
- stock_batch_id: uuid
- animal_id: uuid
- transaction_type: usage
- start_date: 2026-02-01
- end_date: 2026-02-14

Response (200):
{
  "data": [ ... ]
}
```

---

## 9. Sale Endpoints

### 9.1 Create Sale

**POST** `/sales`

Record animal/product sale.

```
Request:
{
  "branch_id": "uuid",
  "sale_date": "2026-02-14",
  "buyer_name": "John Buyer",
  "buyer_contact": "john@buyer.com",
  "sale_items": [
    {
      "animal_id": "uuid",
      "quantity": 1,
      "unit_price": 500000,
      "description": "Friesian cow, 2 years old"
    }
  ],
  "total_price": 500000,
  "payment_status": "paid",
  "payment_method": "cash",
  "amount_received": 500000
}

Response (201):
{
  "data": {
    "id": "uuid",
    "sale_date": "2026-02-14",
    "total_price": 500000,
    "payment_status": "paid",
    "created_at": "2026-02-14T10:30:00Z"
  }
}
```

---

### 9.2 List Sales

**GET** `/sales`

List sales with filters.

```
Query Params:
- branch_id: uuid
- start_date: 2026-02-01
- end_date: 2026-02-14
- payment_status: paid | partial | unpaid
- page: 1
- limit: 50

Response (200):
{
  "data": [
    {
      "id": "uuid",
      "sale_date": "2026-02-14",
      "buyer_name": "John Buyer",
      "total_price": 500000,
      "payment_status": "paid",
      "sale_items": [ ... ]
    },
    ...
  ],
  "meta": { "total": 42, "page": 1 }
}
```

---

### 9.3 Update Sale

**PATCH** `/sales/:sale_id`

Update sale (mark as paid, etc.).

```
Request:
{
  "payment_status": "paid",
  "amount_received": 500000
}

Response (200):
{ ... updated sale ... }
```

---

### 9.4 Delete Sale

**DELETE** `/sales/:sale_id`

Soft delete.

```
Response (200):
{ ... }
```

---

## 10. Expense Endpoints

### 10.1 Create Expense

**POST** `/expenses`

Record cost/expense.

```
Request:
{
  "branch_id": "uuid",
  "expense_date": "2026-02-14",
  "category": "vet",
  "description": "Vaccination and checkup",
  "vendor_name": "Dr. Smith Veterinary",
  "amount": 15000,
  "payment_method": "bank_transfer",
  "payment_status": "paid",
  "receipt_url": "https://..."
}

Response (201):
{
  "data": {
    "id": "uuid",
    "category": "vet",
    "amount": 15000,
    "created_at": "2026-02-14T10:30:00Z"
  }
}
```

**Categories**: feed | vet | fuel | repairs | utilities | transport | labor | other

---

### 10.2 List Expenses

**GET** `/expenses`

List expenses with filters.

```
Query Params:
- branch_id: uuid
- category: string
- start_date: 2026-02-01
- end_date: 2026-02-14
- page: 1
- limit: 50

Response (200):
{
  "data": [ ... ],
  "meta": { "total": 500, "page": 1 }
}
```

---

### 10.3 Update Expense

**PATCH** `/expenses/:expense_id`

Update expense.

```
Response (200):
{ ... }
```

---

### 10.4 Delete Expense

**DELETE** `/expenses/:expense_id`

Soft delete.

```
Response (200):
{ ... }
```

---

## 11. Payroll Endpoints

### 11.1 Create Payroll Entry

**POST** `/payroll`

Record worker pay.

```
Request:
{
  "branch_id": "uuid",
  "worker_name": "Samuel Caretaker",
  "worker_contact": "samuel@worker.com",
  "pay_period_start": "2026-02-01",
  "pay_period_end": "2026-02-28",
  "wage_type": "monthly",
  "wage_rate": 500000,
  "days_worked": 28,
  "gross_pay": 500000,
  "advances_given": 100000,
  "loans_given": 0,
  "deductions": 50000,
  "net_pay": 350000,
  "payment_date": "2026-02-28",
  "payment_method": "cash"
}

Response (201):
{
  "data": {
    "id": "uuid",
    "worker_name": "Samuel Caretaker",
    "net_pay": 350000,
    "payment_date": "2026-02-28"
  }
}
```

**wage_type**: daily | weekly | monthly

---

### 11.2 List Payroll

**GET** `/payroll`

List payroll entries.

```
Query Params:
- branch_id: uuid
- worker_name: string
- start_date: 2026-02-01
- end_date: 2026-02-28
- payment_status: paid | partial | unpaid

Response (200):
{
  "data": [ ... ]
}
```

---

## 12. Reports Endpoints

### 12.1 Dashboard

**GET** `/reports/dashboard`

Quick overview stats.

```
Query Params:
- branch_id: uuid (optional; all branches if not provided)

Response (200):
{
  "data": {
    "animal_count_by_species": {
      "cow": 25,
      "chicken": 500,
      "pig": 30,
      ...
    },
    "total_animals": 555,
    "deaths_this_month": 3,
    "births_this_month": 12,
    "feed_status": {
      "low_stock_items": [
        { "item": "Layer Mash", "on_hand": 150, "threshold": 500 }
      ],
      "total_items": 12
    },
    "sales_this_week": {
      "count": 2,
      "revenue": 1500000
    },
    "expenses_this_week": {
      "count": 5,
      "total": 250000
    }
  }
}
```

---

### 12.2 Animals Report

**GET** `/reports/animals`

Count by species, status, branch.

```
Query Params:
- branch_id: uuid
- species: string (filter)

Response (200):
{
  "data": {
    "by_species": {
      "cow": { "active": 25, "sold": 5, "dead": 2 },
      "chicken": { "active": 500, "sold": 200, "dead": 30 },
      ...
    },
    "grand_total": 555
  }
}
```

---

### 12.3 Activities Report

**GET** `/reports/activities`

Births, deaths, treatments by date.

```
Query Params:
- start_date: 2026-02-01
- end_date: 2026-02-28
- activity_type: birth | death | vaccination (filter)

Response (200):
{
  "data": {
    "births": {
      "total": 12,
      "by_week": [ ... ]
    },
    "deaths": {
      "total": 3,
      "by_week": [ ... ]
    },
    "treatments": {
      "total": 45,
      "by_type": [ ... ]
    }
  }
}
```

---

### 12.4 Feed Report

**GET** `/reports/feed`

Stock on hand, usage trends.

```
Query Params:
- branch_id: uuid

Response (200):
{
  "data": {
    "on_hand": [
      { "item": "Layer Mash", "quantity": 1200, "unit": "kg", "threshold": 500 },
      ...
    ],
    "usage_last_30_days": [
      { "item": "Layer Mash", "qty_used": 4500, "avg_per_day": 150 },
      ...
    ],
    "low_stock_items": [ ... ]
  }
}
```

---

### 12.5 Sales Report

**GET** `/reports/sales`

Sales by species/product/month.

```
Query Params:
- start_date: 2026-02-01
- end_date: 2026-02-28
- branch_id: uuid

Response (200):
{
  "data": {
    "total_sales": 42,
    "total_revenue": 21000000,
    "by_species": {
      "cow": { "count": 2, "revenue": 10000000 },
      "chicken": { "count": 40, "revenue": 8000000 },
      ...
    },
    "by_month": [ ... ],
    "payment_status": {
      "paid": 40,
      "partial": 1,
      "unpaid": 1
    }
  }
}
```

---

### 12.6 Expense Report

**GET** `/reports/expenses`

Expenses by category, trend.

```
Query Params:
- start_date: 2026-02-01
- end_date: 2026-02-28
- branch_id: uuid

Response (200):
{
  "data": {
    "total_expenses": 2500000,
    "by_category": {
      "feed": 1200000,
      "vet": 800000,
      "fuel": 300000,
      "repairs": 200000
    },
    "by_month": [ ... ]
  }
}
```

---

### 12.7 Profit Snapshot

**GET** `/reports/profit`

Simple sales − expenses.

```
Query Params:
- start_date: 2026-02-01
- end_date: 2026-02-28
- branch_id: uuid

Response (200):
{
  "data": {
    "total_sales": 21000000,
    "total_expenses": 2500000,
    "net_profit": 18500000,
    "note": "Does not include non-tracked costs (labor, depreciation, etc.)"
  }
}
```

---

## 13. Sync Endpoints (Offline Support)

### 13.1 Push Changes

**POST** `/sync/push`

Mobile → Server. Batch upload.

```
Request:
{
  "last_sync_timestamp": "2026-02-14T08:00:00Z",
  "changes": [
    {
      "operation": "create|update|delete",
      "entity_type": "animal|activity|feed|sale|expense",
      "payload": { full record },
      "client_timestamp": "2026-02-14T10:00:00Z"
    },
    ...
  ]
}

Response (200):
{
  "data": {
    "synced_count": 15,
    "conflicts": [
      {
        "entity_type": "animal",
        "entity_id": "uuid",
        "server_version": { ... },
        "client_version": { ... },
        "resolution_rule": "last-write-wins"
      }
    ]
  }
}
```

---

### 13.2 Pull Changes

**GET** `/sync/pull`

Server → Mobile. Download updates.

```
Query Params:
- last_sync_timestamp: 2026-02-14T08:00:00Z

Response (200):
{
  "data": {
    "changes": [
      {
        "entity_type": "animal",
        "operation": "create",
        "payload": { ... },
        "updated_at": "2026-02-14T10:15:00Z"
      },
      ...
    ],
    "server_timestamp": "2026-02-14T11:00:00Z"
  }
}
```

---

## Error Codes Reference

| Code | HTTP | Meaning |
|------|------|---------|
| VALIDATION_ERROR | 400 | Input validation failed |
| UNAUTHORIZED | 401 | Missing or invalid JWT |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Conflicting change (sync) |
| RATE_LIMITED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |
| NOT_IMPLEMENTED | 501 | Feature not yet implemented |

---

## Rate Limits

- Anonymous: 10 req/min
- Authenticated: 100 req/min per user
- Batch operations: 5 req/min

---

## Pagination

All list endpoints support:
- `page`: 1-indexed
- `limit`: 1–500 (default 50)

Response includes `meta.total` + `meta.has_more`.

---

## Versioning

Current API: **v1**

Breaking changes will increment version (e.g., `/api/v2/...`).

---

## Conclusion

This REST API is:
- ✅ Comprehensive (13+ endpoint groups)
- ✅ Mobile-friendly (JSON, pagination, sync)
- ✅ Scalable (filtering, pagination, async)
- ✅ Secure (JWT, RLS, audit)
- ✅ Offline-capable (sync endpoints)

Implement iteratively; start with auth + animals, then add features per milestone.

