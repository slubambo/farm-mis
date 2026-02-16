# Quick Start Guide - Farm MIS 🚜

## Running the Application

### 1️⃣ Start the Backend (NestJS)

```bash
cd backend
npm run start:dev
```

**Expected Output:**
```
[Nest] XX  - 02/16/2025, XX:XX:XX AM     LOG [NestFactory] Nest application successfully started +X ms
[Nest] XX  - 02/16/2025, XX:XX:XX AM     LOG [InstanceLoader] TypeOrmModule dependencies initialized +XXXms
[Nest] XX  - 02/16/2025, XX:XX:XX AM     LOG [InstanceLoader] AuthModule dependencies initialized +XXXms
[Nest] XX  - 02/16/2025, XX:XX:XX AM     LOG Application is running on: http://localhost:3000
```

Backend is ready when you see: `Application is running on: http://localhost:3000`

---

### 2️⃣ Start the Mobile App (Flutter)

**Option A: Web (Chrome) - Easiest for Development**
```bash
cd mobile
flutter run -d chrome
```

**Option B: iOS Simulator**
```bash
cd mobile
flutter run -d ios
```

**Option C: Android Emulator**
```bash
cd mobile
flutter run -d android
```

---

## Test Credentials

### Login Details
- **Email:** `john@testfarm.com`
- **Password:** `password123`

### What Belongs to This Account
- **Farm Name:** Test Farm
- **Farm Slug:** test-farm
- **User Role:** Owner
- **User ID:** c7478b36-d69c-4991-831a-e2f06eb0ef10
- **Tenant ID:** 73cc191d-c1b8-445d-9f97-e30e58b2f381

---

## Testing the Flows

### Flow 1: Login
1. Start the mobile app
2. You should see the **Login Screen**
3. Enter credentials:
   - Email: `john@testfarm.com`
   - Password: `password123`
4. Tap **Login**
5. You should see the **Home Screen** with:
   - Welcome message: "Welcome, John Doe!"
   - Farm name: "Test Farm"
   - Quick action buttons

### Flow 2: Logout
1. On the Home Screen, tap the **logout icon** (top right)
2. Confirm the logout dialog
3. You should return to the **Login Screen**

### Flow 3: Register New Farm
1. On the Login Screen, tap **"Register"**
2. Fill in the form:
   - Farm Name: `My Farm`
   - Farm Slug: `my-farm` (auto-generated from farm name)
   - Full Name: `Your Name`
   - Email: `your-email@example.com`
   - Password: `password123` (min 8 chars)
   - Confirm Password: `password123`
3. Tap **Create Account**
4. You should return to Login Screen
5. Login with your new credentials

---

## Testing Backend Directly (Using curl)

### Test 1: Register a New User/Farm
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "tenant_name": "New Farm",
    "tenant_slug": "new-farm",
    "full_name": "Jane Smith",
    "email": "jane@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-string",
    "email": "jane@example.com",
    "full_name": "Jane Smith",
    "role": "Owner",
    "tenant_id": "uuid-string"
  },
  "tenant": {
    "id": "uuid-string",
    "name": "New Farm",
    "slug": "new-farm",
    "logo_url": null,
    "primary_color": null,
    "secondary_color": null
  }
}
```

### Test 2: Login User
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@testfarm.com",
    "password": "password123"
  }'
```

**Expected Response:** Same as registration (returns access_token, user, tenant)

### Test 3: Get Current User (Protected Route)
```bash
# First, set the token from a login response
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "id": "c7478b36-d69c-4991-831a-e2f06eb0ef10",
  "email": "john@testfarm.com",
  "tenant_id": "73cc191d-c1b8-445d-9f97-e30e58b2f381",
  "role": "Owner"
}
```

---

## Database Connection

If you need to directly query the database:

```bash
# Connect to PostgreSQL
psql -U farm_mis_user -d farm_mis_db

# Inside psql, you can:
# List all users
SELECT id, email, full_name, role, tenant_id FROM users;

# List all tenants
SELECT id, name, slug FROM tenants;

# List all tables
\dt

# Exit
\q
```

---

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Module

