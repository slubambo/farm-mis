# Offline-First Sync Strategy

**Version**: 1.0  
**Database**: PostgreSQL (server) + SQLite (mobile)  
**Conflict Resolution**: Entity-specific rules  

---

## Overview: How Offline-First Works

1. **Mobile captures data locally** (SQLite, Drift ORM)
2. **Changes queued** in `_pending_sync` table while offline
3. **User works freely** — no internet required, no UI blocker
4. **On reconnect**, sync engine pushes changes + pulls updates
5. **Conflicts detected** and resolved per entity type
6. **UI notifies user** of any manual resolution needed

---

## UUID Strategy: Offline Record Identification

### Problem
Mobile device creates animal record while offline. How does backend know it's **new** and not a **duplicate** if sync happens twice?

### Solution: UUIDs + Idempotent IDs

```typescript
// Mobile: Create animal offline
import 'package:uuid/uuid.dart';

final animalId = Uuid().v4(); // e.g., "550e8400-e29b-41d4-a716-446655440000"
await _db.animals.insert({
  'id': animalId,
  'tenant_id': currentTenant,
  'tag_id': 'C-001',
  'species': 'cow',
  'created_at': DateTime.now(),
  // ...
});

// Backend: Receive animal with UUID
POST /api/v1/animals
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "tag_id": "C-001",
  ...
}

// NestJS Service
async createAnimal(dto: CreateAnimalDto) {
  return this.animalRepository.save({
    id: dto.id, // Use provided UUID, don't generate new
    ...rest
  });
}

// Database: UPSERT (insert or update)
INSERT INTO animals (id, tenant_id, tag_id, ...)
VALUES (...)
ON CONFLICT (id) DO UPDATE
SET tag_id = EXCLUDED.tag_id, ...;
```

**Benefit**: Sync can happen 10 times; animal record is created exactly once. ✅

---

## Change Tracking: Detecting What's New

### Server-Side: Timestamp-Based Detection

Every table has `updated_at` (TIMESTAMP):

```sql
-- Mobile: Give server last sync timestamp (e.g., "2026-02-10 14:30:00")
SELECT id, tag_id, species, updated_at
FROM animals
WHERE tenant_id = $1
  AND (created_at > $last_sync_time OR updated_at > $last_sync_time)
LIMIT 1000;
```

**Benefit**: Incremental sync; only new/changed records downloaded. ✅

---

## Synchronization Algorithm

### Phase 1: Push Mobile Changes → Server

```
Mobile starts sync:
│
├─ Lock local database (prevent new edits during sync)
├─ Query _pending_sync table
├─ Find all rows with sync_status = 'pending'
│
├─ For each pending change:
│   ├─ POST /api/v1/sync/push
│   │   {
│   │     "operation": "create|update|delete",
│   │     "entity_type": "animal|activity|feed|sale|expense",
│   │     "payload": { full record object },
│   │     "client_timestamp": "2026-02-14T10:30:00Z"
│   │   }
│   │
│   ├─ Server receives:
│   │   ├─ Validate data
│   │   ├─ Check tenant_id isolation
│   │   ├─ Detect conflicts (next section)
│   │   ├─ Apply if no conflict, OR queue conflict resolution
│   │   ├─ Return: {
│   │       "status": "accepted|conflict",
│   │       "conflict_resolution": {...} // if conflict
│   │     }
│   │
│   ├─ Mobile receives response:
│   │   ├─ If "accepted":
│   │   │   ├─ Update _pending_sync.sync_status = 'synced'
│   │   │   ├─ Update _pending_sync.server_version = returned server ID
│   │   │
│   │   ├─ If "conflict":
│   │   │   ├─ Mark for user review: _pending_sync.sync_status = 'conflict'
│   │   │   ├─ UI prompts user: "Keep mine", "Use server's", "Manual merge"
│   │
│
├─ If all pushes OK or resolved:
│   └─ Proceed to Phase 2
│
└─ Unlock database
```

### Phase 2: Pull Server Changes → Mobile

```
Mobile continues sync:
│
├─ Query local metadata table: last_sync_timestamp
├─ Request changes since last time:
│   GET /api/v1/sync/pull?last_sync_ts=2026-02-14T09:00:00Z
│
├─ Server responds with:
│   {
│     "changes": [
│       {
│         "entity_type": "animal",
│         "operation": "create",
│         "id": "<uuid>",
│         "payload": { full object },
│         "updated_at": "2026-02-14T10:15:00Z"
│       },
│       {
│         "entity_type": "activity",
│         "operation": "delete",
│         "id": "<uuid>",
│         "deleted_at": "2026-02-14T10:20:00Z"
│       },
│       ...
│     ],
│     "server_timestamp": "2026-02-14T10:30:00Z"
│   }
│
├─ Mobile applies changes to SQLite:
│   ├─ For each change:
│   │   ├─ If operation = 'create' or 'update': UPSERT into table
│   │   ├─ If operation = 'delete': soft delete (SET deleted_at)
│   │   ├─ Update updated_at = change.updated_at
│   │
│   ├─ Update metadata: last_sync_timestamp = server_timestamp
│
└─ Sync complete ✅
```

