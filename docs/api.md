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

**Description:**

**Authorization:**

**Query Parameters:**

**Response Example:**

**Error Codes:**

### GET /reservations/export

**Description:**

**Authorization:**

**Query Parameters:**

**Response Example:**

**Error Codes:**

### GET /reservations/:reservationId

**Description:**

**Authorization:**

**Query Parameters:**

**Response Example:**

**Error Codes:**

### PUT /reservations/:reservationId

**Description:**

**Authorization:**

**Request Parameters:**

**Request Body:**

**Response Example:**

**Error Codes:**

## Team Endpoints

### GET /teams

**Description:**

**Authorization:**

**Query Parameters:**

**Response Example:**

**Error Codes:**

### GET /teams/all

**Description:**

**Authorization:**

**Query Parameters:**

**Response Example:**

**Error Codes:**

### GET /teams/:teamId

**Description:**

**Authorization:**

**Query Parameters:**

**Response Example:**

**Error Codes:**

### POST /teams

**Description:**

**Authorization:**

**Request Body:**

**Response Example:**

**Error Codes:**

### PUT /teams/:teamId

**Description:**

**Authorization:**

**Request Parameters:**

**Request Body:**

**Response Example:**

**Error Codes:**

### DELETE /teams/:teamId

**Description:**

**Authorization:**

**Request Parameters:**

**Response Example:**

**Error Codes:**

## User Endpoints

### POST /user/register

**Description:**

**Authorization:**

**Request Body:**

**Response Example:**

**Error Codes:**

### POST /user/login

**Description:**

**Authorization:**

**Request Body:**

**Response Example:**

**Error Codes:**

### POST /user/checkin

**Description:**

**Authorization:**

**Request Body:**

**Response Example:**

**Error Codes:**

### POST /user/checkout

**Description:**

**Authorization:**

**Request Body:**

**Response Example:**

**Error Codes:**

### GET /user/cars

**Description:**

**Authorization:**

**Query Parameters:**

**Response Example:**

**Error Codes:**

### GET /user/reservations

**Description:**

**Authorization:**

**Query Parameters:**

**Response Example:**

**Error Codes:**