# ReserveCar System
<p align="center">
  <a href="https://github.com/ZigmaZero/reservecar">
    <img src="https://img.shields.io/github/last-commit/ZigmaZero/reservecar" alt="Last Commit">
  </a>
  <a href="https://opensource.org/licenses/ISC">
    <img src="https://img.shields.io/badge/License-ISC-blue.svg" alt="License: ISC">
  </a>
</p>

In the work process, employees may require the usage of a vehicle to drive to off-site work locations. Employees who do not wish to use their personal car may choose to rent a company-provided car instead. The ReserveCar System is a platform to rent cars for users within the organization. By using a public LINE Official Account, users can easily access the system from the domestically popular LINE platform. The LINE platform links to an external webpage with a whitelist that users can request access to by linking their LINE account with their employee information. This way, users can conveniently access the car information and rental schedule and submit a car rental request form using the provided input method. The system also uses a relational database management system, which will allow the administrator to access and modify the car data easily and safely.

## How to Setup
### Preparation
1. Install Docker
2. Create a LINE Official Account and enable usage of the LINE Messaging API
3. Create a LINE Login channel and sync the created LINE Official Account
4. In the LINE Login channel, add the following links as callback URLs:
	- {HOST_URL}/line/callback
	- {HOST_URL}/line/callback?action=checkin
	- {HOST_URL}/line/callback?action=checkout
5. Issue a long-lived access token for the LINE Messaging API
6. Enable joining group chats for the LINE Official Account
7. Using an external webhook, capture the group ID of the joined group chat
### Staging
1. Clone this repository
2. Create a directory named `database` in the working directory
3. Provide the `.env` and `.env.backend` files according to the example files
4. Build the container using `docker-compose up --build`
### Production
1. Clone this repository
2. Edit the last line of the Dockerfile to `CMD ["npm", "run", "start"]`
3. Enter your TLS key and certificate as `database/key.pem` and `database/cert.pem`
4. Create a directory named `database` in the working directory
5. Provide the `.env` and `.env.backend` files according to the example files
6. Build the container using `docker-compose up --build`
### Test Suite
1. Clone this repository
2. Edit the last line of the Dockerfile to `CMD ["npm", "run", "test"]`
3. Create a directory named `database` in the working directory
4. Provide the `.env` and `.env.backend` files according to the example files
5. Build the container using `docker-compose up --build`
## Example Environment File
### `.env`
```
# The Client ID of your LINE Login Channel
VITE_LINE_CLIENT_ID = 1234567890
# The Callback URI for your LINE Login
VITE_REDIRECT_URI = {HOST_URL}/line/callback
```
### .env.backend
```
# The name of your database
DATABASE_NAME = database.db
# The secret for signing JWT
TOKEN_SECRET = df48ca9e...
# The LINE Login channel's channel secret
LINE_CLIENT_SECRET = e3fac14b...
# The Client ID of your LINE Login Channel
LINE_CLIENT_ID = 1234567890
# The Messaging API's long-lived access token
LINE_MESSAGING_API_ACCESS_TOKEN = sD/tIAZMl...
# The captured group ID
LINE_LOGGING_GROUP_ID = 2572aCd0...
```
## Contact
This repository will not be actively maintained by the original author after July 31, 2025. Please open an issue for questions or updates.