# API Endpoints - Postman Testing Guide

## Base URL
```
https://tournaments.dev
```
> Note: The ingress routes all services through the same host. You may need to add `tournaments.dev` to your hosts file pointing to `127.0.0.1` and disable SSL verification in Postman.

---

## User Service

### 1. Sign Up
- **Method:** `POST`
- **URL:** `https://tournaments.dev/api/users/signup`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "role": "participant"
  }
  ```
  > `role` options: `"participant"` (default) or `"organizer"`

---

### 2. Sign In
- **Method:** `POST`
- **URL:** `https://tournaments.dev/api/users/signin`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

---

### 3. Sign Out
- **Method:** `POST`
- **URL:** `https://tournaments.dev/api/users/signout`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body:** None

---

### 4. Get Current User
- **Method:** `GET`
- **URL:** `https://tournaments.dev/api/users/currentuser`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body:** None
- **Auth:** Requires session cookie from signin

---

## Tournament Service

### 5. Create Tournament
- **Method:** `POST`
- **URL:** `https://tournaments.dev/api/tournaments`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "title": "Summer Championship 2026",
    "description": "Annual summer gaming tournament with exciting prizes",
    "startDate": "2026-06-01T09:00:00.000Z",
    "endDate": "2026-06-15T18:00:00.000Z",
    "maxParticipants": 64
  }
  ```
- **Auth:** Requires organizer role

---

### 6. Get All Tournaments
- **Method:** `GET`
- **URL:** `https://tournaments.dev/api/tournaments`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body:** None

---

### 7. Get Tournament by ID
- **Method:** `GET`
- **URL:** `https://tournaments.dev/api/tournaments/:id`
- **Example:** `https://tournaments.dev/api/tournaments/550e8400-e29b-41d4-a716-446655440000`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body:** None

---

### 8. Update Tournament
- **Method:** `PUT`
- **URL:** `https://tournaments.dev/api/tournaments/:id`
- **Example:** `https://tournaments.dev/api/tournaments/550e8400-e29b-41d4-a716-446655440000`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "title": "Updated Tournament Name",
    "description": "Updated description for the tournament",
    "startDate": "2026-07-01T09:00:00.000Z",
    "endDate": "2026-07-15T18:00:00.000Z",
    "maxParticipants": 128
  }
  ```
  > All fields are optional - include only what you want to update
- **Auth:** Requires organizer role (must be tournament owner)

---

### 9. Delete Tournament
- **Method:** `DELETE`
- **URL:** `https://tournaments.dev/api/tournaments/:id`
- **Example:** `https://tournaments.dev/api/tournaments/550e8400-e29b-41d4-a716-446655440000`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body:** None
- **Auth:** Requires organizer role (must be tournament owner)

---

## Participation Service

### 10. Join Tournament
- **Method:** `POST`
- **URL:** `https://tournaments.dev/api/participations/join`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "tournamentId": "550e8400-e29b-41d4-a716-446655440000"
  }
  ```
- **Auth:** Requires participant role

---

### 11. Leave Tournament
- **Method:** `DELETE`
- **URL:** `https://tournaments.dev/api/participations/:tournamentId/leave`
- **Example:** `https://tournaments.dev/api/participations/550e8400-e29b-41d4-a716-446655440000/leave`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body:** None
- **Auth:** Requires participant role

---

### 12. Get My Participations
- **Method:** `GET`
- **URL:** `https://tournaments.dev/api/participations/my`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body:** None
- **Auth:** Requires participant role

---

## Organizer Service

### 13. Get Pending Requests
- **Method:** `GET`
- **URL:** `https://tournaments.dev/api/organizer/requests`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body:** None
- **Auth:** Requires organizer role

---

### 14. Approve Participation Request
- **Method:** `POST`
- **URL:** `https://tournaments.dev/api/organizer/requests/:requestId/approve`
- **Example:** `https://tournaments.dev/api/organizer/requests/123e4567-e89b-12d3-a456-426614174000/approve`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body:** None (or empty JSON `{}`)
- **Auth:** Requires organizer role

---

### 15. Reject Participation Request
- **Method:** `POST`
- **URL:** `https://tournaments.dev/api/organizer/requests/:requestId/reject`
- **Example:** `https://tournaments.dev/api/organizer/requests/123e4567-e89b-12d3-a456-426614174000/reject`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "reason": "Tournament is full or participant does not meet requirements"
  }
  ```
  > `reason` is optional
- **Auth:** Requires organizer role

---

## Query Service

### 16. Health Check (Query)
- **Method:** `GET`
- **URL:** `https://tournaments.dev/api/query/health`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body:** None

