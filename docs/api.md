# API Name

## Base URL
`{HOST_URL}/api/`

## Admin Endpoints

### POST /admin/login

**Description:** Login to the system as admin.

**Request Body:**
```json
{
  "name": "admin",
  "password": "adminpassword"
}
```

**Response Example:**
```json
{
  "message": "Login successful",
  "admin": {
    "id": "1",
    "name": "admin"
  },
  "token": "auth_token"
}
```

**Error Codes:**
| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid input parameters |
| 401 | Unauthorized | Invalid credentials |
| 500 | Internal Server Error | Server-side issue |

### PUT /admin/:adminId

**Description:** Update admin information

**Authorization:** Admin Bearer token

**Request Parameters:**
- `adminId`: The adminID of the admin to update

**Request Body:**
```json
{
  "name": "newadmin",
  "password": "newadminpassword"
}
```

**Response Example:**
```json
{
  "admin": {
    "id": "1",
    "name": "newadmin"
  },
  "token": "new_auth_token"
}
```

**Error Codes:**
| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid input parameters |
| 401 | Unauthorized | Invalid auth token |
| 404 | Not Found | Admin of this ID not found |
| 500 | Internal Server Error | Server-side issue |

## Car Endpoints

### GET /cars

**Description:** Obtain a paginated, sortable, and filterable list of cars.

**Authorization:** Admin Bearer token

**Query Parameters:**
| Parameter   | Type   | Description                                                   | Required |
| ----------- | ------ | ------------------------------------------------------------- | -------- |
| page        | number | Page index (0-based). Default: `0`                            | No       |
| pageSize    | number | Number of results per page. Default: `10`                     | No       |
| sortField   | string | Field to sort by: `id`, `plateNumber`, `teamName`             | No       |
| sortOrder   | string | Sorting order: `asc` or `desc`                                | No       |
| filterField | string | Field to filter on: `id`, `plateNumber`, `teamId`, `teamName` | No       |
| filterOp    | string | Filter operation: `=` or `contains`                           | No       |
| filterValue | string | Filter value depending on the filterField                     | No       |

**Response Example:**
```json
{
  "data": [
    {
      "id": 1,
      "plateNumber": "ABC-123",
      "teamId": 1,
      "teamName": "Some Team"
    },
    {
      "id": 2,
      "plateNumber": "ZZZ-111",
      "teamId": 1,
      "teamName": "Some Team"
    }
  ],
  "total": 2,
  "page": 0,
  "pageSize": 10,
  "maxPages": 1
}
```

**Error Codes:**
| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid query parameters |
| 401 | Unauthorized | Invalid auth token |
| 500 | Internal Server Error | Server-side issue |

### GET /cars/:carId

**Description:** Obtain details of a single car by its carId.

**Authorization:** Admin Bearer token

**Request Parameters:**
| Parameter | Type   | Description   | Required |
| --------- | ------ | ------------- | -------- |
| carId     | number | ID of the car | Yes      |

**Response Example:**
```json
{
  "id": 1,
  "plateNumber": "ABC-123",
  "teamId": 1,
  "teamName": "Some Team"
}
```

**Error Codes:**
| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid query parameters |
| 401 | Unauthorized | Invalid auth token |
| 404 | Not Found | No car with that ID |
| 500 | Internal Server Error | Server-side issue |

### POST /car

**Description:** Create a new car record in the system.

**Authorization:** Admin Bearer token

**Request Body:**
```json
{
  "plateNumber": "ABC123",
  "teamId": 2
}
```
| Field       | Type   | Description                      | Required |
| ----------- | ------ | -------------------------------- | -------- |
| plateNumber | string | License plate number (non-empty) | Yes      |
| teamId      | number | Team ID the car belongs to       | Yes      |

**Response Example**
```json
{
  "success": true
}
```

**Error Codes:**
| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Invalid auth token |
| 500 | Internal Server Error | Server-side issue |

### PUT /cars/:carId

**Description:** Update car information with this carId

**Authorization:** Admin Bearer token

**Request Parameters:**
| Parameter | Type   | Description   | Required |
| --------- | ------ | ------------- | -------- |
| carId     | number | ID of the car | Yes      |

**Request Body:**
```json
{
    "plateNumber": "ZZZ-111",
    "teamId": 2
}
```
| Field       | Type   | Description                      | Required |
| ----------- | ------ | -------------------------------- | -------- |
| plateNumber | string | License plate number (non-empty) | Yes      |
| teamId      | number | Team ID                          | Yes      |

**Response Example**
```json
{
    "message": "Car updated successfully."
}
```

