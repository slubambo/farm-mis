# Product Requirements Document (PRD)
## Offline-First Farm Management System

**Version**: 1.0  
**Date**: 2026-02-14  
**Product Manager**: You  
**Target Users**: Farm owners, caretakers, accountants  

---

## 1. Executive Summary

**AgroMIS** is an offline-first, multi-tenant farm management platform designed for modest farms (10–100 animals per species, 2–5 branches). It enables farm owners and caretakers to track animals, feed inventory, activities, sales, expenses, and payroll—working seamlessly online and offline. The system syncs automatically when internet returns, with conflict resolution built-in.

**Core Value Prop**: 
- 📱 **Works offline** — caretakers record data without internet
- 🏢 **Multi-tenant** — sellable to other farms
- 📊 **Visibility** — simple reports + profit tracking
- 🚀 **Fast** — minimal clicks, built for speed

---

## 2. Problem Statement

### Current Situation
Farm owners struggle with:
- **Manual record-keeping** (paper, spreadsheets) → data loss, errors
- **Animal tracking uncertainty** → don't know which animal is where, when it arrived, family history
- **Feed visibility** → stock runs out unexpectedly, no historical usage data
- **Finance blindness** → can't easily see sales, expenses, partner contributions, profitability
- **Multi-branch chaos** → if farm has 2+ locations, coordination is manual
- **Mobile/offline gaps** → rural areas have patchy internet; need offline capability
- **No audit trail** → especially for finance, hard to justify decisions or spot fraud

### Our Solution
A purpose-built farm management system that:
- Tracks every animal, feed batch, activity, and transaction
- Works offline on mobile without any internet
- Syncs data when internet returns (no manual reconciliation)
- Provides clean dashboards and reports
- Supports multiple branches and staff with permissioning

---

## 3. Product Vision (Non-Negotiable)

### What AgroMIS Does

#### **Animal Management**
- Create individual animal records (ID, name, photo, breed, DOB estimate, origin)
- Or batch records (e.g., 200 broiler chickens, arrival date)
- Track animal location (room/pen/coop/stall)
- Record births, deaths, transfers, treatments, vaccinations, weighing
- View family trees (mother, father, offspring)
- Mark as sold or transferred out

#### **Feed & Consumables Inventory**
- Record purchases: feed type, quantity, cost, supplier, expiry date
- Track usage: which animals ate it, how much, when
- Report: current stock on hand, low-stock warnings
- Calculate feed costs per animal or batch
- Track wastage and spoilage

#### **Activities/Events Log**
- Record treatments (medication, vaccination, deworming, other)
- Birth events (mother, father, number born, photos)
- Transfers (animal moved to new housing)
- Deaths (date, cause, notes)
- Weighing (date, weight, animal)
- Cleaning/maintenance of housing units
- Egg collection / milk yield (if applicable)
- Custom activity types

#### **Sales & Finance**
- Record sales: animals/products sold, quantity, price, buyer, payment status
- Track expenses: category (feed, vet, fuel, repairs, utilities, etc.), amount, vendor, branch
- Partner contributions: cash or in-kind (animals, feed, equipment), track totals
- Payroll: worker wages, advances/loans, payment history

#### **Multi-Branch Support**
- Farm can have 2+ branches/locations
- Each branch has housing units (rooms, pens, coops, stalls)
- Animals assigned to branches
- Users can be restricted to specific branches
- Reports can be filtered by branch

#### **Reports & Dashboards**
- **Dashboard**: quick overview (animal count, recent deaths, feed status, sales today)
- **Animal Report**: counts by species/breed/status, by branch
- **Activity Report**: births, deaths, treatments by date range
- **Feed Report**: current stock, usage by animal/batch, low-stock alerts
- **Sales Report**: by species/product/month, revenue, profitability
- **Expense Report**: by category/month/branch
- **Partner Contribution**: totals, what each partner contributed
- **Profit Snapshot**: sales − expenses (with caveats about non-tracked costs)

---

## 4. Target Users & Personas

### **1. Farm Owner (Admin)**
- **Goals**: See full picture, make decisions, manage team, track profitability
- **Tools used**: Dashboard, reports, settings, user management
- **Frequency**: 2–3 times per week
- **Pain points**: Too much data, wants clean summaries

### **2. Caretaker (Worker)**
- **Goals**: Record daily work fast, check animal status
- **Tools used**: Dashboard, quick actions, activity log, animal detail
- **Frequency**: Daily (2–3 times)
- **Pain points**: Slow interfaces, too many clicks, internet unreliable

### **3. Accountant / Finance Manager**
- **Goals**: Track expenses, sales, payroll, contributions
- **Tools used**: Finance section, reports, approvals
- **Frequency**: Weekly + month-end
- **Pain points**: Missing receipts, manual reconciliation

### **4. Manager (Branch/Multi-person)**
- **Goals**: Approve expenses/sales, overview branch status
- **Tools used**: Dashboard, approvals, branch reports
- **Frequency**: Daily

---

