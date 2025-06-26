# Frontend Structure Description
## Scope
The frontend provides interfaces for both employees and admins:
- Employees can register, log in, check in/out of their shifts.
- Admins can manage users, teams, and car data; verify employee profiles; monitor usage; and export data files via the admin dashboard.
## Tech Stack
- Framework: React (with TypeScript)
- Build Tool: Vite
- Component Library: Material UI (MUI) and MUI X (for advanced data grid and form features)
- Package Manager: npm
## Folder Structure
```
/src
  /api          → Backend API functions
  /components   → Reusable UI blocks
  /pages        → Route-level components
  /assets       → Images, icons, fonts
  /types        → TypeScript types and interfaces
```
Structure encourages modular development, scalability, and reusability of components across views.
## Routing Strategy
Uses React Router for client-side navigation. Routes are split by user roles: employee routes and admin dashboard routes. Route protection is implemented via conditional rendering based on authentication state.
## State Management
React’s built-in useState and useEffect are used for most state handling, with states localized for each view. Admin and employee state persistence across routes are handled with React Context.
## Styling & Theming
Leverages Material UI's default theme and component styling system. Responsive layout is handled via MUI Components. Consistency is maintained through MUI's theme configuration.
## API Communication
All data interactions are handled using Axios, configured to communicate with a same-origin backend. Centralized Axios instance handles common headers, token injection, and error management.

Each API endpoint is abstracted into functions under `/api` for easier reuse and maintainability.
## Performance Enhancements
Lazy loading of route-level components ensures that users only load what's necessary for their role. Employee and admin modules are loaded separately. MUI's tree-shaking and Vite's hot module replacement speeds up load times and minimizes data size.
## Build
To run the app locally:
```npm run dev```
⚠️ Development mode currently lacks mock services or dev-specific APIs. API-dependent features will fail unless a backend is available. Future improvements may include dev-specific mocking and environment variables per mode.