**Error Codes:**
| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Invalid auth token |
| 404 | Not Found | Car not found |
| 500 | Internal Server Error | Server-side issue |

### DELETE /cars/:carId

**Description**: Deletes the car with this carId

**Authorization:** Admin Bearer token

**Request Parameters:**
| Parameter | Type   | Description   | Required |
| --------- | ------ | ------------- | -------- |
| carId     | number | ID of the car | Yes      |

**Response Example**
```json
{
    "message": "Car deleted successfully."
}
```

## Employee Endpoints

### GET /employees

**Description:** Obtain a paginated, sortable, and filterable list of employee information.

**Authorization:** Admin Bearer token

**Query Parameters:**
| Parameter   | Type   | Description                                                        | Required |
| ----------- | ------ | ------------------------------------------------------------------ | -------- |
| page        | number | Page index (0-based). Default: `0`                                 | No       |
| pageSize    | number | Number of results per page. Default: `10`                          | No       |
| sortField   | string | Field to sort by: `id`, `teamId`, `verified`, `name`, `teamName`   | No       |
| sortOrder   | string | Sorting order: `asc` or `desc`                                     | No       |
| filterField | string | Field to filter on: `id`, `name`, `verified`, `teamId`, `teamName` | No       |
| filterOp    | string | Filter operation: `=`, `contains`, `is`                            | No       |
| filterValue | string | Filter value, depending on filterField                             | No       |

