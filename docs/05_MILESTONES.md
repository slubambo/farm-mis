# Implementation Roadmap & Milestones

**Version**: 1.0  
**Duration**: 12–16 weeks  
**Team**: You (1 developer) or small team  

---

## Milestone Overview

```
┌─────────────────────────────────────────────────────────────┐
│   PHASE 1: MVP (Weeks 1–12)                                │
│   ├─ Foundation (Weeks 1–3): Setup, auth, tenant mgmt      │
│   ├─ Core Entities (Weeks 4–7): Animals, activities, feeds │
│   ├─ Finance (Weeks 8–9): Sales, expenses, payroll         │
│   ├─ Offline Sync (Weeks 10–11): Full offline + conflict   │
│   └─ Reports & Polish (Week 12): Dashboards, reports       │
│                                                              │
│   PHASE 2: v1.0 (Weeks 13–16)                               │
│   └─ QA, performance tuning, documentation                  │
│                                                              │
│   PHASE 3: Beyond MVP (Future)                             │
│   └─ Payment processing, enhanced features                  │
└─────────────────────────────────────────────────────────────┘
```

---

## PHASE 1: MVP (Weeks 1–12)

### **WEEK 1–3: Foundation**

#### Goals
- Backend skeleton ready (NestJS + TypeORM)
- PostgreSQL schema created
- JWT authentication working
- Tenant creation flow
- Mobile project scaffolded (Flutter)

#### Deliverables

**Backend (NestJS)**
- [ ] Initialize NestJS project
  - [ ] Install dependencies (NestJS, TypeORM, PostgreSQL driver, JWT)
  - [ ] Configure environment variables (.env)
  - [ ] Database connection pooling setup
- [ ] Database schema (Typeorm migrations)
  - [ ] All core tables: tenants, users, branches, animals, activities, etc.
  - [ ] Indexes and constraints
  - [ ] Row-level security (RLS) policies
- [ ] Authentication module
  - [ ] User registration endpoint
  - [ ] Login endpoint (JWT issued)
  - [ ] JWT guard (protect routes)
  - [ ] Password hashing (bcrypt)
- [ ] Tenant module
  - [ ] Create tenant (farm)
  - [ ] Update tenant (branding: colors, logo)
  - [ ] List tenants (for user)
  - [ ] Authorization: tenant_id scoping
- [ ] User management
  - [ ] Invite user to tenant (email)
  - [ ] User CRUD (admin only)
  - [ ] Role assignment
- [ ] Health check & logging
  - [ ] GET /health → 200 OK
  - [ ] Request/response logging (Winston)
  - [ ] Error handling (global exception filter)

**Mobile (Flutter)**
- [ ] Initialize Flutter project
  - [ ] Install Flutter SDK
  - [ ] Dependencies: http, flutter_secure_storage, uuid, drift, provider (state management)
- [ ] Local SQLite schema (Drift)
  - [ ] Define entities matching backend schema (animals, activities, feeds, etc.)
  - [ ] Auto-generate ORM code
  - [ ] Database initialization on app start
- [ ] Auth UI & logic
  - [ ] Login screen (email + password)
  - [ ] Store JWT in secure storage
  - [ ] Auto-login if token valid
  - [ ] Logout flow
- [ ] State management
  - [ ] Provider setup for auth state
  - [ ] Tenant selection state
  - [ ] Branch selection state
- [ ] API client
  - [ ] HTTP wrapper (with JWT injection)
  - [ ] Error handling & retry logic
  - [ ] BASE_URL configuration per environment

**Documentation**
- [ ] README.md (overview, setup)
- [ ] SETUP.md (environment variables, database init, run locally)
- [ ] API Postman collection (or import OpenAPI)

#### Acceptance Criteria
- Backend: `POST /auth/login` works, JWT returned
- Mobile: Login screen → successful auth → token stored
- both: Tenant created with admin user
- PostgreSQL: All tables created, RLS enforced

---

### **WEEK 4–5: Animal Management**

