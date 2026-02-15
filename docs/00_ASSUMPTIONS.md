# Assumptions & Decisions Document

**Project**: Offline-First Farm Management System (Multi-tenant, Web + Mobile)  
**Date**: 2026-02-14  
**Status**: DRAFT → CONFIRMED

---

## Critical Assumptions (You Must Confirm or Override)

### 1. **Technology Stack**

| Component | Choice | Reasoning | Flexible? |
|-----------|--------|-----------|-----------|
| **Backend** | NestJS + TypeScript | Type-safe, maintainable, scales easily | ❌ CONFIRMED |
| **Database** | PostgreSQL | ACID compliance, Row-Level Security for multi-tenant, proven at scale | ✅ Can change |
| **Frontend (Mobile)** | Flutter | Single codebase: Web + iOS + Android, excellent offline (SQLite + Drift) | ✅ Can substitute React Native |
| **Frontend (Web)** | Flutter Web (same codebase) | Unified codebase, reduces duplication | ✅ Could do React separately |
| **Local DB (Mobile)** | SQLite + Drift ORM | Battle-tested, fast, warm offline support | ✅ Could use Hive |
| **Hosting** | Railway | Fast deployments, PostgreSQL addon, minimal ops burden | ❌ CONFIRMED |
| **Sync Engine** | Custom (timestamps + change log) | Full control, no vendor lock-in, supports offline-first | ✅ Could use Replicant/RxDB |
| **Auth** | JWT + email/password | Simple, scalable, RFC-compliant | ✅ Can add OAuth2/SSO later |

---

### 2. **Product Scope & MVP**

| Aspect | Assumption | Confirmed? |
|--------|-----------|-----------|
| **Target Farm Size** | 10–100 animals per species, 2–5 branches | ✅ Reasonable |
| **Animal Tracking** | Support **both** individual (ID per animal) + batch (flocks) | ✅ Flexible |
| **Core Features in MVP** | Tenant creation, animals, activities, feeds, sales, expenses, offline sync, reports | ✅ Solid |
| **Multi-tenancy Model** | Row-level security in PostgreSQL; each tenant is isolated by tenant_id | ✅ Best practice |
| **Monetization** | Subscription: $25–50/month per farm tenant | ⏳ Decide later |
| **Payment Processing** | Stripe/Razorpay integration (Phase 2) | ⏳ Phase 2 |
| **Compliance** | GDPR/data export ready; audit trail for finance | ✅ Built-in |

---

### 3. **Team & Timeline**

| Item | Assumption | Notes |
|------|-----------|-------|
| **Team** | Solo/small team (1–2 devs) | Influences documentation verbosity & automation |
| **MVP Timeline** | 8–12 weeks | Aggressive but achievable with Flutter + NestJS |
| **v1.0 Timeline** | +4 weeks after MVP | Polish, performance, edge cases |
| **Maintenance Burden** | Low (automated deployments, minimal infra) | Railway handles most ops |

---

### 4. **Key Non-Functional Requirements**

| Requirement | Our Approach | Trade-offs |
|-------------|--------------|-----------|
| **Offline-First** | SQLite on mobile, queued changes, sync on reconnect | Eventual consistency; conflicts decided by rules |
| **Multi-tenant Security** | PostgreSQL RLS, tenant_id on every row, JWT scoped to tenant | Must audit every query |
| **Performance** | Index heavily; support 10k+ activity records per branch | Denormalize carefully for reports |
| **Maintainability** | NestJS modules, clear separation, comprehensive tests | Requires discipline in code structure |
| **Scaling Path** | Monolith (MVP) → microservices (later) | Start simple, split when needed |

---

### 5. **Deferred Features (Not in MVP)**

- ✋ Complex accounting (double-entry book-keeping)
- ✋ IoT integrations (sensors, scales)
- ✋ Advanced analytics (ML predictions)
- ✋ Multi-currency (unless requested)
- ✋ SMS/WhatsApp notifications (Phase 2)
- ✋ Integration with other farm systems

---

### 6. **Data & Deployment**

| Item | Assumption |
|------|-----------|
| **Backups** | Railway's automated PostgreSQL backups (built-in) + weekly exports |
| **Disaster Recovery** | RTO: 24h, RPO: 1h | Restore from backups if needed |
| **Audit Trail** | Every finance record tracked: who, what, when, why | Immutable logs table |
| **Data Export** | Tenants can export data as CSV (GDPR right) | Phase 1 or 2 |

---

### 7. **Conflict Resolution Rules** (Offline Sync)

When two devices edit the same record while offline:

| Entity Type | Conflict Rule | Example |
|-------------|--------------|---------|
| **Animal record** | Last-write-wins + alert user | Two caretakers update same animal's location → newer timestamp wins, user sees conflict notification |
| **Feed usage** | Accumulate if independent fields | Two devices record usage at different times → both recorded (immutable activity log) |
| **Expense** | Last-write-wins + immutable once reviewed | Finance records reviewed by accountant → cannot change; if pending approval → newer wins |
| **Sale** | Prevent duplicate on confirmation | UUID prevents duplicate recording; idempotent API calls |

---

## Decisions We're Making Today

✅ **NestJS + PostgreSQL**: Maintainability & scaling  
✅ **Flutter (unified)**: Build once, deploy everywhere  
✅ **Railway**: Hosting  
✅ **Custom sync engine**: Full control  
✅ **JWT auth**: Simple & secure  
✅ **SQLite + Drift**: Mobile offline  

---

## Questions for Simon (Address Before Implementation Starts)

1. **Do you want Flutter Web in MVP**, or just mobile + separate React for web?
   - My recommendation: **Flutter Web** (saves time, unified codebase)
   - Trade-off: Flutter Web is newer, less feature-complete than React

2. **Priority: Chickens/broilers tracking?** If batch mode is critical, I can design that first.
   - My recommendation: Support both, but emphasize batch for chickens

3. **Do you plan to eventually sell on appstore, or self-distribute?**
   - Affects signing setup, but doesn't block MVP

4. **SMS/Email notifications for critical events?** (e.g., "animal died", "feed running low")
   - MVP: In-app only. Phase 2: Add email/SMS

5. **Will you need API access for custom integrations later?**
   - We'll design API-first (all features exposed via REST), so yes.

---

## Sign-Off Checklist

- [ ] Technology stack confirmed (NestJS, PostgreSQL, Flutter, Railway)
- [ ] MVP scope locked
- [ ] Timeline realistic (8-12 weeks)
- [ ] Assumptions override ready (if any)

**Next Step**: Proceed with PRD + ERD + API Spec.
