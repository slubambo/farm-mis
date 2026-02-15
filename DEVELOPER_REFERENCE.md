# Developer Quick Reference

**Quick lookup for common tasks during development.**

---

## 🚀 Common Commands

### Backend (NestJS)

```bash
# Start development server
npm run start:dev

# Run tests
npm run test

# Generate migration
npm run typeorm migration:generate -- -n <name>

# Run migrations
npm run typeorm migration:run

# Lint code
npm run lint

# Build for production
npm run build

# Start production
npm run start:prod
```

### Mobile (Flutter)

```bash
# Get dependencies
flutter pub get

# Generate database code (Drift ORM)
flutter pub run build_runner build --delete-conflicting-outputs

# Run on web
flutter run -d chrome

# Run on Android
flutter run

# Run on iOS
flutter run -d macos

# Build APK
flutter build apk

# Build IPA
flutter build ios
```

### Database (PostgreSQL)

```bash
# Connect
psql farm_mis_db -U farmadmin

# List tables
\dt

# View schema
\d <table_name>

# Check data
SELECT * FROM <table> LIMIT 5;

# Exit
\q
```

---

## 📋 Quick Checklist: The 12-Week Sprint

### Week 1–3: Foundation
```
- [ ] Backend: Auth module (register, login, JWT)
- [ ] Backend: Tenant CRUD, branding
- [ ] Backend: Database schema (all tables ready)
- [ ] Mobile: Flutter scaffold, SQLite setup, login UI
- [ ] Both: Test POST /auth/register → POST /api/v1/tenants/me
- [ ] Deploy: Backend to Railway (staging)
```

### Week 4–5: Animals
```
- [ ] Backend: Animal CRUD, housing units
- [ ] Mobile: Animal list, detail, create form
- [ ] Test: Create 10 animals, filter by species
- [ ] Sync: Pull animals on app launch
```

### Week 6–7: Activities
```
- [ ] Backend: Activity log, birth/death/transfer tracking
- [ ] Backend: Activity types (system + custom)
- [ ] Mobile: Activity form, animal timeline
- [ ] Test: Record activity, see in timeline
```

### Week 8–9: Feeds & Finance
```
- [ ] Backend: Feed CRUD, stock tracking, transactions
- [ ] Backend: Sales, expenses, payroll endpoints
- [ ] Mobile: Feeds list, sale/expense/payroll forms
- [ ] Test: Record sale, sync to server
- [ ] Test: Low-stock alert shows on dashboard
```

### Week 10–11: Sync
```
- [ ] Backend: Sync push/pull endpoints
- [ ] Backend: Conflict resolution logic
- [ ] Mobile: Pending sync queue, sync service
- [ ] Mobile: Offline indicator, conflict UI
- [ ] Test: Edit offline, sync, see server update
- [ ] Test: Conflict scenarios (handled correctly)
```

### Week 12: Reports
```
- [ ] Backend: Dashboard, all reports (animals, activities, feeds, sales, expenses, profit)
- [ ] Mobile: Report screens with filters
- [ ] Mobile: CSV export (optional)
- [ ] Test: Reports show correct aggregates
```

### Week 13–16: Polish
```
- [ ] Unit tests (backend + mobile)
- [ ] Integration tests (API flows)
- [ ] Performance optimization
- [ ] Documentation (user guide + API docs)
- [ ] CI/CD (GitHub Actions)
- [ ] Monitoring (Sentry)
- [ ] Deploy to production
```

---

## 🔑 Key Entities

### Core
- **Tenant** (farm)
- **User** (person)
- **Branch** (location)
- **HousingUnit** (pen, room, coop, stall)

### Animals
- **Animal** (individual or batch)
- **CurrentHousing** (denormalized current location)

### Activity
- **Activity** (event log: birth, death, transfer, treatment)
- **ActivityType** (extensible)
- **BirthEvent** (offspring tracking)

### Inventory
- **FeedItem** (feed type)
- **StockBatch** (purchase)
- **StockTransaction** (usage, wastage, adjustment)

