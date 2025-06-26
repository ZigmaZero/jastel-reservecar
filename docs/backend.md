## Overview 
The backend supports the frontend system, which provides distinct interfaces for employees and admins. Employees can register, log in, and check in/out for reservations. Admins are equipped with tools to manage users, teams, and car data; verify employee profiles; monitor system usage; and export data through the admin dashboard.
## Tech Stack 
Built on Express.js with TypeScript, the backend leverages Axios for seamless communication with external services, including the LINE Login API and LINE Messaging API.
## API Layer 
Designed according to REST principles, API routes are organized by resource type using a modular folder structure for maintainability:

```
routes
  admin.ts          Admin routes for authorization and updating admin information
  car.ts            Admin CRUD for cars
  employee.ts       Admin CRUD for users
  line.ts           User routes for LINE Login and using LINE data.
  reservation.ts    Admin CRUD for reservations
  user.ts           User routes for using the system for auth, checkin, checkout 
```
## Control Layer
Controllers encapsulate the business logic tied to each route, effectively decoupling route definitions from the logic they handle. Input validation occurs within controllers to maintain fine-grained control over incoming data schemas.
## Service Layer
### Modular Services
Each service (e.g., adminService, carService) encapsulates core logic for its corresponding resource and interfaces directly with the database, isolating application logic from request handling.
### Third-party integration
The lineService integrates with the LINE Messaging API and is isolated from core services to keep external dependency logic clean and modular. This integration is disabled in development and test environments to prevent accidental API calls.
## Middleware/Helpers
Express’s built-in middleware is used to parse incoming JSON requests and streamline request handling.
## Security & Permissions
Token-based authentication is implemented via JSON Web Tokens (JWT) and enforced using custom middleware for both users and admins.

CORS is deliberately not implemented to restrict usage to same-origin clients.

Admin credentials are securely stored using bcryptjs for hashing and salting, while user authentication is delegated to the LINE Login API.
## Testing Strategy
The backend includes unit tests written in TypeScript, compiled with tsc, and executed using a Node.js testing framework. Tests interact with a dedicated test database rather than mocking services, ensuring more realistic and reliable coverage of route behavior. Server-side filtering and sorting are verified through end-to-end usage, though not explicitly covered by the unit tests.
## Performance & Monitoring
System performance and errors are tracked using pino, which logs relevant events and requests to a file for later analysis.
## Configuration & Environment Management
Configuration is handled with dotenv, allowing for dynamic environment variable management. In containerized deployments, environment variables are mounted into the container. Additionally, production builds are equipped to use a TLS certificate for HTTPS support, which also requires container mounting.
## Known Limitations / Future Improvements
- TLS certificate functionality in the production environment has yet to be fully validated.
- The system is not architected for high-scale usage, although current demand does not necessitate scaling.
- Unit test coverage does not include filtering and sorting behavior on the server side.