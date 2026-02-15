# AgroMIS: Offline-First Farm Management System

**An open-source, multi-tenant farm management platform for tracking animals, feeds, sales, and finances — with full offline capability.**

---

## 🎯 Product Overview

**AgroMIS** helps farm owners and caretakers manage:

✅ **Animals** — Individual tracking (cows, pigs, goats) or batch (chickens)  
✅ **Inventory** — Feed purchases, usage, low-stock alerts  
✅ **Activities** — Births, deaths, transfers, treatments, vaccinations  
✅ **Finance** — Sales, expenses, payroll, partner contributions  
✅ **Reports** — Dashboard, profitability, activity summaries  
✅ **Offline-First** — Works fully offline on mobile; syncs when internet returns  
✅ **Multi-tenant** — Sell to multiple farms; each is isolated  
✅ **Easy to Use** — Fast entry, minimal clicks, works on any device  

---

## 📂 Project Structure

```
farm-mis/
├── docs/                          # 📄 Complete documentation
│   ├── 00_ASSUMPTIONS.md          # Key decisions & trade-offs
│   ├── 01_PRD.md                  # Product requirements document
│   ├── 02_DATA_MODEL.md           # ERD, database schema
│   ├── 03_TECH_STACK.md           # Technology choices & justification
│   ├── 04_SYNC_STRATEGY.md        # Offline sync & conflict resolution
│   ├── 05_MILESTONES.md           # Implementation roadmap (12-16 weeks)
│   ├── 06_API_SPEC.md             # REST API endpoints (OpenAPI)
│   └── 07_PROJECT_SETUP.md        # Local development setup
│
├── backend/                       # 🔧 NestJS backend (TBD)
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── tenants/
│   │   │   ├── animals/
│   │   │   ├── activities/
│   │   │   ├── feeds/
│   │   │   ├── sales/
│   │   │   ├── expenses/
│   │   │   ├── payroll/
│   │   │   ├── reports/
│   │   │   └── sync/
│   │   ├── database/
│   │   │   └── typeorm/
│   │   └── main.ts
│   ├── package.json
│   └── .env.example
│
├── mobile/                        # 📱 Flutter app (TBD)
│   ├── lib/
│   │   ├── main.dart
│   │   ├── config/
│   │   ├── database/
│   │   ├── services/
│   │   ├── screens/
│   │   └── widgets/
│   ├── pubspec.yaml
│   └── flutter.yaml
│
├── docker-compose.yml             # 🐳 Full-stack dev setup
├── .github/
│   └── workflows/
│       └── ci.yml                 # CI/CD pipeline
└── README.md                      # This file
```

---

## 🚀 Quick Start

### 1. Prerequisites

- **macOS/Linux/Windows + Node.js 18+**
- **PostgreSQL 14+** (or Docker)
- **Flutter SDK 3.x**
- **Git**

### 2. Clone & Setup Backend

```bash
# Clone repo
git clone <repo_url>
cd farm-mis

# Setup backend
cd backend
npm install
cp .env.example .env
npm run start:dev
# ✅ Backend running on http://localhost:3000
```

### 3. Setup Database

```bash
# Using Docker (recommended)
docker run --name farm-mis-db \
  -e POSTGRES_USER=farmadmin \
  -e POSTGRES_PASSWORD=SecurePass123! \
  -e POSTGRES_DB=farm_mis_db \
  -p 5432:5432 \
  -d postgres:14

# Or local Postgres
brew install postgresql
brew services start postgresql
```

### 4. Setup Mobile

```bash
cd mobile
flutter pub get
flutter run
# ✅ App running on simulator
```

### 5. Test API

```bash
# Create tenant + user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "owner@farm.com",
    "password": "TestPass123!",
    "full_name": "John Owner",
    "farm_name": "Test Farm"
  }'
```

**Detailed setup**: See [docs/07_PROJECT_SETUP.md](./docs/07_PROJECT_SETUP.md)

---

## 📚 Documentation Guide

Read in this order:

1. **[ASSUMPTIONS.md](./docs/00_ASSUMPTIONS.md)** (5 min)
   - Key decisions, tech stack, non-negotiables

2. **[PRD.md](./docs/01_PRD.md)** (15 min)
   - What we're building, user stories, success metrics