---

## Conflict Detection & Resolution Rules

### What Is a Conflict?

Two changes to the **same record** from **different devices** while **offline** (or online simultaneously).

Example:
- **Device A (caretaker 1)**: Edit animal "C-001" location to "Pen A"
- **Device B (caretaker 2)**: Edit same animal "C-001" location to "Pen B"
- **Both offline** — devices don't know about each other's changes
- **Both syncs trigger** → conflict!

### Conflict Detection Logic

```typescript
// NestJS Sync Service
async pushChange(tenant_id: UUID, change: SyncChange) {
  const { operation, entity_type, payload, client_timestamp } = change;

  // 1. Fetch current server record
  const serverRecord = await this.repo[entity_type].findOne({
    where: { id: payload.id, tenant_id }
  });

  if (!serverRecord) {
    // Record doesn't exist on server → create
    return this.create(entity_type, payload);
  }

  // 2. Compare timestamps
  if (serverRecord.updated_at <= client_timestamp) {
    // Server version is older → accept mobile version (last-write-wins base)
    return this.update(entity_type, payload);
  } else {
    // Server version is newer → potential conflict
    return {
      status: 'conflict',
      conflict_resolution: {
        entity_type,
        entity_id: payload.id,
        server_version: serverRecord,
        client_version: payload,
        conflicting_fields: this.diffObjects(serverRecord, payload),
        resolution_rule: this.getResolutionRule(entity_type),
      }
    };
  }
}

// Per-entity conflict rules
getResolutionRule(entity_type: string): string {
  return CONFLICT_RULES[entity_type] || 'last-write-wins';
}
```

### Conflict Resolution Rules (By Entity Type)

#### **1. ANIMAL Record**

**Rule**: **Last-write-wins** (with notification)

**Rationale**: Animal metadata (location, age, status) is not accumulative.

**Example**:
```
Server: { location: "Pen A", updated_at: "10:20:00" }
Client: { location: "Pen B", updated_at: "10:10:00" }
Result: Keep "Pen A" (server newer), notify user of conflict
```

**Code**:
```typescript
resolveAnimalConflict(conflict: Conflict): void {
  // Always take server version
  const resolution = {
    choose: 'server',
    reason: 'Animal metadata latest on server',
    note: `Note to user: Your change to animal ${conflict.entity_id} location was overwritten. The server had a newer change. Please review the animal's current location.`
  };
  // Log conflict to audit table for later review
  await this.auditService.logConflict(conflict, resolution);
}
```

#### **2. ACTIVITY / EVENT Log**

**Rule**: **Accept BOTH if times differ; reject duplicate**

**Rationale**: Activities are immutable and accumulate.

**Example**:
```
Server: { activity_type: "vaccination", recorded_at: "10:15:00" }
Client: { activity_type: "vaccination", recorded_at: "10:15:00" }
        (exact same time, same type → duplicate)
Result: Reject duplicate, mark as synced (idempotent)
```

**Code**:
```typescript
resolveActivityConflict(conflict: Conflict): ResolvedConflict {
  const { server_version, client_version } = conflict;

  // Check if identical (duplicate)
  if (this.isIdentical(server_version, client_version)) {
    return {
      choose: 'server',
      reason: 'Duplicate activity, server already has it'
    };
  }

  // Different activities → accept both (both happened)
  return {
    choose: 'both',
    reason: 'Both activities recorded at different times, both valid'
  };
}
```

#### **3. FEED USAGE / STOCK TRANSACTIONS**

**Rule**: **Accept BOTH** (usage is cumulative)

**Rationale**: If 10kg used on device A and 5kg on device B, that's 15kg total used.

**Example**:
```
Server: { quantity: 10, transaction_type: "usage" }
Client: { quantity: 5, transaction_type: "usage", same stock_batch_id }
Result: Accept both → total 15kg used
```

**Code**:
```typescript
resolveStockTransactionConflict(conflict: Conflict): ResolvedConflict {
  // Stock transactions are always additive
  return {
    choose: 'both',
    reason: 'Both usage transactions are valid, will be recorded'
  };
}
```

#### **4. SALE Record**

**Rule**: **Last-write-wins** + attempt automatic merge of safe fields

**Rationale**: Sale is a transaction; can't have 2 sales of same animal. But can merge buyer info if changed separately.

**Example**:
```
Server: { 
  quantity: 1, 
  unit_price: 50000,
  buyer_name: "John",
  payment_status: "paid"
}
Client: { 
  quantity: 1, 
  unit_price: 50000,
  buyer_name: "John",
  payment_status: "unpaid"
}

