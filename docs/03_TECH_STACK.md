# Technology Stack & Architecture Decision Document

**Version**: 1.0  
**Date**: 2026-02-14  
**Decision Status**: ✅ CONFIRMED  

---

## Executive Summary

We're building with **NestJS + PostgreSQL + Flutter** to maximize code reuse, offline functionality, and maintainability. This choice trades some complexity for:
- Single codebase for Web, iOS, Android (Flutter)
- Clean, testable backend (NestJS)
- Proven multi-tenant database patterns (PostgreSQL)
- Minimal operational overhead (Railway)

---

## Technology Choices & Justification

### **1. Backend: NestJS + TypeScript**

#### Why NestJS?

| Criterion | NestJS | Django | Spring Boot |
|-----------|--------|--------|------------|
| **Maintainability** | ⭐⭐⭐⭐⭐ Opinionated, modules-based | ⭐⭐⭐⭐ Clear patterns | ⭐⭐⭐⭐ Enterprise-grade |
| **Scalability** | ⭐⭐⭐⭐⭐ Microservice-ready | ⭐⭐⭐ Monolith-friendly | ⭐⭐⭐⭐⭐ Scales to 1000s |
| **Developer Speed** | ⭐⭐⭐⭐ Fast with TypeScript | ⭐⭐⭐⭐⭐ Fastest for MVP | ⭐⭐⭐ Moderate |
| **Learning Curve** | ⭐⭐⭐ Moderate | ⭐⭐⭐⭐ Gentle | ⭐⭐ Steep |
| **Ecosystem** | ⭐⭐⭐⭐⭐ Huge NPM node modules | ⭐⭐⭐⭐ Mature | ⭐⭐⭐⭐ Mature (Java) |
| **Cost** | ✅ Free (Node.js hosting cheap) | ✅ Free | ⚠️ JVM memory heavy |
| **Type Safety** | ⭐⭐⭐⭐⭐ TypeScript native | ⭐⭐⭐ Dynamic | ⭐⭐⭐⭐⭐ Java typing |

**Decision**: **NestJS** ✅

**Why not Django?**
- Slower for team scaling; Python type system optional
- Railway Python support OK but slower cold starts

**Why not Spring Boot?**
- Overkill for MVP; heavier operational footprint
- JVM memory usage on Railway would be costly

#### NestJS Architecture Pattern

```
src/
├── modules/
│   ├── auth/
│   ├── tenants/
│   ├── animals/
│   ├── activities/
│   ├── feeds/
│   ├── sales/
│   ├── expenses/
│   ├── payroll/
│   └── reports/
├── shared/
│   ├── guards/
│   ├── decorators/
│   ├── filters/
│   ├── interceptors/
│   └── pipes/
├── database/
│   ├── migrations/
│   └── seeds/
└── main.ts
```

**Module per domain**: Encapsulation, easier to test, scales to microservices later.

---

### **2. Database: PostgreSQL**

#### Why PostgreSQL (not MongoDB, Firebase, DynamoDB)?

| Criterion | PostgreSQL | MongoDB | Firebase | DynamoDB |
|-----------|-----------|---------|----------|----------|
| **Multi-tenant RLS** | ⭐⭐⭐⭐⭐ Built-in policies | ⭐⭐⭐ App-level | ⭐⭐ No native support | ⭐ No |
| **ACID Transactions** | ⭐⭐⭐⭐⭐ Full support | ⭐⭐⭐ 4.0+ has them | ⭐⭐ Limited | ⭐⭐ None |
| **Complex Queries** | ⭐⭐⭐⭐⭐ Joins, aggregates | ⭐⭐⭐ Expensive | ⭐⭐⭐ Cloud-only | ⭐⭐ Limited |
| **Offline Sync** | ⭐⭐⭐⭐ Custom engine possible | ⭐⭐⭐ Replication | ⭐⭐⭐⭐ Built-in Firestore sync | ⭐⭐ DynamoDB streams |
| **Reports/Analytics** | ⭐⭐⭐⭐⭐ Powerful SQL | ⭐⭐⭐ Aggregation pipeline | ⭐⭐⭐ BigQuery integration | ⭐⭐⭐ Athena |
| **Cost (small scale)** | ✅ ~$15/mo Railway | ⭐⭐ Atlas, higher | ⭐⭐ Free tier, then expensive | ⭐⭐ Expensive per request |
| **Operational burden** | ✅ Railway handles it | ⭐⭐⭐ Managed MongoDB Atlas | ✅ Fully managed | ✅ Fully managed |

