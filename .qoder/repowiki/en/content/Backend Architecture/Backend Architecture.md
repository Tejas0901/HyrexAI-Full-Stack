# Backend Architecture

<cite>
**Referenced Files in This Document**
- [app/main.py](file://backend/app/main.py)
- [app/__init__.py](file://backend/app/__init__.py)
- [app/api/v1/api.py](file://backend/app/api/v1/api.py)
- [app/db/session.py](file://backend/app/db/session.py)
- [app/core/config.py](file://backend/app/core/config.py)
- [app/core/logging.py](file://backend/app/core/logging.py)
- [app/api/v1/endpoints/users.py](file://backend/app/api/v1/endpoints/users.py)
- [app/services/base_service.py](file://backend/app/services/base_service.py)
- [app/models/user.py](file://backend/app/models/user.py)
- [app/schemas/user.py](file://backend/app/schemas/user.py)
- [app/services/user_service.py](file://backend/app/services/user_service.py)
- [app/utils/security.py](file://backend/app/utils/security.py)
- [run.py](file://backend/run.py)
- [requirements.txt](file://backend/requirements.txt)
- [alembic/env.py](file://backend/alembic/env.py)
- [tests/test_health.py](file://backend/tests/test_health.py)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)
10. [Appendices](#appendices)

## Introduction
This document describes the backend architecture of a FastAPI application. It covers the application factory pattern, modular API structure, middleware configuration, database layer with SQLAlchemy ORM and async sessions, migration strategy with Alembic, service layer architecture, dependency injection patterns, error handling mechanisms, configuration and logging management, security implementations, and the application lifecycle including startup and shutdown. It also includes guidance on scalability, performance optimization, and production deployment requirements.

## Project Structure
The backend follows a layered, modular structure:
- Application factory and lifecycle in app/main.py
- Versioned API in app/api/v1 with modular endpoint aggregation
- Core configuration and logging in app/core
- Database layer with async SQLAlchemy in app/db
- Domain models in app/models
- Pydantic schemas in app/schemas
- Services in app/services implementing business logic
- Security utilities in app/utils
- Development runner in run.py
- Migration configuration in alembic/env.py
- Tests in backend/tests

```mermaid
graph TB
subgraph "Application Layer"
MAIN["app/main.py"]
INIT_APP["app/__init__.py"]
end
subgraph "API Layer"
V1_API["app/api/v1/api.py"]
USERS_EP["app/api/v1/endpoints/users.py"]
end
subgraph "Core"
CONFIG["app/core/config.py"]
LOGGING["app/core/logging.py"]
end
subgraph "Services"
BASE_SVC["app/services/base_service.py"]
USER_SVC["app/services/user_service.py"]
end
subgraph "Domain"
MODEL_USER["app/models/user.py"]
SCHEMA_USER["app/schemas/user.py"]
end
subgraph "Persistence"
DB_SESSION["app/db/session.py"]
end
subgraph "Infrastructure"
RUNNER["run.py"]
ALEMBIC_ENV["alembic/env.py"]
TESTS["tests/test_health.py"]
end
MAIN --> V1_API
MAIN --> CONFIG
MAIN --> LOGGING
MAIN --> DB_SESSION
V1_API --> USERS_EP
USERS_EP --> USER_SVC
USER_SVC --> BASE_SVC
USER_SVC --> MODEL_USER
USER_SVC --> SCHEMA_USER
BASE_SVC --> DB_SESSION
DB_SESSION --> CONFIG
RUNNER --> MAIN
ALEMBIC_ENV --> CONFIG
ALEMBIC_ENV --> MODEL_USER
TESTS --> MAIN
```

**Diagram sources**
- [app/main.py:1-116](file://backend/app/main.py#L1-L116)
- [app/api/v1/api.py:1-14](file://backend/app/api/v1/api.py#L1-L14)
- [app/api/v1/endpoints/users.py:1-119](file://backend/app/api/v1/endpoints/users.py#L1-L119)
- [app/services/base_service.py:1-152](file://backend/app/services/base_service.py#L1-L152)
- [app/services/user_service.py:1-127](file://backend/app/services/user_service.py#L1-L127)
- [app/models/user.py:1-50](file://backend/app/models/user.py#L1-L50)
- [app/schemas/user.py:1-49](file://backend/app/schemas/user.py#L1-L49)
- [app/db/session.py:1-54](file://backend/app/db/session.py#L1-L54)
- [app/core/config.py:1-131](file://backend/app/core/config.py#L1-L131)
- [app/core/logging.py:1-142](file://backend/app/core/logging.py#L1-L142)
- [run.py:1-19](file://backend/run.py#L1-L19)
- [alembic/env.py:1-103](file://backend/alembic/env.py#L1-L103)
- [tests/test_health.py](file://backend/tests/test_health.py)

**Section sources**
- [app/main.py:1-116](file://backend/app/main.py#L1-L116)
- [app/api/v1/api.py:1-14](file://backend/app/api/v1/api.py#L1-L14)
- [app/core/config.py:1-131](file://backend/app/core/config.py#L1-L131)

## Core Components
- Application factory and lifecycle: The create_application function builds the FastAPI app with environment-aware settings, middleware, routers, and lifespan handlers for startup/shutdown.
- Middleware stack: CORS, GZip compression, and global exception handling.
- Configuration management: Centralized settings via Pydantic Settings with environment variable loading and computed fields for derived values.
- Logging: Structured JSON logging with console and rotating file handlers, plus colored console formatting in development.
- Database layer: Async SQLAlchemy engine and session factory with dependency injection for FastAPI.
- Service layer: Generic BaseService for CRUD operations and UserService for domain-specific logic.
- Security utilities: Password hashing, JWT token creation/verification, and token expiration controls.
- API versioning: Modular v1 endpoints aggregated under a single router.

**Section sources**
- [app/main.py:49-82](file://backend/app/main.py#L49-L82)
- [app/main.py:85-95](file://backend/app/main.py#L85-L95)
- [app/core/config.py:11-131](file://backend/app/core/config.py#L11-L131)
- [app/core/logging.py:68-128](file://backend/app/core/logging.py#L68-L128)
- [app/db/session.py:14-54](file://backend/app/db/session.py#L14-L54)
- [app/services/base_service.py:19-152](file://backend/app/services/base_service.py#L19-L152)
- [app/services/user_service.py:18-127](file://backend/app/services/user_service.py#L18-L127)
- [app/utils/security.py:17-98](file://backend/app/utils/security.py#L17-L98)
- [app/api/v1/api.py:1-14](file://backend/app/api/v1/api.py#L1-L14)

## Architecture Overview
The system uses an application factory pattern to construct the FastAPI app, injects middleware, mounts versioned API routers, and manages database sessions via dependency injection. Lifespan handlers manage logging setup, optional table creation in development, and cleanup on shutdown. The service layer encapsulates business logic and coordinates with SQLAlchemy models and schemas.

```mermaid
graph TB
CLIENT["Client"]
APP["FastAPI App<br/>create_application()"]
LIFESPAN["Lifespan<br/>startup/shutdown"]
CORS["CORS Middleware"]
GZIP["GZip Middleware"]
ROUTER["API Router v1"]
USERS["Users Endpoint"]
SVC["UserService"]
BASE["BaseService"]
DB["Async Session Factory"]
ENGINE["Async Engine"]
MODELS["SQLAlchemy Models"]
SCHEMAS["Pydantic Schemas"]
CLIENT --> APP
APP --> LIFESPAN
APP --> CORS
APP --> GZIP
APP --> ROUTER
ROUTER --> USERS
USERS --> SVC
SVC --> BASE
SVC --> MODELS
SVC --> SCHEMAS
BASE --> DB
DB --> ENGINE
```

**Diagram sources**
- [app/main.py:49-82](file://backend/app/main.py#L49-L82)
- [app/api/v1/api.py:1-14](file://backend/app/api/v1/api.py#L1-L14)
- [app/api/v1/endpoints/users.py:1-119](file://backend/app/api/v1/endpoints/users.py#L1-L119)
- [app/services/user_service.py:18-127](file://backend/app/services/user_service.py#L18-L127)
- [app/services/base_service.py:19-152](file://backend/app/services/base_service.py#L19-L152)
- [app/db/session.py:14-54](file://backend/app/db/session.py#L14-L54)

## Detailed Component Analysis

### Application Factory and Lifecycle
- Factory function constructs the FastAPI app with environment-aware docs/redoc/OpenAPI visibility and sets lifespan.
- Lifespan handles logging initialization, optional development table creation, and engine disposal on shutdown.
- Global exception handler centralizes error responses.

```mermaid
sequenceDiagram
participant Proc as "Process"
participant Uvicorn as "Uvicorn"
participant App as "FastAPI App"
participant Lifespan as "Lifespan"
participant Log as "Logging"
participant DB as "DB Engine"
Proc->>Uvicorn : "Start server"
Uvicorn->>App : "Load app.main : app"
App->>Lifespan : "Invoke lifespan()"
Lifespan->>Log : "setup_logging()"
Lifespan->>DB : "Optional table creation (dev)"
Lifespan-->>App : "Yield to serve requests"
App-->>Uvicorn : "Requests handled"
Uvicorn->>Lifespan : "Shutdown"
Lifespan->>DB : "Dispose engine"
Lifespan-->>Uvicorn : "Exit"
```

**Diagram sources**
- [app/main.py:22-46](file://backend/app/main.py#L22-L46)
- [app/main.py:49-82](file://backend/app/main.py#L49-L82)
- [app/core/logging.py:68-128](file://backend/app/core/logging.py#L68-L128)
- [app/db/session.py:14-20](file://backend/app/db/session.py#L14-L20)

**Section sources**
- [app/main.py:22-46](file://backend/app/main.py#L22-L46)
- [app/main.py:49-82](file://backend/app/main.py#L49-L82)
- [app/main.py:85-95](file://backend/app/main.py#L85-L95)

### Middleware Configuration
- CORS: Controlled via settings with origins, methods, headers, and credentials.
- GZip: Enabled with a minimum size threshold for compression.
- Docs visibility: Hidden in production for security and cleaner deployments.

```mermaid
flowchart TD
Start(["Startup"]) --> LoadSettings["Load Settings"]
LoadSettings --> ConfigureCORS["Configure CORS Middleware"]
LoadSettings --> ConfigureGZip["Configure GZip Middleware"]
ConfigureCORS --> MountRouter["Mount API Router"]
ConfigureGZip --> MountRouter
MountRouter --> Ready(["Server Ready"])
```

**Diagram sources**
- [app/main.py:64-77](file://backend/app/main.py#L64-L77)
- [app/core/config.py:40-60](file://backend/app/core/config.py#L40-L60)

**Section sources**
- [app/main.py:64-77](file://backend/app/main.py#L64-L77)
- [app/core/config.py:40-60](file://backend/app/core/config.py#L40-L60)

### Database Layer and Session Management
- Async engine configured from settings with optional echo and pool behavior.
- Async session factory with explicit commit/rollback and close semantics.
- Dependency injection via get_db for FastAPI endpoints.

```mermaid
classDiagram
class AsyncSessionLocal {
+create_async_engine(url, echo, future, poolclass)
+async_sessionmaker(engine, class_, expire_on_commit, autocommit, autoflush)
}
class get_db {
+AsyncGenerator[AsyncSession]
+commit()
+rollback()
+close()
}
AsyncSessionLocal --> get_db : "provides sessions"
```

**Diagram sources**
- [app/db/session.py:14-54](file://backend/app/db/session.py#L14-L54)

**Section sources**
- [app/db/session.py:14-54](file://backend/app/db/session.py#L14-L54)
- [app/core/config.py:73-91](file://backend/app/core/config.py#L73-L91)

### Migration Strategy with Alembic
- Alembic environment loads settings and sets the sync database URL for migrations.
- Imports models for detection and supports offline/online async migrations.

```mermaid
flowchart TD
A["Alembic Env"] --> B["Load Settings"]
B --> C["Set sqlalchemy.url (sync)"]
C --> D["Import Models"]
D --> E{"Mode"}
E --> |Offline| F["configure(url)"]
E --> |Online| G["async_engine_from_config()"]
F --> H["run_migrations()"]
G --> H
```

**Diagram sources**
- [alembic/env.py:20-103](file://backend/alembic/env.py#L20-L103)
- [app/core/config.py:86-91](file://backend/app/core/config.py#L86-L91)

**Section sources**
- [alembic/env.py:20-103](file://backend/alembic/env.py#L20-L103)
- [app/core/config.py:86-91](file://backend/app/core/config.py#L86-L91)

### Service Layer Architecture and Dependency Injection
- BaseService provides generic CRUD operations with type variables for models and schemas.
- UserService extends BaseService with domain logic (password hashing, authentication checks).
- Endpoints depend on UserService and receive AsyncSession via get_db.

```mermaid
classDiagram
class BaseService~ModelType,CreateSchemaType,UpdateSchemaType~ {
+db : AsyncSession
+get(id)
+get_multi(skip, limit)
+create(obj_in)
+update(db_obj, obj_in)
+delete(id)
+exists(id)
+count()
}
class UserService {
+verify_password(plain, hashed) bool
+get_password_hash(password) str
+get_by_email(email) User?
+create(CreateUser) User
+update(User, UserUpdate) User
+authenticate(email, password) User?
+is_active(User) bool
+is_verified(User) bool
}
class UsersEndpoint {
+list_users(skip, limit, db)
+create_user(user_data, db)
+get_user(user_id, db)
+update_user(user_id, user_data, db)
+delete_user(user_id, db)
}
UserService --|> BaseService : "extends"
UsersEndpoint --> UserService : "uses"
UserService --> AsyncSession : "depends on"
```

**Diagram sources**
- [app/services/base_service.py:19-152](file://backend/app/services/base_service.py#L19-L152)
- [app/services/user_service.py:18-127](file://backend/app/services/user_service.py#L18-L127)
- [app/api/v1/endpoints/users.py:19-119](file://backend/app/api/v1/endpoints/users.py#L19-L119)
- [app/db/session.py:32-54](file://backend/app/db/session.py#L32-L54)

**Section sources**
- [app/services/base_service.py:19-152](file://backend/app/services/base_service.py#L19-L152)
- [app/services/user_service.py:18-127](file://backend/app/services/user_service.py#L18-L127)
- [app/api/v1/endpoints/users.py:19-119](file://backend/app/api/v1/endpoints/users.py#L19-L119)

### Error Handling Mechanisms
- Global exception handler returns standardized JSON responses with contextual details.
- Endpoint-level HTTP exceptions provide precise failure semantics.

```mermaid
sequenceDiagram
participant Client as "Client"
participant App as "FastAPI App"
participant Handler as "Global Exception Handler"
participant Logger as "Logger"
Client->>App : "Request"
App->>App : "Route/Service raises Exception"
App->>Handler : "Unhandled exception"
Handler->>Logger : "log error"
Handler-->>Client : "JSONResponse 500"
```

**Diagram sources**
- [app/main.py:85-95](file://backend/app/main.py#L85-L95)
- [app/core/logging.py:68-128](file://backend/app/core/logging.py#L68-L128)

**Section sources**
- [app/main.py:85-95](file://backend/app/main.py#L85-L95)

### Configuration Management
- Settings loaded from environment variables with Pydantic Settings.
- Computed fields derive async/sync database URLs, lists for CORS, and environment flags.
- Caching via LRU cache for efficient retrieval.

```mermaid
flowchart TD
Env[".env"] --> Settings["Settings (Pydantic BaseSettings)"]
Settings --> Computed["Computed Fields"]
Computed --> AsyncURL["async_database_url"]
Computed --> SyncURL["sync_database_url"]
Computed --> Origins["cors_origins_list"]
Computed --> Methods["cors_allow_methods_list"]
Computed --> Headers["cors_allow_headers_list"]
Settings --> Flags["Environment Flags"]
```

**Diagram sources**
- [app/core/config.py:11-131](file://backend/app/core/config.py#L11-L131)

**Section sources**
- [app/core/config.py:11-131](file://backend/app/core/config.py#L11-L131)

### Logging Setup
- Structured JSON logging for production with rotating file handler.
- Colored console formatter for development.
- Third-party library noise reduced via logger level tuning.

```mermaid
flowchart TD
Start(["setup_logging()"]) --> Level["Resolve level/log_file/format"]
Level --> Root["Get root logger"]
Root --> Clear["Clear existing handlers"]
Clear --> Console["Add console handler (formatter)"]
Console --> FileCheck{"log_file set?"}
FileCheck --> |Yes| File["RotatingFileHandler(JSONFormatter)"]
FileCheck --> |No| Skip["Skip file handler"]
File --> Done(["Handlers configured"])
Skip --> Done
```

**Diagram sources**
- [app/core/logging.py:68-128](file://backend/app/core/logging.py#L68-L128)

**Section sources**
- [app/core/logging.py:68-128](file://backend/app/core/logging.py#L68-L128)

### Security Implementations
- Password hashing with bcrypt via passlib.
- JWT token creation/refresh with configurable expiration and signing algorithm.
- Token decoding with error handling.

```mermaid
flowchart TD
A["Password Input"] --> B["get_password_hash()"]
B --> C["Store hashed_password"]
D["Login Request"] --> E["verify_password()"]
E --> F{"Match?"}
F --> |Yes| G["Issue Access Token"]
F --> |No| H["Reject"]
I["Access Token"] --> J["decode_token()"]
J --> K{"Valid?"}
K --> |Yes| L["Allow"]
K --> |No| M["Block"]
```

**Diagram sources**
- [app/utils/security.py:17-98](file://backend/app/utils/security.py#L17-L98)
- [app/services/user_service.py:26-34](file://backend/app/services/user_service.py#L26-L34)

**Section sources**
- [app/utils/security.py:17-98](file://backend/app/utils/security.py#L17-L98)
- [app/services/user_service.py:26-34](file://backend/app/services/user_service.py#L26-L34)

### Application Lifecycle, Startup, and Shutdown
- Startup: Logging initialized, optional development table creation, router mounted.
- Runtime: Requests served through endpoints using injected services and sessions.
- Shutdown: Engine disposed to release connections.

```mermaid
stateDiagram-v2
[*] --> Initializing
Initializing --> Ready : "startup completes"
Ready --> Serving : "requests handled"
Serving --> ShuttingDown : "shutdown triggered"
ShuttingDown --> Disposed : "engine disposed"
Disposed --> [*]
```

**Diagram sources**
- [app/main.py:22-46](file://backend/app/main.py#L22-L46)
- [app/db/session.py:45-54](file://backend/app/db/session.py#L45-L54)

**Section sources**
- [app/main.py:22-46](file://backend/app/main.py#L22-L46)
- [app/db/session.py:45-54](file://backend/app/db/session.py#L45-L54)

## Dependency Analysis
External dependencies include FastAPI, Uvicorn, SQLAlchemy asyncio, Alembic, Pydantic settings, python-jose/cryptography, passlib/bcrypt, and development/testing tools. These are declared in requirements.txt.

```mermaid
graph TB
REQ["requirements.txt"]
FASTAPI["fastapi"]
UVICORN["uvicorn[standard]"]
SQLA["sqlalchemy[asyncio]"]
ASYNC_PG["asyncpg"]
ALEMBIC["alembic"]
PYDANTIC["pydantic-settings"]
JOSE["python-jose[cryptography]"]
PASSLIB["passlib[bcrypt]"]
REQ --> FASTAPI
REQ --> UVICORN
REQ --> SQLA
REQ --> ASYNC_PG
REQ --> ALEMBIC
REQ --> PYDANTIC
REQ --> JOSE
REQ --> PASSLIB
```

**Diagram sources**
- [requirements.txt:1-39](file://backend/requirements.txt#L1-L39)

**Section sources**
- [requirements.txt:1-39](file://backend/requirements.txt#L1-L39)

## Performance Considerations
- Use async SQLAlchemy for non-blocking I/O.
- Enable GZip middleware to reduce payload sizes.
- Tune CORS settings to minimize preflight overhead.
- Use pagination parameters to limit result sizes.
- Prefer bulk operations where appropriate and avoid N+1 queries.
- Monitor and tune database connection pooling.
- Use structured logging for observability and reduce noisy third-party logs.

## Troubleshooting Guide
- Health check endpoint: Verify application availability at /health.
- Environment variables: Ensure .env is present and settings are correctly loaded.
- Database connectivity: Confirm async database URL and credentials.
- Logging: Check log file path and format; verify rotating file handler configuration.
- Exceptions: Review global exception handler output and logs for unhandled errors.

**Section sources**
- [app/main.py:98-116](file://backend/app/main.py#L98-L116)
- [app/core/config.py:11-131](file://backend/app/core/config.py#L11-L131)
- [app/core/logging.py:68-128](file://backend/app/core/logging.py#L68-L128)
- [tests/test_health.py](file://backend/tests/test_health.py)

## Conclusion
The backend employs a clean, modular FastAPI architecture with an application factory, robust configuration and logging, async database operations, typed schemas, a generic service layer, and comprehensive security utilities. Alembic migrations support schema evolution, while middleware and lifecycle management ensure reliable operation across environments.

## Appendices

### API Endpoints Overview
- GET /: Application metadata and docs availability
- GET /health: Health check
- GET /api/v1/users: List users with pagination
- POST /api/v1/users: Create user
- GET /api/v1/users/{user_id}: Retrieve user
- PUT /api/v1/users/{user_id}: Update user
- DELETE /api/v1/users/{user_id}: Delete user

**Section sources**
- [app/main.py:98-116](file://backend/app/main.py#L98-L116)
- [app/api/v1/api.py:11-13](file://backend/app/api/v1/api.py#L11-L13)
- [app/api/v1/endpoints/users.py:19-119](file://backend/app/api/v1/endpoints/users.py#L19-L119)