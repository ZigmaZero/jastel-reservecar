# API Name

## Base URL
`{HOST_URL}/api/`

## Endpoints

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