**Decision**: **PostgreSQL** ✅

**Why not Firebase?**
- Multi-tenant RLS hard to enforce at scale
- Reporting requires BigQuery, adds cost
- Offline sync easier but can become a trap
- Vendor lock-in; hard to migrate later

**Why not DynamoDB?**
- No complex queries; expensive for analytics
- Single PK design doesn't fit relational animal/activity model

#### PostgreSQL Configuration

```sql
-- Connection pooling via PgBouncer / Railway
max_connections = 200 -- Railway tier dependent

-- Performance tuning
shared_buffers = 256MB
work_mem = 4MB
random_page_cost = 1.1 -- SSD-friendly

-- JSON support
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "json";

-- RLS for multi-tenancy
ALTER SYSTEM SET row_security = on;
```

---

### **3. Frontend: Flutter (Web + Mobile)**

#### Why Flutter (not React Native or separate React + Native)?

| Criterion | Flutter | React Native | Separate React + RN | Vue Native |
|-----------|---------|--------------|-------------------|-----------|
| **Code Reuse** | ⭐⭐⭐⭐⭐ 100% cross-platform | ⭐⭐⭐ ~70% (bridge code) | ❌ 0% (separate) | ⭐⭐⭐ ~70% |
| **Web Support** | ⭐⭐⭐⭐ Mature (1.0+) | ⭐⭐⭐ OK but secondary | ⭐⭐⭐⭐⭐ React is best-in-class | ⭐⭐⭐ New |
| **Performance** | ⭐⭐⭐⭐⭐ Compiled | ⭐⭐⭐⭐ Bridge overhead | ⭐⭐⭐⭐ (React good, RN bridge) | ⭐⭐⭐⭐ |
| **Offline Support** | ⭐⭐⭐⭐⭐ Native SQLite + Drift | ⭐⭐⭐⭐ SQLite via plugin | ⭐⭐⭐⭐⭐ (separate libs) | ⭐⭐⭐⭐ |
| **Learning Curve** | ⭐⭐⭐ Dart language | ⭐⭐⭐ JavaScript + native | ⭐⭐ 2 frameworks | ⭐⭐⭐ |
| **Developer Productivity** | ⭐⭐⭐⭐⭐ Hot reload | ⭐⭐⭐⭐ Hot reload (partial) | ⭐⭐⭐⭐ Depends | ⭐⭐⭐⭐ |
| **Team Scaling** | ⭐⭐⭐⭐ Single language (Dart) | ⭐⭐⭐⭐ JavaScript (familiar) | ⭐⭐ Larger team needed | ⭐⭐⭐ |
| **App Store Support** | ⭐⭐⭐⭐ Mature(iOS/Android signed) | ⭐⭐⭐⭐⭐ Mature | ⭐⭐⭐⭐ (mobile tools good) | ⭐⭐ Early |

**Decision**: **Flutter** ✅

**Rationale**:
- "Build once, deploy everywhere" — we can ship Web, iOS, Android, macOS from same codebase
- Offline support is built-in (SQLite, Drift ORM)
- Performance for farm app (not graphics-heavy) is excellent
- Hot reload for iteration speed
- Dart is clean and easy to learn (similar to Java/TypeScript)

**Trade-off**: Dart ecosystem smaller than JavaScript, but core libraries are solid.

**Alternative**: If you really prefer JavaScript, React Native + Expo works, but we'd maintain separate web (React) and mobile (RN).

---

### **4. Local Mobile Database: SQLite + Drift ORM**

#### Why SQLite + Drift (not Hive, Realm, or Firebase)?