### Finance
- **Sale** (animals/products sold)
- **Expense** (costs)
- **Partner** (investor)
- **Contribution** (cash or in-kind)
- **PayrollEntry** (worker pay)
- **AuditLog** (immutable finance trail)

---

## 🛠️ File Structure

**When adding a new feature, follow this pattern:**

### Backend Module

```
src/modules/animals/
├── entities/
│   └── animal.entity.ts       # TypeORM entity
├── dtos/
│   ├── create-animal.dto.ts
│   └── update-animal.dto.ts
├── services/
│   └── animals.service.ts     # Business logic
├── controllers/
│   └── animals.controller.ts  # HTTP handlers
├── animals.module.ts          # Module definition
└── animals.module.spec.ts     # Tests
```

### Mobile Screen

```
lib/screens/animals/
├── animal_list_screen.dart
├── animal_detail_screen.dart
├── create_animal_form.dart
└── animal_timeline.dart
```

---

## 🔐 Multi-Tenant Checklist

When adding new endpoint, ensure:

- [ ] Add `tenant_id` parameter (inferred from JWT)
- [ ] Query includes `WHERE tenant_id = current_user.tenant_id`
- [ ] DTO validation is strong (no SQL injection risk)
- [ ] Join tables via shared `tenant_id`
- [ ] Test isolation (create test tenants, verify no cross-tenant leaks)

Example NestJS service:

```typescript
async getAnimals(tenantId: UUID) {
  return this.animalRepository.find({
    where: { tenant_id: tenantId, deleted_at: IsNull() },
    relations: ['currentHousing', 'birthEvent'],
  });
}
```

---

## 📱 Mobile Offline Checklist

When adding new entity to mobile:

- [ ] Define Drift table in `lib/database/` → `animal.drift`
- [ ] Add to `AppDatabase` class
- [ ] Generate code: `flutter pub run build_runner build`
- [ ] Create DAO/repository for queries
- [ ] Add to `_pending_sync` table on create/update
- [ ] Include in sync push/pull logic
- [ ] Test: Edit offline, sync, verify on server

---

## 🔗 API Endpoint Pattern

All endpoints follow:

```
POST /api/v1/<resource>              - Create
GET  /api/v1/<resource>              - List (with pagination)
GET  /api/v1/<resource>/:id          - Detail
PATCH /api/v1/<resource>/:id         - Update
DELETE /api/v1/<resource>/:id        - Delete (soft)
```

Example:

```
POST   /api/v1/animals
GET    /api/v1/animals?branch_id=...&species=cow
GET    /api/v1/animals/:animal_id
PATCH  /api/v1/animals/:animal_id
DELETE /api/v1/animals/:animal_id
```

---

## 🐛 Common Bugs & Fixes

### Backend: "TypeError: Cannot read property of undefined"
→ Check JWT is valid. Add `@UseGuards(JwtAuthGuard)` to controller.

### Mobile: SQLite locked
→ Stop Flutter, restart: `flutter run`

### Sync conflicts not resolving
→ Check conflict resolution service has rule for entity. See `docs/04_SYNC_STRATEGY.md`.

### Tenant isolation broken (cross-tenant leak)
→ Audit all queries. Ensure `WHERE tenant_id = ...` on every table lookup.

### API returns 400 validation error
→ Check request matches DTO shape. Use Postman "pretty" view to debug.

---

## 📊 Performance Tips

- **Index `tenant_id`, `status`, `created_at`** on all tables
- **Paginate lists** (default 50, max 500)
- **Denormalize where needed** (e.g., `current_housing` table)
- **Use N+1 query detection** (NestJS logs will show if too many queries)
- **Cache frequently accessed** (tenants, activity types) via Redis (Phase 2)
- **Profile before optimizing** (identify bottleneck first)

---

## 🧪 Test Template

### NestJS Unit Test