#### Goals
- Core animal CRUD
- Batch tracking support
- Housing unit assignment
- Animal detail view with timeline

#### Deliverables

**Backend**
- [ ] Animal module
  - [ ] POST /api/v1/animals (create individual or batch)
  - [ ] GET /api/v1/animals (list by branch, species, status, with pagination)
  - [ ] GET /api/v1/animals/:id (detail view)
  - [ ] PATCH /api/v1/animals/:id (edit name, breed, location, etc.)
  - [ ] DELETE /api/v1/animals/:id (soft delete)
  - [ ] Search by tag_id (fast lookup)
  - [ ] Filter by: species, status, branch, housing unit
- [ ] Housing Unit module
  - [ ] POST /api/v1/housing-units (create)
  - [ ] GET /api/v1/housing-units (list by branch)
  - [ ] PATCH /api/v1/housing-units/:id
  - [ ] DELETE /api/v1/housing-units/:id

**Mobile**
- [ ] Animals screen (list view)
  - [ ] Paginated list with species filtering
  - [ ] Search by tag_id or name
  - [ ] Quick actions (tap to detail, edit, transfer)
  - [ ] Offline support: pull animals from server on first login
- [ ] Animal detail screen
  - [ ] Display all fields (tag, species, breed, location, arrival date, etc.)
  - [ ] Animal timeline (all activities linked to this animal)
  - [ ] Quick action buttons: Record Activity, Transfer, Mark Dead, Mark Sold
  - [ ] Edit animal form (with validation)
  - [ ] Photo upload (optional: local file + sync later)
- [ ] Create animal form (Wizard)
  - [ ] Step 1: Species, type (individual vs batch)
  - [ ] Step 2: Details (breed, sex, arrival date, origin)
  - [ ] Step 3: Location (branch → housing unit)
  - [ ] Step 4: Review & save
- [ ] Local sync
  - [ ] Pull animals on app launch
  - [ ] Pull on background refresh
  - [ ] Store in SQLite (Drift)
  - [ ] Display offline with "last synced" indicator

**API Spec Additions**
- [ ] Documented animal endpoints (OpenAPI)

#### Acceptance Criteria
- Backend: Create 10 animals, filter by species, list works
- Mobile: Create animal offline, see it in list, sync creates it on server
- Backend: Conflict resolution tested for animal location edits

---

### **WEEK 6–7: Activities & Events**

#### Goals
- Flexible activity log
- Birth/death/treatment tracking
- Transfer history
- Extensible event types

#### Deliverables

**Backend**
- [ ] Activity module
  - [ ] POST /api/v1/activities (create event: transfer, birth, death, treatment, etc.)
  - [ ] GET /api/v1/activities (list by branch, date range, animal)
  - [ ] GET /api/v1/activities/:id (detail)
  - [ ] PATCH /api/v1/activities/:id (edit notes, etc.)
  - [ ] DELETE /api/v1/activities/:id (soft delete)
- [ ] Activity Type module
  - [ ] GET /api/v1/activity-types (list system + custom types)
  - [ ] POST /api/v1/activity-types (tenant can create custom)
  - [ ] System types auto-created at tenant init
- [ ] Birth Event details
  - [ ] Create offspring animals on birth event creation
  - [ ] Link mother/father
  - [ ] Calculate family trees
- [ ] Transfer tracking
  - [ ] Update current_housing on transfer activity
  - [ ] Movement history preserved in activities
- [ ] Timeline view
  - [ ] GET /api/v1/animals/:id/timeline (all activities for animal)
  - [ ] Sort by recorded_at DESC

**Mobile**
- [ ] Activity form (quick entry)
  - [ ] Autocomplete animal selection (recent animals first)
  - [ ] Activity type dropdown
  - [ ] Notes field
  - [ ] Photo capture (optional)
  - [ ] Record date/time (default now, editable)
- [ ] Transfer activity
  - [ ] Select source housing, destination housing
  - [ ] Confirm movement
  - [ ] Update local current_housing