3. **[DATA_MODEL.md](./docs/02_DATA_MODEL.md)** (20 min)
   - Complete database schema, ERD, multi-tenant strategy

4. **[TECH_STACK.md](./docs/03_TECH_STACK.md)** (15 min)
   - Why NestJS, PostgreSQL, Flutter, custom sync

5. **[SYNC_STRATEGY.md](./docs/04_SYNC_STRATEGY.md)** (25 min)
   - How offline-first works, conflict resolution rules

6. **[MILESTONES.md](./docs/05_MILESTONES.md)** (15 min)
   - Implementation roadmap: MVP (12 weeks) → v1.0 (4 weeks)

7. **[API_SPEC.md](./docs/06_API_SPEC.md)** (reference)
   - All REST endpoints, request/response examples

8. **[PROJECT_SETUP.md](./docs/07_PROJECT_SETUP.md)** (reference)
   - Local development environment setup

---

## 🏗️ Technology Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Flutter (Web/iOS/Android) | Build once, deploy everywhere; excellent offline support |
| **Backend** | NestJS + TypeScript | Type-safe, modular, maintainable, highly scalable |
| **Database** | PostgreSQL | Multi-tenant RLS, ACID, powerful reporting, proven at scale |
| **Mobile DB** | SQLite + Drift ORM | Native, fast, offline-capable, type-safe |
| **Auth** | JWT (RS256) | Stateless, scalable, RFC-compliant |
| **API** | REST (HTTP/JSON) | Simple, cacheable, mobile-friendly |
| **Hosting** | Railway | Git push deploys, PostgreSQL addon, minimal ops |
| **Sync** | Custom (timestamps + change log) | Full control, no vendor lock-in, handles conflicts |
| **Monitoring** | Sentry + Winston | Error tracking, structured logs |

---

## 📋 Feature Checklist: MVP (Weeks 1–12)

### Foundation (Weeks 1–3)
- [ ] NestJS backend scaffold
- [ ] PostgreSQL schema + RLS
- [ ] JWT authentication
- [ ] Tenant creation + branding
- [ ] User invitation & roles
- [ ] Flutter app scaffold
- [ ] Local SQLite database
- [ ] HTTP client + auth flow

### Animals (Weeks 4–5)
- [ ] Animal CRUD (individual + batch)
- [ ] Housing unit management
- [ ] Animal search & filter
- [ ] Animal detail + timeline
- [ ] Photo upload

### Activities (Weeks 6–7)
- [ ] Activity/event logging
- [ ] Birth event tracking
- [ ] Transfer tracking
- [ ] Death/sale tracking
- [ ] Custom activity types

### Inventory (Weeks 8–9)
- [ ] Feed item management
- [ ] Stock purchase recording
- [ ] Usage tracking
- [ ] Wastage & adjustments
- [ ] Low-stock alerts

### Finance (Weeks 8–9)
- [ ] Sales recording (link to animals)
- [ ] Expense tracking (w/ receipts)
- [ ] Payroll entry
- [ ] Partner contributions
- [ ] Audit logging

### Offline Sync (Weeks 10–11)
- [ ] Local pending_sync queue
- [ ] Push changes endpoint
- [ ] Pull changes endpoint
- [ ] Conflict detection & resolution
- [ ] Sync status UI

### Reports (Week 12)
- [ ] Dashboard (animal count, feeds, sales, expenses)
- [ ] Animal report (by species, status)
- [ ] Activity report (births, deaths, treatments)
- [ ] Feed report (stock, usage, alerts)
- [ ] Sales report (revenue)
- [ ] Expense report (breakdown)
- [ ] Profit snapshot
- [ ] CSV export

### v1.0 Polish (Weeks 13–16)
- [ ] Unit + integration + E2E tests
- [ ] Performance optimization
- [ ] User documentation
- [ ] API documentation
- [ ] CI/CD pipeline
- [ ] Deployment to Railway
- [ ] Monitoring setup

---

## 🔄 Development Workflow

### Week-by-Week Iteration

1. **Read milestone spec** (e.g., "Week 4–5: Animal Management")
2. **Design backend modules** (entity, service, controller)
3. **Create database migrations**
4. **Implement REST endpoints** (test with Postman)
5. **Build mobile UI** (screens, forms, lists)
6. **Wire mobile to backend** (API calls, state management)
7. **Test offline sync** (if applicable)
8. **Commit & demo**