```typescript
describe('AnimalsService', () => {
  let service: AnimalsService;
  let repo: Repository<Animal>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AnimalsService,
        { provide: getRepositoryToken(Animal), useValue: mockRepository },
      ],
    }).compile();

    service = module.get(AnimalsService);
    repo = module.get(getRepositoryToken(Animal));
  });

  it('should create animal', async () => {
    const dto = { tag_id: 'C-001', species: 'cow' };
    const result = await service.create(tenantId, dto);
    expect(result.tag_id).toBe('C-001');
    expect(repo.save).toHaveBeenCalled();
  });
});
```

### Flutter Test

```dart
void main() {
  group('AnimalRepository', () {
    late AppDatabase db;
    late AnimalRepository repo;

    setUp(() async {
      db = AppDatabase.inMemory();
      repo = AnimalRepository(db);
    });

    test('creates and retrieves animal', () async {
      final animal = Animal(tag_id: 'C-001', species: 'cow');
      await repo.insert(animal);
      final retrieved = await repo.get(animal.id);
      expect(retrieved?.tagId, 'C-001');
    });
  });
}
```

---

## 📝 Commit Message Style

Use conventional commits for clear history:

```
feat(animals): add animal CRUD endpoints
fix(sync): handle conflict when animal location changes
docs(readme): update setup instructions
test(animals): add unit tests for animal service
chore: upgrade dependencies
```

---

## 🚢 Deployment Checklist

Before deploying to production:

- [ ] All tests pass (`npm test`, `flutter test`)
- [ ] Linting passes (`npm run lint`)
- [ ] No console.log or debugPrint in code
- [ ] Database migrations tested locally
- [ ] Environment variables set correctly
- [ ] Error handling in place (no bare `throw`)
- [ ] Logging configured (Sentry, Winston)
- [ ] API endpoints documented
- [ ] Mobile version bumped
- [ ] Commit tagged with version

---

## 🚨 Emergency Contacts (For You)

**When things break:**

1. **Backend won't start**: Check `.env`, verify PostgreSQL running
2. **Database locked**: Restart backend + database
3. **Mobile won't sync**: Check JWT token valid, backend running
4. **Data inconsistency**: Check audit log, identify root cause, fix + migrate
5. **Production outage**: Rollback previous version, investigate logs

---

## 📚 Documentation by Use Case

| Need | File |
|------|------|
| "How do I start?" | [README.md](./README.md) |
| "What are we building?" | [01_PRD.md](./docs/01_PRD.md) |
| "How's the database designed?" | [02_DATA_MODEL.md](./docs/02_DATA_MODEL.md) |
| "Why X technology?" | [03_TECH_STACK.md](./docs/03_TECH_STACK.md) |
| "How does offline sync work?" | [04_SYNC_STRATEGY.md](./docs/04_SYNC_STRATEGY.md) |
| "What's the schedule?" | [05_MILESTONES.md](./docs/05_MILESTONES.md) |
| "What are all the APIs?" | [06_API_SPEC.md](./docs/06_API_SPEC.md) |
| "How do I set up locally?" | [07_PROJECT_SETUP.md](./docs/07_PROJECT_SETUP.md) |

---

## ⏱️ Time Estimates (Per Milestone)

| Task | Estimate | Notes |
|------|----------|-------|
| Backend module (entity + service + controller) | 2–4 hours | Including tests |
| Mobile screen (list + form) | 3–5 hours | With state management |
| Database migration + schema | 1–2 hours | Before features |
| API endpoint testing | 1 hour | With Postman |
| Sync integration | 2–3 hours | Per entity (conflict handling) |
| Report generation | 2–4 hours | Depends on complexity |

**Total MVP**: ~12 weeks for solo developer, working 40h/week.

---

## 🎯 Success Criteria

When done, you should be able to:

- ✅ Create farm tenant with branding
- ✅ Create 1000+ animals, search by tag
- ✅ Record activity offline, sync on reconnect
- ✅ Track feeds, see low-stock alerts
- ✅ Record sales/expenses, see profit
- ✅ View detailed reports
- ✅ Handle conflicts (2 devices edit same record)
- ✅ Scale to 100+ concurrent users

---

**Ready? Pick a task from [05_MILESTONES.md](./docs/05_MILESTONES.md) and start coding!** 🚀

Last Updated: 2026-02-14