- [ ] Birth event
  - [ ] Select mother animal
  - [ ] Track number born, notes
  - [ ] Option to create offspring records
  - [ ] Mark as male/female/mixed
- [ ] Death activity
  - [ ] Select animal
  - [ ] Ask cause (optional dropdown or free text)
  - [ ] Update animal status to "dead"
- [ ] Vaccination/treatment activity
  - [ ] Autocomplete treatment type (from system types)
  - [ ] Animal selection
  - [ ] Optional repeat/schedule (Phase 2)
- [ ] Animal timeline screen
  - [ ] List all activities for selected animal
  - [ ] Group by activity type or date
  - [ ] Tap to expand detail

**Offline**
- [ ] Activities queue locally while offline
- [ ] Sync on reconnect

#### Acceptance Criteria
- Mobile: Record transfer offline, sync, server reflects new housing
- Backend: Timeline returns activities in correct order
- Mobile: Birth event creates offspring records

---

### **WEEK 8–9: Feed & Inventory**

#### Goals
- Feed type management
- Stock tracking (in/out)
- Low-stock alerts
- Usage reporting

#### Deliverables

**Backend**
- [ ] Feed Item module
  - [ ] POST /api/v1/feed-items (create feed type)
  - [ ] GET /api/v1/feed-items (list)
  - [ ] PATCH /api/v1/feed-items/:id
- [ ] Stock Batch module
  - [ ] POST /api/v1/stock-batches (record purchase)
  - [ ] GET /api/v1/stock-batches (list by branch, item)
  - [ ] GET /api/v1/stock-batches/:id/on-hand (current quantity in)
- [ ] Stock Transaction module
  - [ ] POST /api/v1/stock-transactions (record usage, wastage, transfer)
  - [ ] GET /api/v1/stock-transactions (filter by batch, date, type)
- [ ] Stock on Hand view
  - [ ] Materialized/denormalized view (performance)
  - [ ] GET /api/v1/stock/on-hand (feeds grouped by item, quantity remaining)
  - [ ] Filter by branch
  - [ ] Alert if below threshold

**Mobile**
- [ ] Feed management screen
  - [ ] List feeds on hand (current stock)
  - [ ] Color indicator: Green (OK), Yellow (low), Red (out)
  - [ ] Configurable low-stock threshold per item
- [ ] Record feed usage (quick action)
  - [ ] Select feed (autocomplete, recent first)
  - [ ] Enter quantity
  - [ ] Link to animal/batch (optional but good for tracking)
  - [ ] Save (queues offline)
- [ ] Record feed purchase
  - [ ] Feed type, quantity, cost, supplier, expiry
  - [ ] Receipt photo (optional)
- [ ] Stock history
  - [ ] GET /api/v1/stock-batches/:id/transactions (history of in/out)
  - [ ] Show usage over time

**Offline**
- [ ] Feed items & stock batches pulled on startup
- [ ] Usage transactions queued locally
- [ ] Sync on reconnect

#### Acceptance Criteria
- Mobile: Record 20kg feed use offline, sync, server shows 20kg deducted
- Backend: Stock on hand calculates correctly (purchase - usage)
- Mobile: Low-stock alert when below threshold

---

### **WEEK 10–11: Sales, Expenses & Payroll**

#### Goals
- Sale recording (animals/products)
- Expense tracking with receipt photos
- Payroll entry
- Payment status tracking

#### Deliverables

**Backend**
- [ ] Sale module
  - [ ] POST /api/v1/sales (create)
  - [ ] GET /api/v1/sales (list by date, branch, status)
  - [ ] PATCH /api/v1/sales/:id (edit, mark paid)
  - [ ] Update animal status to "sold" when sale recorded
  - [ ] sale_items: store as JSONB (who/what sold, price, etc.)
- [ ] Expense module
  - [ ] POST /api/v1/expenses (create)
  - [ ] GET /api/v1/expenses (list by date, category, branch)
  - [ ] PATCH /api/v1/expenses/:id
  - [ ] DELETE /api/v1/expenses/:id (soft delete)
  - [ ] Audit logging (all changes to expenses)