**Response Example:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "teamId": 2,
      "teamName": "Engineering",
      "verified": true
    }
  ],
  "total": 25,
  "page": 0,
  "pageSize": 10,
  "maxPages": 3
}
```

**Error Codes:**
| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid query parameters |
| 401 | Unauthorized | Invalid auth token |
| 500 | Internal Server Error | Server-side issue |

### GET /employees/:userId

**Description:** Obtain employee information of this userId

**Authorization:** Admin Bearer token

**Request Parameters:**
| Parameter | Type   | Description        | Required |
| --------- | ------ | ------------------ | -------- |
| userId    | number | ID of the employee | Yes      |

**Response Example:**
```json
{
  "id": 1,
  "name": "John Doe",
  "teamId": 2,
  "teamName": "Engineering",
  "verified": true
}
```

**Error Codes:**
| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Invalid auth token |
| 404 | Not Found | Employee not found |
| 500 | Internal Server Error | Server-side issue |

### PUT /employees/:userId/verify

**Description:** Verifies the specified employee, enabling their account.

**Authorization:** Admin Bearer token

**Request Parameters:**
| Parameter | Type   | Description        | Required |
| --------- | ------ | ------------------ | -------- |
| userId    | number | ID of the employee | Yes      |

**Request Body:**
*(none)*

**Response Example:**
```json
{
  "message": "Employee verified successfully.",
  "line": "Message sent successfully"
}
```

**Error Codes:**
| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Invalid auth token |
| 404 | Not Found | Employee not found or already verified |
| 500 | Internal Server Error | Server-side issue |


### PUT /employees/:userId

**Description:** Updates the user's name and team.

**Authorization:** Admin Bearer token

**Request Parameters:**
| Parameter | Type   | Description        | Required |
| --------- | ------ | ------------------ | -------- |
| userId    | number | ID of the employee | Yes      |

**Request Body:**
```json
{
  "name": "New Name",
  "teamId": 2
}
```
| Field  | Type   | Description                   | Required |
| ------ | ------ | ----------------------------- | -------- |
| name   | string | New employee name (non-empty) | Yes      |
| teamId | number | Team ID to assign (optional)  | No       |

**Response Example:**
```json
{
  "message": "Employee updated successfully.",
  "line": "Message sent successfully."
}
```

**Error Codes:**
| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Invalid auth token |
| 404 | Not Found | Employee not found |
| 500 | Internal Server Error | Server-side issue |

### DELETE /employees/:userId

**Description:** Deletes the specified employee from the system.

**Authorization:** Admin Bearer token

**Request Parameters:** 
| Parameter | Type   | Description        | Required |
| --------- | ------ | ------------------ | -------- |
| userId    | number | ID of the employee | Yes      |

**Response Example:**
```json
{
  "message": "Employee deleted successfully.",
  "line": "Deletion success message sent to user."
}
```

**Error Codes:**
| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Invalid auth token |
| 404 | Not Found | Employee not found |
| 500 | Internal Server Error | Server-side issue |

## LINE Endpoints

### GET /line

**Description:** Generates and stores a random state for use with the LINE Login API (to prevent CSRF).

**Authorization:** None

**Query Parameters:**
*(none)*

**Response Example:**
```json
{
  "state": "rO3x92n8Q"
}
```

**Error Codes:**
| Code | Message               | Description                                                  |
|------|-----------------------|--------------------------------------------------------------|
| 500  | Internal Server Error | Retry limit exceeded while a unique state was not generated. |

### DELETE /line/:state

**Description:** Checks if the given state was previously generated by the server, and deletes it. Used to validate a returned state from LINE Login.

**Authorization:** None

**Request Parameters:**
| Parameter | Type   | Description             | Required |
| --------- | ------ | ----------------------- | -------- |
| state     | string | Previously issued state | Yes      |


**Response Example:**
```json
{
  "success": true
}
```

If the state was not found:
```json
{
  "success": false
}
```

**Error Codes:**
| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid request parameters |
| 404 | Not Found | State not found |
| 500 | Internal Server Error | Server-side issue |


### POST /line/auth

**Description:** Performs an access token exchange with the LINE Login API, then retrieves the user’s LINE profile.

**Authorization:** None

**Request Body:**
```json
{
  "code": "auth_code_from_line",
  "redirect_uri": "https://your-callback-uri"
}
```
| Field         | Type   | Description                                 | Required |
| ------------- | ------ | ------------------------------------------- | -------- |
| code          | string | Authorization code from LINE                | Yes      |
| redirect\_uri | string | Redirect URI used in the initial LINE login | Yes      |

**Response Example:**
```json
{
  "profile": {
    "userId": "U4af4980629...",
    "displayName": "Example User",
    "pictureUrl": "https://...",
    "statusMessage": "Hello!"
  }
}
```

**Error Codes:**
| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid request parameters |
| 500 | Internal Server Error | Missing environment variables, or access token exchange failed |


## Reservation Endpoints

### GET /reservations

**Description:** Get a paginated, sortable, and filterable list of reservations.

**Authorization:** Admin bearer token

**Query Parameters:**
| Parameter   | Type   | Description                                                                                              | Required |
| ----------- | ------ | -------------------------------------------------------------------------------------------------------- | -------- |
| page        | number | Page index (0-based). Default: `0`                                                                       | No       |
| pageSize    | number | Number of results per page. Default: `10`                                                                | No       |
| sortField   | string | Field to sort by: `id`, `userId`, `user`, `carId`, `car`, `description`, `checkinTime`, `checkoutTime`   | No       |
| sortOrder   | string | Sorting order: `asc` or `desc`                                                                           | No       |
| filterField | string | Field to filter on: `id`, `userId`, `user`, `carId`, `car`, `description`, `checkinTime`, `checkoutTime` | No       |
| filterOp    | string | Filter operation: `=`, `contains`, `onOrBefore`, `onOrAfter`, `isEmpty`, `isNotEmpty`                    | No       |
| filterValue | string | Filter value depending on the field and filterOp                                                         | No       |

**Response Example:**
```json
{
  "data": [
    {
      "id": 1,
      "userId": 2,
      "carId": 3,
      "description": "Reserved by admin",
      "checkinTime": "2025-06-27T14:00:00.000Z",
      "checkoutTime": null
    }
  ],
  "total": 30,
  "page": 0,
  "pageSize": 10,
  "maxPages": 3
}
```

**Error Codes:**
| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid query parameters |
| 401 | Unauthorized | Invalid auth token |
| 500 | Internal Server Error | Server-side issue |

### GET /reservations/export

**Description:** Get all reservations within a specified time range.

**Authorization:** Admin bearer token

**Query Parameters:**
| Parameter | Type   | Description                                        | Required |
| --------- | ------ | -------------------------------------------------- | -------- |
| startTime | string | Start of time range (ISO8601). Default: 1970-01-01 | No       |
| endTime   | string | End of time range (ISO8601). Default: 9999-12-31   | No       |

**Response Example:**
```json
[
  {
    "id": 1,
    "userId": 2,
    "carId": 3,
    "description": "Reserved by admin",
    "checkinTime": "2025-06-27T14:00:00.000Z",
    "checkoutTime": null
  }
]
```

**Error Codes:**

### GET /reservations/:reservationId

**Description:** Get details of a reservation by its reservationId.

**Authorization:** Admin bearer token

**Query Parameters:**
| Parameter     | Type   | Description                  | Required |
| ------------- | ------ | ---------------------------- | -------- |
| reservationId | number | ID of the reservation record | Yes      |

**Response Example:**
```json
{
  "id": 1,
  "userId": 2,
  "carId": 3,
  "description": "Reserved",
  "checkinTime": "2025-06-27T14:00:00.000Z",
  "checkoutTime": null
}
```

**Error Codes:**
| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Invalid auth token |
| 404 | Not Found | Reservation not found |
| 500 | Internal Server Error | Server-side issue |


### PUT /reservations/:reservationId

**Description:** Update the checkin and checkout time of a reservation.

**Authorization:** Admin bearer token

**Request Parameters:**
| Parameter     | Type   | Description                  | Required |
| ------------- | ------ | ---------------------------- | -------- |
| reservationId | number | ID of the reservation record | Yes      |

**Request Body:**
```json
{
  "checkinTime": "2025-06-27T14:00:00.000Z",
  "checkoutTime": "2025-06-27T16:00:00.000Z"
}
```
| Field        | Type   | Description                     | Required |
| ------------ | ------ | ------------------------------- | -------- |
| checkinTime  | string | ISO8601 timestamp for check-in  | Yes      |
| checkoutTime | string | ISO8601 timestamp for check-out | Yes      |

**Response Example:**
```json
{
  "message": "Reservation updated successfully."
}
```

**Error Codes:**
| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Invalid auth token |
| 404 | Not Found | Reservation not found |
| 500 | Internal Server Error | Server-side issue |

## Team Endpoints

### GET /teams

**Description:** Get a paginated, sortable, and filterable list of teams.

**Authorization:** Admin bearer token

**Query Parameters:**
| Parameter   | Type   | Description                               | Required |
| ----------- | ------ | ----------------------------------------- | -------- |
| page        | number | Page index (0-based). Default: `0`        | No       |
| pageSize    | number | Number of results per page. Default: `10` | No       |
| sortField   | string | Sort by `id` or `name`                    | No       |
| sortOrder   | string | `asc` or `desc`                           | No       |
| filterField | string | `id` or `name`                            | No       |
| filterOp    | string | `=` for id, `contains` for name           | No       |
| filterValue | string | Value to filter                           | No       |

**Response Example:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Engineering"
    }
  ],
  "total": 5,
  "page": 0,
  "pageSize": 10,
  "maxPages": 1
}
```