## 5. Core Functionality (MVP)

### **A. Onboarding & Setup**
- [ ] Tenant creation (farm name, owner info)
- [ ] Branding (primary/secondary color, logo upload)
- [ ] Create first branch/location
- [ ] Create housing units (rooms, pens, etc.)
- [ ] Invite users (email + set role)

### **B. Animal Management**
- [ ] Create animal (individual or batch)
  - Species, breed, sex, arrival date, age estimate, origin
  - Housing assignment
  - Photo upload
- [ ] Edit animal details
- [ ] Search/filter animals by species, branch, status
- [ ] View animal timeline (all events)
- [ ] Record birth event
  - Mother, father optional
  - Number born, date, notes
  - Link offspring
- [ ] Record age/weight
- [ ] Transfer animal (move to different housing unit)
- [ ] Mark as sold (date, buyer, price)
- [ ] Mark as dead (date, cause, notes)
- [ ] View family tree (parents, children)

### **C. Activities/Events**
- [ ] Record activity (treatment, vaccination, transfer, death, birth, cleaning, etc.)
  - Type, date, animal(s), notes, photo
  - Link to housing unit if relevant
- [ ] Activity timeline (view all recorded events)
- [ ] Edit/delete activity (with audit trail)
- [ ] Assign activity to user (who recorded it)

### **D. Feed & Consumables**
- [ ] Create feed type/consumable
- [ ] Record purchase (supplier, quantity, cost, expiry)
- [ ] View stock on hand
- [ ] Record usage (animal/batch, quantity, date)
- [ ] View usage history per animal/batch
- [ ] Low-stock alerts (configurable thresholds)
- [ ] Wastage/spoilage adjustments

### **E. Sales & Finance**
- [ ] Record sale
  - Animals/products sold
  - Quantity, unit price, total
  - Buyer name
  - Payment status (paid/partial/unpaid)
  - Date
- [ ] Record expense
  - Category, amount, vendor, date
  - Receipt photo upload
  - Branch assignment
- [ ] Record partner contribution (cash or in-kind)
  - Type, amount/value, date, category
  - Link to batch if in-kind
- [ ] View contributions by partner
- [ ] Record payroll entry
  - Worker, wage type, period, advances/loans, net pay
- [ ] Payment history

### **F. Multi-Branch Support**
- [ ] Assign animals to branch
- [ ] Define housing units per branch
- [ ] Filter dashboard/reports by branch
- [ ] User permissions scoped to branch (if applicable)

### **G. Reports & Dashboards**
- [ ] Dashboard: quick cards (animal count, recent activity, feed status, sales last 7 days)
- [ ] Animal Report: count by species/branch/status
- [ ] Activity Report: births, deaths, treatments by date range
- [ ] Feed Report: stock on hand, usage, low alerts
- [ ] Sales Report: summary by species/month, revenue
- [ ] Expense Report: by category/month
- [ ] Partner Contribution Report: totals, breakdown
- [ ] Export reports as CSV (Excel-friendly)

### **H. Offline-First & Sync**
- [ ] Local database (SQLite) on mobile
- [ ] Queue changes when offline
- [ ] Auto-sync when internet returns
- [ ] Conflict detection and resolution
- [ ] Sync status indicator (offline/syncing/synced)
- [ ] Retry failed syncs

### **I. User & Permissions**
- [ ] User registration (email + password)
- [ ] User login (JWT)
- [ ] Invite users to tenant (email)
- [ ] Assign roles: Owner, Manager, Caretaker, Accountant, Viewer
- [ ] Per-branch permissions (caretaker sees own branch only)
- [ ] Change roles/permissions
- [ ] Audit log (who changed what and when, for finance records)

---

## 6. User Stories (Selection)

### **Epic: Tenant Setup**
```gherkin
Feature: Farm Owner creates and configures a farm tenant

  Scenario: Create new farm tenant
    Given I am a new user
    When I sign up with email
    And I provide farm name
    And I upload logo and choose colors
    Then a new tenant is created
    And I am set as the owner

  Scenario: Invite team member
    Given I am a farm owner
    When I invite a caretaker via email
    And select "Caretaker" role
    Then they receive an invite
    And can sign in and see only their assigned branch
```

### **Epic: Animal Intake (Critical for Farms)**
```gherkin
Feature: Farm owner records new animals arriving

  Scenario: Record individual animal arrival
    Given I am a caretaker
    When I create a new animal record
    And enter: species (cow), breed, sex, arrival date, tag # (e.g., "C-001")
    And select housing unit (Barn A, Pen 1)
    And optionally upload photo
    Then animal is created and visible on dashboard
    And I can record activities for it immediately

  Scenario: Record batch of animals (e.g., broiler chickens)
    Given I am a caretaker
    When I create a batch record
    And enter: species (chicken), type (broiler), quantity (200), arrival date
    And select housing unit
    Then batch is created
    And I can record usage/mortality as batch activities
```