---

### 17. Get All Tournaments (Query)
- **Method:** `GET`
- **URL:** `https://tournaments.dev/api/query/tournaments`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body:** None

---

### 18. Get Tournament by ID (Query)
- **Method:** `GET`
- **URL:** `https://tournaments.dev/api/query/tournaments/:id`
- **Example:** `https://tournaments.dev/api/query/tournaments/550e8400-e29b-41d4-a716-446655440000`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body:** None

---

### 19. Get All Users (Query)
- **Method:** `GET`
- **URL:** `https://tournaments.dev/api/query/users`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body:** None

---

## Email Service

### 20. Health Check (Email)
- **Method:** `GET`
- **URL:** `https://tournaments.dev/api/email/health`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body:** None

---

### 21. Get Email Logs
- **Method:** `GET`
- **URL:** `https://tournaments.dev/api/email/logs`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body:** None

---

### 22. Clear Email Logs
- **Method:** `DELETE`
- **URL:** `https://tournaments.dev/api/email/logs`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body:** None

---

## Postman Collection Setup Tips

### Environment Variables
Create a Postman environment with these variables:
| Variable | Initial Value | Description |
|----------|---------------|-------------|
| `baseUrl` | `https://tournaments.dev` | Base URL for all requests |
| `tournamentId` | | Store tournament ID after creation |
| `requestId` | | Store participation request ID |

### Using Variables in URLs
Replace hardcoded URLs with:
```
{{baseUrl}}/api/users/signup
{{baseUrl}}/api/tournaments/{{tournamentId}}
```

### Authentication Flow
1. Call **Sign Up** or **Sign In** first
2. The response sets a session cookie automatically
3. Postman will include this cookie in subsequent requests
4. Make sure "Cookies" are enabled in Postman settings

### Test Script Examples
Add to **Sign In** Tests tab:
```javascript
// Save cookie for session management
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

const response = pm.response.json();
if (response.id) {
    pm.environment.set("userId", response.id);
}
```

Add to **Create Tournament** Tests tab:
```javascript
pm.test("Tournament created", function () {
    pm.response.to.have.status(201);
});

const response = pm.response.json();
if (response.id) {
    pm.environment.set("tournamentId", response.id);
}
```

---

## Sample Test Workflow

### As Organizer:
1. `POST /api/users/signup` - Create organizer account (role: "organizer")
2. `POST /api/users/signin` - Sign in
3. `POST /api/tournaments` - Create a tournament
4. `GET /api/organizer/requests` - View pending requests
5. `POST /api/organizer/requests/:requestId/approve` - Approve participant

### As Participant:
1. `POST /api/users/signup` - Create participant account (role: "participant")
2. `POST /api/users/signin` - Sign in
3. `GET /api/tournaments` - Browse tournaments
4. `POST /api/participations/join` - Join a tournament
5. `GET /api/participations/my` - View my participations
6. `DELETE /api/participations/:tournamentId/leave` - Leave tournament

---

## Quick Reference Table

| # | Method | Endpoint | Auth Required | Role |
|---|--------|----------|---------------|------|
| 1 | POST | `/api/users/signup` | No | - |
| 2 | POST | `/api/users/signin` | No | - |
| 3 | POST | `/api/users/signout` | No | - |
| 4 | GET | `/api/users/currentuser` | Yes | Any |
| 5 | POST | `/api/tournaments` | Yes | Organizer |
| 6 | GET | `/api/tournaments` | No | - |
| 7 | GET | `/api/tournaments/:id` | No | - |
| 8 | PUT | `/api/tournaments/:id` | Yes | Organizer |
| 9 | DELETE | `/api/tournaments/:id` | Yes | Organizer |
| 10 | POST | `/api/participations/join` | Yes | Participant |
| 11 | DELETE | `/api/participations/:tournamentId/leave` | Yes | Participant |
| 12 | GET | `/api/participations/my` | Yes | Participant |
| 13 | GET | `/api/organizer/requests` | Yes | Organizer |
| 14 | POST | `/api/organizer/requests/:requestId/approve` | Yes | Organizer |
| 15 | POST | `/api/organizer/requests/:requestId/reject` | Yes | Organizer |
| 16 | GET | `/api/query/health` | No | - |
| 17 | GET | `/api/query/tournaments` | No | - |
| 18 | GET | `/api/query/tournaments/:id` | No | - |
| 19 | GET | `/api/query/users` | No | - |
| 20 | GET | `/api/email/health` | No | - |
| 21 | GET | `/api/email/logs` | No | - |
| 22 | DELETE | `/api/email/logs` | No | - |