| Criterion | SQLite + Drift | Hive | Realm | Firebase |
|-----------|---------|------|-------|----------|
| **Flutter Support** | ⭐⭐⭐⭐⭐ Native | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐⭐⭐ Dart binding | ⭐⭐⭐⭐ Mobile SDK |
| **Query Language** | ⭐⭐⭐⭐⭐ SQL | ⭐⭐ Key-value | ⭐⭐⭐ Query API | ⭐⭐⭐ Query API |
| **Complex Queries** | ⭐⭐⭐⭐⭐ Joins, aggregates | ❌ Not suitable | ⭐⭐⭐ Limited | ⭐⭐ Limited |
| **Sync Support** | ⭐⭐⭐⭐ Custom engine fits | ⭐⭐⭐ Hive Sync exists | ⭐⭐⭐ Sync SDK | ⭐⭐⭐⭐⭐ Built-in |
| **Offline Reliability** | ⭐⭐⭐⭐⭐ Battle-tested | ⭐⭐⭐⭐⭐ Reliable | ⭐⭐⭐⭐ Reliable | ⭐⭐⭐⭐ Reliable |
| **File Size** | ⭐⭐⭐⭐ Compact | ⭐⭐⭐⭐ Compact | ⭐⭐⭐ Heavier | ⭐⭐ Heavy SDK |
| **License** | ✅ Public domain | ✅ Apache 2.0 | ⚠️ Proprietary (commercial license) | ✅ Apache 2.0 |

**Decision**: **SQLite + Drift** ✅

**Why Drift?**
- Type-safe SQLite ORM generated from Dart code
- Auto-migration generation
- Hot reload friendly
- Excellent query builder

**Alternative**: Raw SQLite works too, but using Drift prevents SQL injection and improves type safety.

---

### **5. Offline Sync Engine: Custom**

#### Why not Firebase Firestore or Replicant?

| Approach | Custom (Option B) | Firebase Firestore | Replicant/RxDB |
|----------|---------|----------|---------|
| **Learning Curve** | ⭐⭐⭐⭐ Requires custom code | ⭐⭐⭐⭐⭐ SDK handles it | ⭐⭐⭐ Abstractions |
| **Control** | ⭐⭐⭐⭐⭐ Full | ⭐⭐ Firebase's rules | ⭐⭐⭐⭐ Good |
| **Multi-tenant Enforcement** | ⭐⭐⭐⭐⭐ We control it | ⭐⭐⭐ Must enforce in rules | ⭐⭐⭐ We enforce |
| **Conflict Resolution** | ⭐⭐⭐⭐⭐ Custom rules | ⭐⭐ Last-write-wins | ⭐⭐⭐⭐ Flexible |
| **Cost** | ✅ No extra | ⭐⭐ Expensive at scale | ✅ No extra |
| **Reporting** | ⭐⭐⭐⭐⭐ Full SQL power | ⭐⭐ Requires BigQuery | ⭐⭐⭐ Limited |
| **Vendor Lock-in** | ✅ None | ⚠️ High | ⚠️ Moderate |

**Decision**: **Custom Sync Engine** ✅

**Architecture**:

```
Mobile (Flutter)
    ↓ [SQLite + Drift]
    ↓ [Offline Queue: _pending_sync table]
    ↓ [Sync SyncService]
    ↓ HTTP (REST API)
    ↓
Backend (NestJS)
    ↓ [Sync Controller]
    ↓ [Conflict Resolution Logic]
    ↓ [Update PostgreSQL]
    ↓ [Generate Change Log]
    ↓ HTTP (return changes + conflicts)
    ↓
Mobile
    [Apply changes to SQLite]
    [Resolve conflicts with user input]
```

See [SYNC_STRATEGY.md](./03_SYNC_STRATEGY.md) for detailed algorithm.

---

### **6. Authentication: JWT**

#### Why JWT (not OAuth2, Sessions, or Phone-based)?

- **JWT**: Stateless, scalable, API-friendly
- **OAuth2**: Overkill for MVP; add later if needed
- **Sessions**: Requires server state; harder for distributed systems
- **Phone-based**: Phase 2 (SMS/WhatsApp login)

#### JWT Implementation

```typescript
// NestJS
@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    const token = this.jwtService.sign({
      sub: user.id,
      tenant_id: user.tenant_id,
      role: user.role,
    });
    return { access_token: token };
  }
}

// Flutter
class AuthService {
  Future<String?> login(String email, String password) async {
    final res = await http.post(
      Uri.parse('$API_BASE/auth/login'),
      body: jsonEncode({'email': email, 'password': password}),
    );
    if (res.statusCode == 200) {
      final data = jsonDecode(res.body);
      await storage.write(key: 'access_token', value: data['access_token']);
      return data['access_token'];
    }
    return null;
  }
}
```

**Token expiry**: 24 hours (refresh tokens in Phase 2)

---

