import 'dart:io';
import 'package:drift/drift.dart';
import 'package:drift/native.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as p;

part 'app_database.g.dart';

// Tenants Table
class Tenants extends Table {
  TextColumn get id => text()();
  TextColumn get name => text()();
  TextColumn get slug => text()();
  TextColumn get logoUrl => text().nullable()();
  TextColumn get primaryColor => text().nullable()();
  TextColumn get secondaryColor => text().nullable()();
  BoolColumn get isActive => boolean().withDefault(const Constant(true))();
  DateTimeColumn get createdAt => dateTime()();
  DateTimeColumn get updatedAt => dateTime()();
  DateTimeColumn get deletedAt => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}

// Users Table
class Users extends Table {
  TextColumn get id => text()();
  TextColumn get tenantId => text()();
  TextColumn get fullName => text()();
  TextColumn get email => text()();
  TextColumn get role => text()();
  TextColumn get phone => text().nullable()();
  BoolColumn get isActive => boolean().withDefault(const Constant(true))();
  DateTimeColumn get lastLoginAt => dateTime().nullable()();
  DateTimeColumn get createdAt => dateTime()();
  DateTimeColumn get updatedAt => dateTime()();
  DateTimeColumn get deletedAt => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}

// Animals Table
class Animals extends Table {
  TextColumn get id => text()();
  TextColumn get tenantId => text()();
  TextColumn get branchId => text()();
  TextColumn get housingUnitId => text().nullable()();
  TextColumn get species => text()();
  TextColumn get breed => text().nullable()();
  TextColumn get tagNumber => text()();
  TextColumn get name => text().nullable()();
  TextColumn get sex => text().nullable()();
  DateTimeColumn get dateOfBirth => dateTime().nullable()();
  DateTimeColumn get intakeDate => dateTime()();
  RealColumn get intakeWeight => real().nullable()();
  RealColumn get currentWeight => real().nullable()();
  TextColumn get status => text()();
  TextColumn get sireTag => text().nullable()();
  TextColumn get damTag => text().nullable()();
  TextColumn get notes => text().nullable()();
  DateTimeColumn get createdAt => dateTime()();
  DateTimeColumn get updatedAt => dateTime()();
  DateTimeColumn get deletedAt => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}

// Activities Table
class Activities extends Table {
  TextColumn get id => text()();
  TextColumn get tenantId => text()();
  TextColumn get animalId => text()();
  TextColumn get activityTypeId => text()();
  DateTimeColumn get performedAt => dateTime()();
  TextColumn get performedById => text()();
  TextColumn get notes => text().nullable()();
  TextColumn get metadata => text().nullable()(); // JSON string
  DateTimeColumn get createdAt => dateTime()();
  DateTimeColumn get updatedAt => dateTime()();
  DateTimeColumn get deletedAt => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}

// Activity Types Table
class ActivityTypes extends Table {
  TextColumn get id => text()();
  TextColumn get tenantId => text()();
  TextColumn get name => text()();
  TextColumn get description => text().nullable()();
  TextColumn get icon => text().nullable()();
  BoolColumn get isActive => boolean().withDefault(const Constant(true))();
  DateTimeColumn get createdAt => dateTime()();
  DateTimeColumn get updatedAt => dateTime()();
  DateTimeColumn get deletedAt => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}

// Sync Queue Table (for offline changes)
class SyncQueue extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get entityType => text()(); // 'animal', 'activity', etc.
  TextColumn get entityId => text()();
  TextColumn get operation => text()(); // 'CREATE', 'UPDATE', 'DELETE'
  TextColumn get payload => text()(); // JSON string
  DateTimeColumn get createdAt => dateTime()();
  IntColumn get retryCount => integer().withDefault(const Constant(0))();
  TextColumn get error => text().nullable()();
}

@DriftDatabase(tables: [
  Tenants,
  Users,
  Animals,
  Activities,
  ActivityTypes,
  SyncQueue,
])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());

  @override
  int get schemaVersion => 1;

  // Migration strategy
  @override
  MigrationStrategy get migration => MigrationStrategy(
        onCreate: (Migrator m) async {
          await m.createAll();
        },
        onUpgrade: (Migrator m, int from, int to) async {
          // Future migrations will go here
        },
      );
}

LazyDatabase _openConnection() {
  return LazyDatabase(() async {
    final dbFolder = await getApplicationDocumentsDirectory();
    final file = File(p.join(dbFolder.path, 'farm_mis.db'));
    return NativeDatabase(file);
  });
}