**Error Codes:**
| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid query parameters |
| 401 | Unauthorized | Invalid auth token |
| 500 | Internal Server Error | Server-side issue |

### GET /teams/all

**Description:** Get a full list of all teams (no pagination).

**Authorization:** Bearer token (Admin or user)

**Query Parameters:** None

**Response Example:**
```json
{
  "teams": [
    {
      "id": 1,
      "name": "Engineering"
    },
    {
      "id": 2,
      "name": "QA"
    }
  ]
}
```

**Error Codes:**
| Code | Message | Description |
|------|---------|-------------|
| 401 | Unauthorized | Invalid auth token |
| 500 | Internal Server Error | Server-side issue |

### GET /teams/:teamId

**Description:** Get details of a single team.

**Authorization:** Admin bearer token

**Query Parameters:**
| Parameter | Type   | Description             | Required |
| --------- | ------ | ----------------------- | -------- |
| teamId    | number | ID of the team to fetch | Yes      |

**Response Example:**
```json
{
  "id": 1,
  "name": "Engineering"
}
```

**Error Codes:**
| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Invalid auth token |
| 404 | Not Found | Reservation not found |
| 500 | Internal Server Error | Server-side issue |

### POST /teams

**Description:** Create a new team.

**Authorization:** Admin bearer token

**Request Body:**
```json
{
  "name": "New Team"
}
```
| Field | Type   | Description      | Required |
| ----- | ------ | ---------------- | -------- |
| name  | string | Name of the team | Yes      |

**Response Example:**
```json
{
  "success": true
}
```

**Error Codes:**
| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Invalid auth token |
| 500 | Internal Server Error | Server-side issue |

### PUT /teams/:teamId

**Description:** Update the name of a team, and send a notification to all its employees.

**Authorization:** Admin bearer token

**Request Parameters:**
| Parameter | Type   | Description              | Required |
| --------- | ------ | ------------------------ | -------- |
| teamId    | number | ID of the team to update | Yes      |

**Request Body:**
```json
{
  "name": "Updated Team"
}
```
| Field | Type   | Description   | Required |
| ----- | ------ | ------------- | -------- |
| name  | string | New team name | Yes      |

**Response Example:**
```json
{
  "message": "Team updated successfully.",
  "line": "All messages sent successfully."
}
```

**Error Codes:**
| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Invalid auth token |
| 404 | Not Found | Reservation not found |
| 500 | Internal Server Error | Server-side issue |