### **7. API Communication: REST (HTTP + JSON)**

#### Why REST (not GraphQL)?

| Aspect | REST | GraphQL |
|--------|------|---------|
| **Simplicity** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ Over-fetching prevention |
| **Caching** | ⭐⭐⭐⭐⭐ HTTP cache headers | ⭐⭐⭐ Must implement manually |
| **Mobile-friendly** | ⭐⭐⭐⭐ Standard | ⭐⭐⭐ More complex queries |
| **Offline Sync** | ⭐⭐⭐⭐⭐ ✅ Suits us fine | ⭐⭐⭐ Overkill |
| **Debugging** | ⭐⭐⭐⭐⭐ Browser/Postman | ⭐⭐⭐⭐ GraphQL IDE |

**Decision**: **REST** ✅ (GraphQL in Phase 2 if needed)

---

### **8. Hosting: Railway**

#### Why Railway (not Heroku, AWS, DigitalOcean)?

| Aspect | Railway | Heroku | AWS | DigitalOcean |
|--------|---------|--------|-----|--------------|
| **Setup Time** | ⭐⭐⭐⭐⭐ 5 mins | ⭐⭐⭐⭐⭐ 5 mins | ⭐⭐ 2 hrs | ⭐⭐⭐ 1 hr |
| **Database** | ⭐⭐⭐⭐⭐ PostgreSQL addon | ⭐⭐⭐⭐⭐ Built-in | ⭐⭐⭐ RDS | ⭐⭐⭐ Managed |
| **Scaling** | ⭐⭐⭐ Containers | ⭐⭐⭐ Dynos | ⭐⭐⭐⭐⭐ Unlimited | ⭐⭐⭐ Droplets |
| **Cost (MVP)** | ✅ $0–10/mo | ❌ Shut down free tier | ✅ Pay-per-use | ✅ $5–15/mo |
| **Developer Experience** | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐⭐⭐⭐ Industry standard | ⭐⭐⭐ Complex | ⭐⭐⭐ Good |
| **CI/CD** | ⭐⭐⭐⭐⭐ Git push deploy | ⭐⭐⭐⭐⭐ Git push deploy | ⭐⭐⭐ Must configure | ⭐⭐⭐ Manual |
| **Reliability** | ⭐⭐⭐⭐ ~99.5% | ⭐⭐⭐⭐⭐ ~99.95% | ⭐⭐⭐⭐⭐ ~99.99% | ⭐⭐⭐⭐ Good |

**Decision**: **Railway** ✅

**Why Railway?**
- Git push deploys (zero friction)
- PostgreSQL addon with Point-in-Time Recovery
- Flat fees (no surprise bills)
- Perfect for MVP scaling
- Can migrate to AWS later if needed

**Railway Setup**:
1. Push code to GitHub
2. Connect Railway
3. Add PostgreSQL plugin (auto-provisioned)
4. Set environment variables
5. Auto-deploys on push

---

### **9. Monitoring & Logging**

#### Backend Observability

- **Logging**: Winston (NestJS standard)
- **Error tracking**: Sentry (free tier covers MVP)
- **APM**: DataDog free tier or self-hosted (Phase 2)

```typescript
// NestJS with Winston
@Module({
  imports: [
    LoggerModule.forRoot({
      level: process.env.LOG_LEVEL || 'info',
    }),
  ],
})
export class AppModule {}
```

#### Mobile Analytics (Optional)

- **Crash reporting**: Firebase Crashlytics
- **User analytics**: Firebase Analytics (or muted for MVP)

---

## Full Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USERS / DEVICES                               │
└────────────────────────────────────────────────────────────────────────┐
     │                                  │                                 │
     ▼ Web Browser                     ▼ iOS                             ▼ Android
  (Desktop/Laptop)                   (Flutter)                         (Flutter)
     │                                  │                                 │
     └──────────────────────────────────┴─────────────────────────────────┘
                           │
                      REST API (HTTPS)
                           │
     ┌─────────────────────┴─────────────────────┐
     │                                           │
     ▼                                           ▼
 [Load Balancer]                         [NestJS Backend]
 (Railway)                               (Node.js Cluster)
                                              │
                                     ┌────────┼────────┐
                                     │        │        │
                                     ▼        ▼        ▼
                                  AuthModule AnimalsModule FeedsModule
                                 (JWT guard) (Animal CRUD) (Feed CRUD)
                                     │        │        │
                                     └────────┼────────┘
                                              │
                                    ┌─────────┴─────────┐
                                    │                   │
                                    ▼                   ▼
                              [Sync Engine]      [PostgreSQL]
                              (Conflict res.)    (Multi-tenant RLS)
                                    │                   │
                                    ▼                   ▼
                              Change Log Table   All Domain Tables
                              (versioning)       (animal, activity,
                                                  feed, sale, expense, etc.)