### Git Workflow

```bash
# Create branch per milestone
git checkout -b feature/week-4-5-animals

# Commit frequently
git commit -m "feat(animals): add animal CRUD endpoints"
git commit -m "feat(mobile): add animal list screen"

# PR & merge to main
git push origin feature/...
# Create PR on GitHub
# Once approved: merge to main

# Checkout next milestone
git checkout main
git pull
git checkout -b feature/week-6-7-activities
```

---

## 🧪 Testing Strategy

### Unit Tests (Implement in Parallel)

```bash
# Backend
npm run test  # Jest unit tests

# Mobile
flutter test
```

### Integration Tests

```bash
# Test API endpoints
npm run test:e2e

# Full-stack flow
# 1. Create tenant via API
# 2. Create animal via mobile
# 3. Sync offline
# 4. Verify on server
```

### Manual Testing Checklist

- [ ] Can register + login
- [ ] Can create animal offline
- [ ] Can sync changes
- [ ] Can handle conflicts
- [ ] Can view reports
- [ ] App doesn't crash (stress test)

---

## 🚀 Deployment

### Staging (Railway)

```bash
# First time
railway init
railway link <project_id>

# Deploy backend
railway up backend

# Deploy database
railway up database
```

### Production

```bash
# Same process; separate Railway project
railway link <production_project_id>
railway up
```

See [docs/07_PROJECT_SETUP.md](./docs/07_PROJECT_SETUP.md#deployment-pipeline) for full deployment guide.

---

## ❓ FAQ

**Q: Can I start with web-only?**  
A: Yes! Flutter Web works. Backend is identical. Mobile comes later.

**Q: How long to MVP?**  
A: 12 weeks for a solo developer. 8 weeks for a 2-person team.

**Q: How many tenants can it support?**  
A: PostgreSQL + Node.js can handle 10k+ tenants easily. Scale to microservices (Phase 2) if needed.

**Q: Does offline sync handle all cases?**  
A: Yes. See [SYNC_STRATEGY.md](./docs/04_SYNC_STRATEGY.md) for conflict resolution rules.

**Q: Can I use different hosting?**  
A: Yes! Docker image works anywhere (AWS, DigitalOcean, self-hosted VPS, etc.).

**Q: How do I add new features after MVP?**  
A: Create feature branch, follow same module structure, add tests, submit PR.

---

## 🤝 Contributing

1. Read all documentation
2. Understand milestone scope
3. Create feature branch
4. Implement + test
5. Commit with clear messages
6. Submit PR for review
7. Merge to main

See [MILESTONES.md](./docs/05_MILESTONES.md#definition-of-done-dod) for "Definition of Done."

---

## 📞 Support

- **Stuck?** Check relevant documentation file
- **Bug?** Create GitHub issue with reproduction steps
- **Feature request?** Open issue labeled `enhancement`
- **Architecture question?** Check docs/README or `ASSUMPTIONS.md`

---

## 📄 License

MIT License. See LICENSE file.

---

## 🎉 Ready to Build?

1. **Setup your environment** → [PROJECT_SETUP.md](./docs/07_PROJECT_SETUP.md)
2. **Read PRD** → [PRD.md](./docs/01_PRD.md)
3. **Understand data model** → [DATA_MODEL.md](./docs/02_DATA_MODEL.md)
4. **Start Week 1–3** → [MILESTONES.md](./docs/05_MILESTONES.md)
5. **Reference API** → [API_SPEC.md](./docs/06_API_SPEC.md)

**Let's make farm management simple, reliable, and sellable.** 🚜✨

---

## Glossary

| Term | Definition |
|------|-----------|
| **Tenant** | A farm organization (customer); isolated data |
| **Branch** | Location/sub-farm within a tenant (e.g., Dairy House) |
| **Housing Unit** | Pen, room, coop, stall, pasture |
| **Animal** | Individual tracked animal or batch |
| **Activity** | Event (birth, death, transfer, treatment, etc.) |
| **Sync** | Push/pull changes between mobile & server |
| **MVP** | Minimum Viable Product (12 weeks, core features) |
| **RLS** | Row-Level Security (PostgreSQL multi-tenant isolation) |

---

**Last Updated**: 2026-02-14  
**Status**: Documentation Complete. Ready for Implementation.

🚀 **Let's go build!**

