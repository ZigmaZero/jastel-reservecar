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

**Authorization:** Bearer Auth

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

### GET /car

**Description:** Obtain paginated car information

**Authorization:** Bearer Auth

**Query Parameters:**
- `page`: The page to fetch
- `pageSize`: The size of the page
- `sortField`: The field to sort the result by
- `sortOrder`: The sorting direction
- `filterField`: The field to filter the data by
- `filterOp`: The filter operation
- `filterValue`: The filter value

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

### GET /car/:carId

**Description:** Obtain car information of this carId

**Authorization:** Bearer Auth

**Request Parameters:**
- `carId`: The ID of the car to fetch

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

**Description:** Create a car

**Authorization:** Bearer Auth

**Request Body:**
```json
{
    "plateNumber": "ABC-123",
    "teamId": 1
}
```

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

### PUT /car/:carId

**Description:** Update car information with this carId

**Authorization:** Bearer Auth

**Request Parameters:**
- `carId`: ID of the car to update

**Request Body:**
```json
{
    "plateNumber": "ZZZ-111",
    "teamId": 2
}
```

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

### DELETE /car/:carId

**Description**: Deletes the car with this carId

**Authorization:** Bearer Auth

**Request Parameters:**
- `carId`: ID of the car to delete

**Response Example**
```json
{
    "message": "Car deleted successfully."
}
```

## Employee Endpoints