Conflicting field: payment_status
Rule: Use latest timestamp → assume server is correct
Result: Keep server version
Note: "Sale was marked paid on server. If this is wrong, please manually update."
```

**Code**:
```typescript
resolveSaleConflict(conflict: Conflict): ResolvedConflict {
  const { server_version, client_version, conflicting_fields } = conflict;

  // Try to auto-merge safe fields
  const merged = { ...server_version };
  for (const field of conflicting_fields) {
    if (SALE_MERGEABLE_FIELDS.includes(field)) {
      merged[field] = client_version[field]; // safe to merge
    }
  }

  if (this.isIdentical(merged, server_version)) {
    return { choose: 'server', reason: 'No safe merges possible' };
  }

  return { choose: 'merged', merged, reason: 'Merged safe fields' };
}

const SALE_MERGEABLE_FIELDS = ['buyer_contact', 'notes'];
```

#### **5. EXPENSE Record**

**Rule**: **Last-write-wins** (once *approved* by accountant, immutable)

**Rationale**: Finance records must be accurate and auditable.

**Example**:
```
Server: { 
  amount: 5000, 
  status: "approved",
  approved_by: "accountant@farm.com",
  approved_at: "2026-02-14T10:00:00Z"
}
Client: { amount: 4500, status: "pending" }

Conflict: Amount differs
Rule: Approved records are immutable (is_locked = true)
Result: Reject client change, notify user
Message: "This expense was approved by accountant. Cannot modify."
```

**Code**:
```typescript
resolveExpenseConflict(conflict: Conflict): ResolvedConflict {
  if (conflict.server_version.is_locked) {
    return {
      choose: 'server',
      reason: 'Expense is approved & locked. Cannot modify.',
      error: 'Cannot override locked finance record'
    };
  }

  return { choose: 'server', reason: 'Recent server change takes precedence' };
}
```

---

## Soft Deletes & Tombstones

### Problem
Mobile deletes animal while offline. Later syncs. We need to:
1. Delete on server ✅
2. Tell other devices to delete it too ✅
3. Be able to recover if accidental ✅

### Solution: Soft Delete + Tombstone

```sql
-- Instead of:
DELETE FROM animals WHERE id = $1;

-- Do:
UPDATE animals
SET deleted_at = NOW(),
    status = 'deleted'
WHERE id = $1;
```

**Sync Benefits**:
1. Records with `deleted_at IS NOT NULL` are filtered out of pull
2. Mobile sees `deleted_at` in change log → applies soft delete locally
3. Audit trail preserved (recover by setting `deleted_at = NULL`)
4. Hard delete only after retention period (e.g., 90 days)

---

## Handling Edge Cases

### Edge Case 1: Sync Interrupted (Network Failure Mid-Sync)

**Scenario**: Mobile pushes 5 changes, gets response for 3, then loses connection.

**Solution**:
```typescript
// Mobile: Mark only successfully acknowledged changes
for (const change of changes) {
  const response = await this.push(change);
  if (response.status === 'success') {
    await this._db.pendingSync.update(change.id, {
      sync_status: 'synced'
    });
  }
  // Else: Leave as 'pending', will retry next sync
}
```

**Benefit**: Idempotent; retry logic is safe. ✅

---

### Edge Case 2: Mobile Offline for Days (Stale Data)

**Scenario**: Caretaker works for 5 days without internet. Has 50 pending changes.

**Solution**:
1. When connection returns, sync starts
2. Mobile checks if any pending changes now conflict with pulled changes
3. Resolve conflicts first (Phase 0), then push local changes (Phase 1)
4. Pull new data (Phase 2)

```typescript
async fullSync() {
  // Phase 0: Check conflicts before pushing
  const pulledChanges = await this.pull();
  const pendingConflicts = this.detectConflicts(
    this._pending_sync,
    pulledChanges
  );
  
  if (pendingConflicts.length > 0) {
    await this.resolveConflicts(pendingConflicts);
  }

  // Phase 1: Push (remaining non-conflicted changes)
  await this.push(this._pending_sync);

  // Phase 2: Pull final updates
  await this.pull();
}
```

---

### Edge Case 3: Same User on Two Devices

**Scenario**: Caretaker has a phone and a tablet; both offline, both recording activity.

**Solution**: Both devices have `user_id` in records. Activities are non-conflicting (immutable log), so both sync fine. Animal edits will conflict; use last-write-wins.

```typescript
// Activity logged on phone: recorded_by_user_id = caretaker-123
// Activity logged on tablet: recorded_by_user_id = caretaker-123
// Both sync fine (different activity records, different IDs)