- [ ] Payroll module
  - [ ] POST /api/v1/payroll (create entry)
  - [ ] GET /api/v1/payroll (list by date range, worker)
  - [ ] PATCH /api/v1/payroll/:id (edit wage, advances, payment info)
  - [ ] Mark as paid
- [ ] Audit log
  - [ ] Auto-log all sale/expense changes
  - [ ] Record user + timestamp + old/new values

**Mobile**
- [ ] Sale form (quick entry)
  - [ ] Select animal or custom product
  - [ ] Quantity, unit price, total auto-calc
  - [ ] Buyer name, contact
  - [ ] Payment status (paid/partial/unpaid)
  - [ ] Optional receipt photo
- [ ] Expense form
  - [ ] Category dropdown (feed, vet, fuel, etc.)
  - [ ] Amount, vendor, date
  - [ ] Optional receipt photo (camera or file)
  - [ ] Notes
- [ ] Payroll form
  - [ ] Worker name or select from users
  - [ ] Wage type (daily/weekly/monthly)
  - [ ] Days worked, rate, gross calc
  - [ ] Advances, loans, deductions
  - [ ] Net pay auto-calc
  - [ ] Payment method
- [ ] Finance dashboard widget
  - [ ] Quick stats: sales today, expenses today, net
  - [ ] Tap to drill into details

**Offline**
- [ ] Sales/expenses/payroll transactions queued locally
- [ ] Sync on reconnect
- [ ] Audit trail immutable (no editing once synced & approved)

#### Acceptance Criteria
- Mobile: Record sale offline, sync, server shows in sales report
- Backend: Expense audit log tracks all changes
- Mobile: Payroll calculated correctly (gross − advances − deductions = net)

---

### **WEEK 12: Reports & Dashboard**

#### Goals
- Dashboard overview
- Core reports
- PDF/CSV export (optional for MVP, can defer to v1)

#### Deliverables

**Backend**
- [ ] Dashboard endpoint
  - [ ] GET /api/v1/reports/dashboard?start_date=&end_date=
  - [ ] Return: total animals, deaths this month, sales this week, etc.
- [ ] Animal report
  - [ ] GET /api/v1/reports/animals (counts by species, status)
  - [ ] Filter by branch, date range
- [ ] Activity report
  - [ ] GET /api/v1/reports/activities (births, deaths, treatments)
  - [ ] Group by activity type, date range
- [ ] Feed report
  - [ ] GET /api/v1/reports/feed-usage (consumption rates)
  - [ ] Current on-hand stock
  - [ ] Low-stock list
- [ ] Sales report
  - [ ] GET /api/v1/reports/sales (total by species/month, revenue)
  - [ ] Payment status breakdown
- [ ] Expense report
  - [ ] GET /api/v1/reports/expenses (by category, by month)
  - [ ] Total spend trending
- [ ] Partner contribution report
  - [ ] GET /api/v1/reports/contributions (by partner, total)
- [ ] Profit snapshot (simple)
  - [ ] GET /api/v1/reports/profit (total sales − total expenses)
  - [ ] Disclaimer: non-tracked costs not included

**Mobile**
- [ ] Dashboard screen
  - [ ] Animal count cards (total, by species)
  - [ ] Recent deaths, births (last 7 days)
  - [ ] Feed status (items running low)
  - [ ] Sales & expenses summary (this week/month)
  - [ ] Quick action buttons (Add Animal, Record Activity, Record Sale, Record Expense)
  - [ ] Pull-to-refresh
- [ ] Reports screen
  - [ ] Menu: Animals, Activities, Feeds, Sales, Expenses, Contributions, Profit
  - [ ] Each report: date range picker, branch filter
  - [ ] Display as charts or tables
  - [ ] Tap to export CSV (email or share)
- [ ] Partner contribution screen
  - [ ] List partners and total contributions
  - [ ] Breakdown by type (cash, in-kind)

**Export (Optional for MVP, Phase 2)**
- [ ] CSV export for all reports
- [ ] PDF generation (optional)