Mobile Offline Layer:
┌─────────────────────────────────────────────────┐
│   Flutter App                                   │
├─ Local SQLite DB (Drift ORM)                   │
│  ├─ Animals (synced copy)                      │
│  ├─ Activities (queued changes)                │
│  ├─ Feeds                                      │
│  ├─ Sales / Expenses                           │
│  └─ _pending_sync (changes awaiting upload)   │
└─────────────────────────────────────────────────┘
```

---

## Deployment Pipeline

```
Developer
    ↓ git push
GitHub
    ↓ GitHub Actions (or auto)
Railway
    ↓ Build NestJS + run migrations
Backend (live)
    ↓ API available
Mobile + Web
    ↓ Consume API (online + offline)
```

**CI/CD Stages**:
1. Lint (ESLint)
2. Build (NestJS compile)
3. Test (Jest unit + integration)
4. Database migration (Typeorm)
5. Deploy (Railway Git push)
6. Smoke tests (health check)

---

## Scaling Path

| Phase | Architecture | Target Scale |
|-------|--------------|--------------|
| **MVP** | Monolith (NestJS) + PostgreSQL | 1k animals, 100 tenants |
| **v1** | Same, with caching (Redis) | 10k animals, 500 tenants |
| **v2** | Microservices (auth, animals, sync) | 100k animals, 5k tenants |
| **v3+** | Full microservice mesh (optional) | Enterprise |

**Why monolith first?**
- Faster to deploy
- Easier to debug
- Premature optimization is evil
- Split modules when bottlenecks appear (database -> cache, sync engine -> workers)

---

## Security Considerations

### Input Validation
```typescript
// NestJS validation pipes
@Post()
create(@Body() createAnimalDto: CreateAnimalDto) {
  // Pipes validate types, ranges, email, etc.
}
```

### CORS
```typescript
// Allow Flutter Web + mobile
app.enableCors({
  origin: process.env.ALLOWED_ORIGINS.split(','),
  credentials: true,
});
```

### SQL Injection Prevention
- **TypeORM parameterized queries** (automatic)
- No string concatenation for SQL

### Multi-tenant Isolation
- PostgreSQL RLS policies
- Always include tenant_id in WHERE clauses
- Audit log mutations

### Rate Limiting
- Token bucket per IP / user
- Prevent brute force + DoS

---

## Technology Summary Table

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| **Frontend (Web/iOS/Android)** | Flutter | 3.x | Unified codebase, offline support |
| **Local Mobile DB** | SQLite + Drift | Latest | Type-safe ORM for offline data |
| **Backend Framework** | NestJS | 9.x | Maintainable, modular, type-safe |
| **Backend DB** | PostgreSQL | 14+ | Multi-tenant RLS, ACID, powerful reporting |
| **API** | REST (HTTP/JSON) | OpenAPI 3.0 | Simple, cacheable, mobile-friendly |
| **Auth** | JWT | RS256 | Stateless, scalable |
| **Hosting** | Railway | - | Low-friction, PostgreSQL addon, Git deploys |
| **Logging** | Winston | Latest | Structured logs, Sentry integration |
| **ORM** | TypeORM | 0.3+ | Auto-migrations, type-safe queries |
| **Testing** | Jest + Supertest | Latest | Unit + integration tests |

---

## Conclusion

This stack is built for **maintainability + scalability** with minimal operational burden. We're optimizing for:

✅ **Fast development** (NestJS modules, Flutter hot reload)  
✅ **Offline-first** (SQLite + custom sync)  
✅ **Multi-tenant safety** (PostgreSQL RLS)  
✅ **Easy onboarding** (clear project structure)  
✅ **Zero vendor lock-in** (PostgreSQL, open standards)  
✅ **Cheap hosting** (Railway, efficient node process)  

We can scale this to thousands of tenants and millions of activity records with minimal architectural changes.