### DELETE /teams/:teamId

**Description:** Delete a team. Only teams with no employees and no cars assigned can be removed.

**Authorization:** Admin bearer token

**Request Parameters:** 
| Parameter | Type   | Description              | Required |
| --------- | ------ | ------------------------ | -------- |
| teamId    | number | ID of the team to delete | Yes      |

**Response Example:**
```json
{
  "message": "Team deleted successfully. All members have been unassigned."
}
```

**Error Codes:**
| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Invalid auth token |
| 403 | Forbidden | Cannot delete team while cars or employees are assigned |
| 404 | Not Found | Reservation not found |
| 500 | Internal Server Error | Server-side issue |

## User Endpoints

### POST /user/register

**Description:** Registers a user in the system (unverified).

**Authorization:** None

**Request Body:**
```json
{
  "fullName": "John Doe",
  "lineId": "Uxxxxxxxxxx"
}
```
| Field    | Type   | Description      | Required |
| -------- | ------ | ---------------- | -------- |
| fullName | string | User’s full name | Yes      |
| lineId   | string | LINE user ID     | Yes      |

**Response Example:**
```json
{
  "success": true
}
```

**Error Codes:**
| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid request parameters |
| 500 | Internal Server Error | Server-side issue |

### POST /user/login

**Description:** Authenticates the user by LINE ID and returns a JWT token.

**Authorization:** None

**Request Body:**
```json
{
  "lineId": "Uxxxxxxxxxx"
}
```
| Field  | Type   | Description  | Required |
| ------ | ------ | ------------ | -------- |
| lineId | string | LINE user ID | Yes      |

**Response Example:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "user": {
    "id": 1,
    "fullName": "John Doe",
    "lineId": "Uxxxxxxxxxx",
    "teamId": 2
  }
}
```

**Error Codes:**
| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid request parameters |
| 404 | Not Found | User not found |
| 500 | Internal Server Error | Server-side issue |


### POST /user/checkin

**Description:** Allows the user to check in with a car to create a new reservation.

**Authorization:** User bearer token

**Request Body:**
```json
{
  "carId": 1,
  "description": "Going to client site"
}
```
| Field       | Type   | Description             | Required |
| ----------- | ------ | ----------------------- | -------- |
| carId       | number | Car ID to reserve       | Yes      |
| description | string | Description of the work | Yes      |

**Response Example:**
```json
{
  "success": true,
  "line": "Message sent successfully"
}
```

**Error Codes:**
| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Invalid auth token |
| 404 | Not Found | User/Car not found |
| 500 | Internal Server Error | Server-side issue |

### POST /user/checkout

**Description:** Allows the user to check out of an active reservation.

**Authorization:** User bearer token

**Request Body:**
```json
{
  "reservationId": 5
}
```
| Field         | Type   | Description              | Required |
| ------------- | ------ | ------------------------ | -------- |
| reservationId | number | Reservation to check out | Yes      |

**Response Example:**
```json
{
  "message": "Checkout successful.",
  "line": "Message sent successfully"
}
```

**Error Codes:**
| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Invalid auth token |
| 403 | Forbidden | Reservation does not belong to user |
| 404 | Not Found | Reservation not found |
| 500 | Internal Server Error | Server-side issue |

### GET /user/cars

**Description:** Get cars assigned to the user’s team. Optionally override team via query.

**Authorization:** User bearer token

**Query Parameters:**
| Parameter | Type   | Description              | Required |
| --------- | ------ | ------------------------ | -------- |
| teamId    | number | Optional override teamId | No       |

**Response Example:**
{
  "cars": [
    {
      "id": 1,
      "plateNumber": "ABC-123",
      "teamId": 2
    }
  ]
}

**Error Codes:**
| Code | Message | Description |
|------|---------|-------------|
| 401 | Unauthorized | Invalid auth token |
| 404 | Not Found | User not found |
| 500 | Internal Server Error | Server-side issue |

### GET /user/reservations

**Description:** Get a list of reservations made by the user that has not been completed

**Authorization:** User bearer token

**Query Parameters:** None

**Response Example:**
```json
{
  "reservations": [
    {
      "id": 10,
      "carId": 1,
      "userId": 5,
      "description": "Trip to client",
      "checkinTime": "2025-06-25T08:00:00.000Z",
      "checkoutTime": null
    }
  ]
}
```

**Error Codes:**
| Code | Message | Description |
|------|---------|-------------|
| 401 | Unauthorized | Invalid auth token |
| 500 | Internal Server Error | Server-side issue |