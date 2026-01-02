# Tournaments Microservices Platform

A microservices-based tournament management system with Role-Based Access Control (RBAC), built with Node.js, TypeScript, TypeORM, PostgreSQL, and NATS Streaming.

## Architecture Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   User      │     │ Tournament  │     │Participation│
│  Service    │     │  Service    │     │  Service    │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                    ┌──────┴──────┐
                    │    NATS     │
                    │  Streaming  │
                    └──────┬──────┘
                           │
       ┌───────────────────┼───────────────────┐
       │                   │                   │
┌──────┴──────┐     ┌──────┴──────┐     ┌──────┴──────┐
│  Organizer  │     │   Query     │     │   Email     │
│  Service    │     │  Service    │     │  Service    │
└─────────────┘     └─────────────┘     └─────────────┘
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| **User** | 3000 | Authentication, user management, JWT tokens |
| **Tournament** | 3001 | Tournament CRUD operations |
| **Participation** | 3002 | Join/leave tournaments, participation requests |
| **Organizer** | 3003 | Approve/reject participation requests |
| **Query** | 3004 | Read-optimized queries across services |
| **Email** | 3005 | Email notifications (welcome, approval, etc.) |

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with TypeORM
- **Message Broker**: NATS Streaming
- **Authentication**: JWT with cookie-session
- **Container**: Docker + Kubernetes
- **Dev Tools**: Skaffold for local development

## User Roles (RBAC)

| Role | Permissions |
|------|-------------|
| **PARTICIPANT** | Join tournaments, view own participations, leave tournaments |
| **ORGANIZER** | Create/update/delete tournaments, approve/reject participation requests |

## Event-Driven Architecture

### Published Events

- `user:created` - When a new user signs up
- `tournament:created` - When a tournament is created
- `tournament:updated` - When a tournament is modified
- `tournament:deleted` - When a tournament is deleted
- `participation:requested` - When a user requests to join
- `participation:approved` - When organizer approves a request
- `participation:rejected` - When organizer rejects a request
- `participation:left` - When a user leaves a tournament

### Data Consistency

- **Optimistic Concurrency Control**: Version columns on entities
- **Event Ordering**: Version-based event processing to handle out-of-order messages
- **Local Replicas**: Services maintain local copies of required data for resilience

## Getting Started

### Prerequisites

- Docker Desktop
- Kubernetes enabled
- Skaffold CLI
- Node.js 18+

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tournaments
   ```

2. **Create Kubernetes secrets**
   ```bash
   kubectl create secret generic jwt-secret --from-literal=JWT_KEY=your-secret-key
   ```

3. **Update hosts file** (for local ingress)
   ```
   127.0.0.1 tournaments.dev
   ```

4. **Start development**
   ```bash
   skaffold dev
   ```

## API Endpoints

### User Service

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/users/signup` | Register new user | No |
| POST | `/api/users/signin` | Sign in | No |
| POST | `/api/users/signout` | Sign out | Yes |
| GET | `/api/users/currentuser` | Get current user | Yes |

### Tournament Service

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/api/tournaments` | List all tournaments | No | - |
| GET | `/api/tournaments/:id` | Get tournament details | No | - |
| POST | `/api/tournaments` | Create tournament | Yes | ORGANIZER |
| PUT | `/api/tournaments/:id` | Update tournament | Yes | ORGANIZER |
| DELETE | `/api/tournaments/:id` | Delete tournament | Yes | ORGANIZER |

### Participation Service

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | `/api/participations/join` | Request to join tournament | Yes | PARTICIPANT |
| DELETE | `/api/participations/:tournamentId` | Leave tournament | Yes | PARTICIPANT |
| GET | `/api/participations/my` | Get my participations | Yes | PARTICIPANT |

### Organizer Service

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/api/organizer/requests` | Get pending requests | Yes | ORGANIZER |
| POST | `/api/organizer/approve/:id` | Approve participation | Yes | ORGANIZER |
| POST | `/api/organizer/reject/:id` | Reject participation | Yes | ORGANIZER |

## Project Structure

```
tournaments/
├── common/                 # Shared library
│   └── src/
│       ├── errors/         # Custom error classes
│       ├── middlewares/    # Express middlewares
│       ├── types/          # TypeScript types & enums
│       └── events/         # Event definitions
├── user/                   # User service
├── tournament/             # Tournament service
├── participation/          # Participation service
├── organizer/              # Organizer service
├── query/                  # Query service
├── email/                  # Email service
├── infra/
│   └── k8s/               # Kubernetes manifests
└── skaffold.yaml          # Skaffold configuration
```

## Database Schema

### User Service
- **users**: id, email, password, role, version

### Tournament Service
- **tournaments**: id, title, description, maxParticipants, currentParticipants, organizerId, version

### Participation Service
- **tournaments** (replica): id, title, maxParticipants, currentParticipants, organizerId, version
- **participations**: id, tournamentId, participantId, participantEmail, organizerId, status, version

## Environment Variables

| Variable | Description |
|----------|-------------|
| `JWT_KEY` | Secret key for JWT signing |
| `NATS_URL` | NATS Streaming server URL |
| `NATS_CLUSTER_ID` | NATS cluster identifier |
| `NATS_CLIENT_ID` | Unique client identifier |
| `DATABASE_URL` | PostgreSQL connection string |

## License

MIT