#### Acceptance Criteria
- Mobile: Dashboard loads and shows correct summaries
- Backend: Reports return accurate aggregates
- Mobile: Export CSV works (or defer to Phase 2)

---

### **WEEK ~12: Offline Sync Finalization**

#### Deliverables (Integrated Throughout Weeks 1–12)

**Backend Sync Module**
- [ ] Sync controller
  - [ ] POST /api/v1/sync/push (accept batched changes from mobile)
  - [ ] GET /api/v1/sync/pull (return changes since last sync)
  - [ ] Conflict resolution service
- [ ] Change log table (for tracking deltas)
  - [ ] Immutable log of_all_ changes
  - [ ] Synced down to mobile clients
- [ ] Idempotency
  - [ ] All operations are idempotent (retry-safe)

**Mobile Sync Service**
- [ ] Sync engine
  - [ ] Queue local changes (pending_sync table)
  - [ ] Push phase (send changes, handle conflicts)
  - [ ] Pull phase (receive updates, apply locally)
  - [ ] Conflict resolution UI (show conflicts, let user choose)
- [ ] Background sync
  - [ ] Trigger on app resume
  - [ ] Trigger on wifi/mobile connection restored
  - [ ] Automatic retries
- [ ] Offline indicator
  - [ ] Show sync status (synced ✅, syncing 🔄, offline 📵, conflict ⚠️)
  - [ ] Pending change count

**Testing**
- [ ] Offline scenario: edit animal offline, sync, server updates
- [ ] Conflict scenario: two devices edit same animal, merge correctly
- [ ] Interrupt scenario: sync interrupted, resume correctly
- [ ] Delete scenario: soft delete syncs correctly

#### Acceptance Criteria
- Mobile: Works fully offline (create/edit/delete)
- Sync: Changes persist to server and other devices
- Conflicts: Resolved per entity-type rules
- Idempotency: Retries don't create duplicates

---

## PHASE 2: v1.0 Polish (Weeks 13–16)

### Goals
- QA & bug fixes
- Performance tuning
- Documentation for users & developers
- Optional: mobile app store prep

### Deliverables

**Testing**
- [ ] Unit tests (services, utilities)
- [ ] Integration tests (API endpoints)
- [ ] E2E tests (user workflows)
- [ ] Offline scenarios (manual + automated)
- [ ] Load testing (1000+ animals, 100+ activities)

**Performance**
- [ ] Database indexing audit
- [ ] Query optimization (N+1 queries)
- [ ] Caching (Redis for frequently accessed data, Phase 2 if needed)
- [ ] Mobile app size & startup time
- [ ] API response time < 500ms (p95)

**Documentation**
- [ ] User guide (PDF or wiki)
  - [ ] Dashboard navigation
  - [ ] Common workflows (add animal, record activity, etc.)
  - [ ] Troubleshooting
- [ ] Developer guide
  - [ ] Architecture overview
  - [ ] How to add new features
  - [ ] Database migration guide
  - [ ] Testing strategy
- [ ] API documentation (OpenAPI/Swagger)
  - [ ] All endpoints documented
  - [ ] Request/response examples
  - [ ] Error codes explained
- [ ] Video tutorials (optional, Phase 2+)

**Deployment**
- [ ] CI/CD pipeline (GitHub Actions)
  - [ ] Lint & test on PR
  - [ ] Build & deploy on merge
  - [ ] Database migrations on deploy
- [ ] Monitoring
  - [ ] Sentry setup (error tracking)
  - [ ] Health checks
  - [ ] Performance monitoring (optional: DataDog, Newrelic)
- [ ] Backups & disaster recovery
  - [ ] Test restore process
  - [ ] Document runbooks

**Mobile (Optional for MVP, but good to plan)**
- [ ] App store metadata (description, screenshots, icon)
- [ ] Signing certificates (iOS, Android)
- [ ] Beta testing (TestFlight, Play Store internal testing)
- [ ] App store submission

