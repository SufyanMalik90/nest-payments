# Payment Processing Service

## Overview
This NestJS-based payment processing service implements a robust workflow with features including:
- **Concurrent request handling** to prevent duplicate charges.
- **Transactional integrity** for consistency across payments and attempts.
- **Retry logic** with exponential backoff for failed payments.
- **Idempotency enforcement** to avoid duplicate records.
- **Audit logging** for critical steps such as payment initiation, success/failure, and retries.

## Technologies Used
- **NestJS** (with TypeORM for database interactions)
- **MySQL** (via Docker)
- **Axios** (for payment gateway requests)



## API Endpoints
### 1. Process a Payment
**Endpoint:** `POST /payments/process`

**Request Body:**
```json
{
    "order_id": "unique-order-id",
    "amount": 100.00
}
```

**Success Response:**
```json
{
    "message": "Payment processed successfully",
    "transaction_id": "txn-12345"
}
```

**Failure Response:**
```json
{
    "message": "Payment failed after maximum retries"
}
```

## Implementation Details
### 1. Handling Concurrent Requests
- **Database-Level Locking:** A **unique constraint** is enforced on `order_id` to prevent duplicate charges.
- **Checking Existing Payment:** Before initiating a transaction, the system checks if a payment with the same `order_id` already exists and is `completed`.

### 2. Transaction Management
- All updates to `payments` and `payment_attempts` are wrapped in **TypeORM transactions** to ensure atomicity.
- If any step fails, the entire transaction is rolled back.

### 3. Retry Logic with Exponential Backoff
- If a payment fails, the system retries up to **3 times**.
- The retry delay follows an **exponential backoff** strategy:
    - 1st retry: **2 seconds**
    - 2nd retry: **4 seconds**
    - 3rd retry: **8 seconds**
- All attempts are logged in the `payment_attempts` table.

### 4. Idempotency Handling
- If a payment attempt is retried, the system ensures that it updates the same `payments` entry instead of creating a new record.
- The **order_id** is used as a unique identifier to prevent duplication.

### 5. Audit Logging
- Logs key events such as:
  - **Payment initiation**
  - **Each retry attempt**
  - **Final success or failure**
- Logs include timestamps and responses from the payment gateway.

## Setup & Execution
### 1. Clone the Repository
```sh
git clone https://github.com/your-repo/payment-service.git
cd payment-service
```

### 2. Setup Environment Variables
Create a `.env` file with:
```env
DB_HOST=mysql
DB_PORT=3306
DB_USER=nest
DB_PASSWORD=nest
DB_NAME=nest_payments
PAYMENT_GATEWAY_URL=https://mock-payment-gateway.com/pay
```

### 3. Start Services using Docker
```sh
docker-compose up --build
```

### 4. Start the Server
```sh
npm run start:dev
```

### 6. Testing with Postman or cURL
#### Successful Payment Request:
```sh
curl -X POST http://localhost:3000/payments/process \
-H "Content-Type: application/json" \
-d '{ "order_id": "order-123", "amount": 100.00 }'
```

## Trade-offs & Considerations
### Performance vs. Consistency
- The use of database-level constraints ensures data integrity but might impact performance under high concurrency.
- Exponential backoff minimizes strain on the payment gateway but increases overall transaction time.


## Conclusion
This service ensures **secure, reliable, and efficient** payment processing by handling concurrency, failures, retries, and logging while maintaining data integrity.

