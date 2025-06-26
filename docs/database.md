# Database Schema Description

## ER Diagram

![ER Diagram](./images/Diagram.png)

## Data Dictionary

### Table: Employee
| Column Name | Data Type | Description |
|-------------|-----------|-------------|
| userId | INTEGER (PK) | Unique identifier for the employee. Auto-incremented. |
| lineId | TEXT | LINE platform ID (optional). |
| name | TEXT | Employee’s full name. Required. |
| verified | INTEGER | Boolean-like field indicating verification status (e.g., 1 for true, 0 for false). |
| teamId | INTEGER (FK) | Refers to the `teamId` in the Team table. Nullable. |
| createdAt | TEXT | Timestamp for when the employee record was created. |
| updatedAt | TEXT | Timestamp for last update. |
| deletedAt | TEXT | Timestamp of deletion (for soft delete), nullable. |

### Table: Team
| Column Name | Data Type | Description |
|-------------|-----------|-------------|
| teamId | INTEGER (PK) | Unique team identifier. Auto-incremented. |
| name | TEXT | Name of the team. Required. |
| createdAt | TEXT | Timestamp for record creation. |
| updatedAt | TEXT | Timestamp for last update. |
| deletedAt | TEXT | Timestamp of deletion (nullable). |

### Table: Car
| Column Name | Data Type | Description |
|-------------|-----------|-------------|
| carId | INTEGER (PK) | Unique car identifier. Auto-incremented. |
| plateNumber | TEXT | License plate number of the car. Required. |
| teamId | INTEGER (FK) | Associated team’s ID (nullable). |
| createdAt | TEXT | Timestamp for record creation. |
| updatedAt | TEXT | Timestamp for last update. |
| deletedAt | TEXT | Timestamp of deletion (nullable). |

### Table: Admin
| Column Name | Data Type | Description |
|-------------|-----------|-------------|
| adminId | INTEGER (PK) | Unique administrator ID. Auto-incremented. |
| name | TEXT | Administrator’s name. Required. |
| password | TEXT | Hashed or plaintext password. Required. |
| createdAt | TEXT | Timestamp for record creation. |
| updatedAt | TEXT | Timestamp for last update. |
| deletedAt | TEXT | Timestamp of deletion (nullable). |

### Table: Reservation
| Column Name | Data Type | Description |
|-------------|-----------|-------------|
| reservationId | INTEGER (PK) | Unique reservation ID. Auto-incremented. |
| userId | INTEGER (FK) | Refers to employee making the reservation. |
| carId | INTEGER (FK) | Refers to the reserved car. |
| description | TEXT | Notes or purpose of the reservation. |
| checkinTime | TEXT | Scheduled check-in timestamp. |
| checkoutTime | TEXT | Scheduled check-out timestamp (nullable). |

### Table: LineLoginState
| Column Name | Data Type | Description |
|-------------|-----------|-------------|
| state | TEXT (UNIQUE) | Session or login state identifier. Required. |
| createdAt | TEXT | Timestamp for when the login state was created. |