// Animal location edited on phone: updated_by_user_id = caretaker-123
// Animal location edited on tablet: updated_by_user_id = caretaker-123
// Conflict: Use timestamp-based last-write-wins
```

---

### Edge Case 4: Server Deletes Record That Mobile Has Pending Changes For

**Scenario**: Server admin deletes animal "C-001". Mobile hasn't synced yet and has a pending "vaccination" activity for "C-001".

**Solution**:
```typescript
// Mobile attempts to sync vaccination for deleted animal
// Server responds: "Animal not found (404)"
// Mobile receives deleted_at in pull phase
// Mobile soft-deletes the animal
// Mobile can either:
//   a) Discard pending activity (activity log integrity)
//   b) Create a "orphaned activity" record for manual review

// Best approach:
if (serverReturns404 && pendingActivityReferencesMissingAnimal) {
  // Notify user: "Animal was deleted on server. Activity discarded."
  await this._db.pendingSync.delete(activity.id);
  await this._notificationService.show("Activity discarded: animal no longer exists");
}
```

---

## Sync Status Indicators (UI/UX)

Mobile should show sync status to user:

```dart
enum SyncStatus {
  synced,     // ✅ All changes synced
  syncing,    // 🔄 Sync in progress
  offline,    // 📵 No internet
  conflict,   // ⚠️ Need user to resolve
  error,      // ❌ Sync failed
}

// UI Example:
if (syncStatus == SyncStatus.synced) {
  Icon(Icons.cloud_done_outlined, color: Colors.green);
} else if (syncStatus == SyncStatus.syncing) {
  CircularProgressIndicator();
} else if (syncStatus == SyncStatus.conflict) {
  Icon(Icons.warning, color: Colors.orange);
  Text("3 items need your review");
}
```

---

## Best Practices & Anti-Patterns

### ✅ DO:

- Use UUIDs for all record IDs
- Include `tenant_id` in every request
- Always include timestamps in responses
- Test conflict resolution thoroughly
- Log all conflicts to audit table
- Provide user-friendly conflict messages

### ❌ DON'T:

- Rely on auto-increment IDs (breaks offline)
- Forget RLS checks (multi-tenant leaks)
- Hard-delete records (breaks sync)
- Trust client clocks (use server timestamps for conflicts)
- Update `updated_at` on read (only on write)
- Ignore network errors (implement retry logic)

---

## Testing Sync Behavior

### Mock Scenarios

```typescript
describe('Sync Engine', () => {
  
  it('should idempotently sync same change twice', async () => {
    const change = { id: uuidv4(), tag_id: 'C-001', ... };
    const res1 = await sync.push(change);
    const res2 = await sync.push(change);
    
    expect(res1.status).toBe('created');
    expect(res2.status).toBe('idempotent'); // Already there
    const count = await db.animals.count({ where: { id: change.id } });
    expect(count).toBe(1); // Only one record
  });

  it('should detect and resolve animal location conflict', async () => {
    // Server has animal at "Pen A" (updated 10:20)
    // Mobile has "Pen B" (updated 10:10)
    const conflict = await sync.detectConflict(...);
    const resolution = sync.resolveAnimalConflict(conflict);
    
    expect(resolution.choose).toBe('server');
    expect(resolution.reason).toContain('last-write-wins');
  });

  it('should accept both feed usage transactions', async () => {
    // Both devices record usage of same feed

    const resolution = sync.resolveStockTransaction(...);
    expect(resolution.choose).toBe('both');
  });
});
```

---

## Monitoring & Observability

Track sync health:

```typescript
// Metrics to log
{
  'sync_duration_ms': 2500,
  'changes_pushed': 12,
  'changes_pulled': 35,
  'conflicts_detected': 2,
  'conflicts_resolved': 2,
  'sync_status': 'success',
  'user_id': 'caretaker-123',
  'tenant_id': 'farm-456'
}
```

Sentry alerts:
- High conflict rate (more than 10% of syncs)
- Repeated sync failures for same user
- Sync taking > 30 seconds (device/network issue)

---

## Conclusion

This custom sync engine is:
- ✅ Simple to understand and debug
- ✅ Handles offline work seamlessly
- ✅ Resolves conflicts intelligently by entity type
- ✅ Safe for multi-tenant isolation
- ✅ Testable and observable

It's production-ready for farms with dozens of devices. Scale to thousands of devices if needed by adding a sync queue (Phase 2).