### **Epic: Daily Work (Caretaker)**
```gherkin
Feature: Caretaker records daily activities quickly

  Scenario: Record feed usage
    Given I am a caretaker (offline or online)
    When I tap "Record Feed Use"
    And select animal/batch and feed type
    And enter quantity used
    And tap Save
    Then activity is recorded (even if offline)
    And syncs to server when online

  Scenario: Report animal death
    Given I am a caretaker
    When an animal dies
    And I tap "Record Death"
    And enter: which animal, date, cause
    Then animal is marked as dead
    And visible in death report
    And owner is notified (Phase 2)

  Scenario: Record treatment (vaccination, deworming)
    Given I am a caretaker
    When I tap "Record Treatment"
    And select: animal, treatment type, date
    And optionally add notes/photo
    Then activity is logged
    And timeline shows treatment
```

### **Epic: Sales & Finance**
```gherkin
Feature: Record sales and expenses

  Scenario: Record sale (quick)
    Given I am a manager or owner
    When I tap "Record Sale"
    And select: animal/product, quantity, price per unit
    And enter buyer name, payment status
    Then sale is recorded
    And appears in Sales Report
    And contributes to revenue calculation

  Scenario: Record expense with receipt
    Given I am a manager
    When I tap "Record Expense"
    And enter: category (vet, feed, fuel, etc.), amount
    And optionally upload receipt photo
    Then expense is recorded
    And appears in Expense Report
    And contributes to cost calculation
```

### **Epic: Reports & Insights**
```gherkin
Feature: Owner views reports and profit status

  Scenario: View dashboard overview
    Given I am a farm owner
    When I open the dashboard
    Then I see: animal count by species, recent deaths, feed low-stock alerts, sales last 7 days
    And can tap to drill into details

  Scenario: View profitability
    Given I am a farm owner
    When I view the Profit Snapshot report
    Then I see: total sales, total expenses, net profit (with caveats)
    And can filter by date range or branch
```

---

## 7. Non-Functional Requirements

| NFR | Target | Notes |
|-----|--------|-------|
| **Availability** | 99.5% uptime (Railway SLA) | Backup & restore plan in place |
| **Performance** | Loads < 2s on 3G, lists render instantly | Index heavily; pagination for 10k+ records |
| **Offline Support** | Full functionality on mobile without internet | Sync validation required |
| **Scalability** | Support 1000+ tenants, 10k+ animals per tenant | NestJS + PostgreSQL proven path |
| **Security** | OWASP Top 10 mitigated, data encrypted in transit | HTTPS, CORS restricted, input validation |
| **Audit Trail** | All finance records immutable with who/when | Tamper-evident logs |
| **Multi-tenancy** | Complete isolation, no tenant data leakage | Row-level security, tenant_id on all queries |
| **Backup** | Daily automated, restorable within 24h | Railway PostgreSQL + weekly exports |

---

## 8. Out of Scope (MVP)

- ❌ Complex accounting (double-entry, cost centers)
- ❌ IoT/sensor integrations
- ❌ SMS/WhatsApp notifications
- ❌ Advanced analytics or ML predictions
- ❌ Mobile app store deployment (Phase 2)
- ❌ Multi-currency support
- ❌ Integrations with other farm systems

---

## 9. Success Metrics

By end of MVP:
- [ ] Farm owner can set up tenant in < 10 minutes
- [ ] Caretaker can record activity in < 30 seconds (offline or online)
- [ ] Dashboard loads in < 2 seconds
- [ ] Offline mobile works flawlessly for 24h disconnection
- [ ] Sync recovers data correctly after net outage
- [ ] All core reports generate correctly with correct totals
- [ ] Zero data loss (audit trail shows all changes)

---

## 10. Roll-Out Plan

### **MVP (Week 1–12)**
- Tenant creation + branding
- Core animal + activity tracking
- Feed inventory
- Basic sales + expenses
- Offline sync
- Dashboard + simple reports
- Deploy to Railway

### **v1.0 (Week 13–16)**
- Polish UX (animations, error messages)
- Performance optimization
- Comprehensive testing (unit + integration + e2e)
- User documentation + training materials
- Feedback incorporation

### **Phase 2 (Future)**
- Payment processing (Stripe/Razorpay)
- SMS/Email notifications
- Mobile app store deployments
- Advanced analytics
- IoT integrations

---

## Appendix: Glossary

| Term | Definition |
|------|-----------|
| **Tenant** | A farm organization; isolated data environment; one per paying customer |
| **Branch** | A farm location/sub-farm (e.g., "Dairy House", "Chicken Shed #2") |
| **Housing Unit** | A pen, room, coop, stall, or section where animals stay |
| **Animal** | Individual tracked animal (e.g., "C-001", Friesian cow) |
| **Batch** | Group of animals tracked together (e.g., 200 broiler chickens) |
| **Activity** | Event recorded (birth, death, treatment, transfer, feed use, etc.) |
| **Sync** | Process of pushing local changes to server and pulling remote changes |
| **Conflict** | When two devices change the same record while offline |