#### Register
```
POST /api/auth/register
Content-Type: application/json

Request:
{
  "tenant_name": "string (required)",
  "tenant_slug": "string (required, lowercase, no spaces)",
  "full_name": "string (required)",
  "email": "string (required, valid email)",
  "password": "string (required, min 8 chars)"
}

Response: 200 OK
{
  "access_token": "jwt-token",
  "user": { id, email, full_name, role, tenant_id },
  "tenant": { id, name, slug, logo_url, primary_color, secondary_color }
}

Errors:
- 400: Invalid input, password too short, email invalid
- 409: Email already exists, slug already exists
- 500: Server error
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

Request:
{
  "email": "string (required)",
  "password": "string (required)"
}

Response: 200 OK
Same as register response

Errors:
- 400: Invalid credentials (email or password wrong)
- 404: User not found
- 500: Server error
```

#### Get Current User (Protected)
```
GET /api/auth/me
Authorization: Bearer <token>

Response: 200 OK
{
  "id": "uuid",
  "email": "string",
  "tenant_id": "uuid",
  "role": "Owner|Manager|Accountant|Caretaker|Viewer"
}

Errors:
- 401: No token, invalid token, expired token
- 500: Server error
```

---

## Troubleshooting

### Backend won't start
```bash
# Check if port 3000 is already in use
lsof -i :3000

# If something is using it, kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 npm run start:dev
```

### Database connection fails
```bash
# Verify PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Check database exists
psql -U farm_mis_user -l | grep farm_mis_db

# If not, create it manually
psql -U postgres -c "CREATE DATABASE farm_mis_db;"
psql -U postgres -c "CREATE USER farm_mis_user WITH PASSWORD 'farm_mis_password';"
psql -U postgres -c "ALTER ROLE farm_mis_user WITH CREATEDB;"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE farm_mis_db TO farm_mis_user;"
```

### Flutter app won't connect to backend
```bash
# Check backend is running
curl http://localhost:3000/api/auth/me

# If on a real device, update API_BASE_URL to your machine's IP:
# Open: mobile/lib/utils/api_config.dart
# Change: const String API_BASE_URL = 'http://YOUR_IP:3000/api';
```

### JWT token expired
Tokens expire after 24 hours. Just login again to get a new token.

### "Already logged in" error on register
Clear the app data or logout first, then register a new account.

---

## Environment Files

### Backend (.env)
Located at: `backend/.env`
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=farm_mis_user
DB_PASSWORD=farm_mis_password
DB_DATABASE=farm_mis_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=24h
PORT=3000
NODE_ENV=development
```

### Mobile (Configuration)
Located at: `mobile/lib/utils/api_config.dart`
```dart
const String API_BASE_URL = 'http://localhost:3000/api';
```

---

## File Structure

```
farm-mis/
├── backend/                      # NestJS application
│   ├── src/
│   │   ├── entities/            # 18 database entities
│   │   ├── modules/auth/        # Authentication module
│   │   ├── app.module.ts        # Root module
│   │   └── main.ts              # Entry point
│   ├── .env                     # Configuration
│   └── package.json
└── mobile/                       # Flutter application
    ├── lib/
    │   ├── screens/             # UI screens (3)
    │   ├── services/            # API & Auth services
    │   ├── providers/           # State management
    │   ├── data/               # Database & models
    │   └── main.dart           # App entry
    └── pubspec.yaml
```

---

## Next Steps

After verifying the login flow works:

### Week 2
1. Create Tenants CRUD endpoints
2. Create Users management endpoints
3. Create Branches management
4. Add mobile screens for these features

### Week 3-4
1. Create Animals module (main feature)
2. Create Activity logging
3. Create Feed inventory
4. Add mobile UI for animals

---

## Support Commands

```bash
# View backend logs in real-time
npm run start:dev

# View mobile app logs
flutter logs

# Check for errors
flutter doctor

# Clean and rebuild Flutter
flutter clean && flutter pub get && flutter run -d chrome

# Rebuild backend
npm run build
```

---

**Last Updated:** February 16, 2025  
**Status:** Ready for testing ✅