**Bugfixes & Polish**
- [ ] UI/UX refinement
  - [ ] Loading states
  - [ ] Error messages (user-friendly)
  - [ ] Animations (smooth transitions)
  - [ ] Dark mode (optional)
- [ ] Accessibility
  - [ ] WCAG compliance (color contrast, font size, labels)
  - [ ] Keyboard navigation
  - [ ] Screen reader support (mobile)
- [ ] Localization (optional Phase 2)
  - [ ] Support multiple languages (i18n)

#### Acceptance Criteria
- All tests pass (unit, integration, E2E)
- API performance: p95 < 500ms
- Mobile app: < 150MB, startup < 3s
- Documentation complete
- Zero known bugs (or backlog)
- Monitoring alerts configured

---

## PHASE 3: Beyond MVP (Future)

### Potential Features (Prioritize Based on Feedback)

1. **Payment Processing**
   - Stripe/Razorpay integration
   - Invoice generation
   - Subscription billing

2. **Enhanced Notifications**
   - Email alerts (low feed, deaths, sales)
   - SMS reminders (optional)
   - In-app notifications

3. **Mobile App Store**
   - TestFlight (iOS) / Play Store (Android)
   - Auto-updates
   - Push notifications via Firebase Cloud Messaging

4. **Advanced Analytics**
   - Profitability trends
   - Feeding cost per animal
   - Mortality analysis
   - Breeding success rates

5. **IoT Integrations**
   - Scale integration (weight tracking)
   - Temperature/humidity sensors
   - Automatic activity logging

6. **API Access for Partners**
   - Third-party integrations
   - Webhooks for external systems
   - API keys & rate limiting

7. **Multi-Language Support**
   - Localization for Kiswahili, Portuguese, etc.
   - RTL language support (Arabic, Hebrew)

---

## Work Breakdown Structure (WBS) Summary

| Phase | Week | Sprint | Feature | Status |
|-------|------|--------|---------|--------|
| 1 | 1–3 | Foundation | Auth, Tenants, DB schema | 🔵 Sprint 1 |
| 1 | 4–5 | Animals | CRUD, housing, timeline | 🔵 Sprint 2 |
| 1 | 6–7 | Activities | Events, births, transfers | 🔵 Sprint 3 |
| 1 | 8–9 | Finance | Sales, expenses, payroll | 🔵 Sprint 4 |
| 1 | 10–11 | Sync | Offline + conflict resolution | 🔵 Sprint 5 |
| 1 | 12 | Reports | Dashboards, reports, export | 🔵 Sprint 6 |
| 2 | 13–16 | Polish | Testing, perf, docs, deploy | ⚪ Coming next |

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Scope creep | High | Strict MVP definition; defer Phase 2+ features |
| Sync bugs | Critical | Extensive testing; start sync early (Week 10) |
| Performance at scale | High | Profile early; optimize before MVP close |
| Team availability | Medium | Document as you go; reduce onboarding time |
| Database schema changes | High | Use Typeorm migrations; test restore flows |
| Mobile platform differences | Medium | Test on both iOS + Android early |
| Vendor changes (Railway, etc.) | Low | Use standard tech; easy migration if needed |

---

## Definition of Done (DoD)

Every feature is "done" when:

- [ ] Code written & peer-reviewed
- [ ] Tests pass (unit + integration)
- [ ] Database migrations run cleanly
- [ ] API documented (OpenAPI)
- [ ] Mobile & web UI tested
- [ ] Offline sync tested (if applicable)
- [ ] No regressions (manual smoke test)
- [ ] Merged to main branch
- [ ] Deployed to production (or staging)

---

## Conclusion

This is a realistic MVP roadmap for a solo developer or small team. Key success factors:

✅ **Incremental delivery** — working code each week  
✅ **Offline-first from day 1** — not bolted on at the end  
✅ **Rigorous testing** — especially sync & multi-tenant isolation  
✅ **Clear documentation** — for future scaling  
✅ **Scope discipline** — MVP first, Phase 2 later  

**You'll have a sellable farm management platform in 12 weeks** ready to onboard the first customer(s).

