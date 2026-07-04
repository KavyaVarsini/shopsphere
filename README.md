## ShopSphere Analytics Dashboard

A real-time MERN Stack analytics dashboard for monitoring revenue, monthly sales, and top customers with live updates using Socket.IO.
Designed with an industry-standard UI and clean architecture.

## Features

Admin Authentication (JWT-based)
Total Revenue Calculation
Monthly Sales Analytics (Chart.js)
Top Customers Ranking (by spending)
Real-time Dashboard Updates (Socket.IO)
MongoDB Aggregation Pipelines
Professional, Royal-themed UI (UI-only changes)

🧠 Application Flow
┌────────────┐
│ Admin Login│
└─────┬──────┘
      │ JWT
      ▼
┌────────────────────┐
│ Admin Dashboard    │
│                    │
│ • Total Revenue    │
│ • Monthly Sales    │
│ • Top Customers    │
│                    │
└─────┬──────────────┘
      │ Socket Event
      ▼
┌────────────────────┐
│ Order Created      │
│ (User / Bulk API)  │
└────────────────────┘
When a new order is added → Socket emits new-order → Dashboard updates without refresh

## Tech Stack
Frontend
React (Vite)
Axios
Chart.js
Socket.IO Client
Custom CSS (Industrial UI)
Backend
Node.js
Express.js
MongoDB (Mongoose)
JWT Authentication
Socket.IO

## Project Structure
Frontend
frontend/
├── src/
│   ├── api/
│   │   └── api.js
│   ├── components/
│   │   ├── MonthlySales.jsx
│   │   ├── RevenueCard.jsx
│   │   └── TopCustomers.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   └── Login.jsx
│   ├── socket/
│   │   └── socket.js
│   ├── styles/
│   │   ├── dashboard.css
│   │   ├── monthlySales.css
│   │   └── topCustomers.css
│   ├── App.jsx
│   └── main.jsx

Backend
backend/
├── config/
│   └── db.js
├── middleware/
│   ├── authMiddleware.js
│   └── adminMiddleware.js
├── models/
│   ├── User.js
│   └── Order.js
├── routes/
│   ├── authRoutes.js
│   ├── orderRoutes.js
│   ├── analyticsRoutes.js
│   └── userRoutes.js
├── sockets/
│   └── socket.js
├── .env
└── server.js

## Authentication Flow

Admin logs in via /auth/login
JWT token stored in localStorage
Token sent in headers for all analytics APIs
Authorization: Bearer <JWT_TOKEN>

## Analytics APIs Used
Endpoint	Description
/analytics/revenue	Total completed revenue
/analytics/monthly-sales	Month-wise sales (Jan–Dec)
/analytics/top-customers	Top spenders with user names
    Real-Time Updates (Socket.IO)

Backend emits new-order event after:
Single order creation
Bulk order insertion
Frontend listens and reloads dashboard data

socket.on("new-order", () => {
  loadDashboard();
});

## Database Design
User
{
  name: String,
  email: String,
  password: String,
  role: "admin" | "user"
}

Order
{
  userId: ObjectId (ref: User),
  product: String,
  amount: Number,
  status: "completed",
  month: "Jan" | "Feb" | ...
}

## Bulk Order Insertion

Use:
POST /orders/bulk

Body:

[
  {
    "userId": "USER_OBJECT_ID",
    "product": "iPhone 15",
    "amount": 79900,
    "status": "completed",
    "month": "Jan"
  }
]


🎨 UI Notes

UI changes are purely cosmetic

❌ No logic / API / socket changes

✔ Industry-standard dark & royal theme

✔ Responsive & readable charts

✅ Current Status

✔ Dashboard fully working

✔ Monthly sales aggregated correctly

✔ Top customers show names

✔ Socket real-time updates working

✔ UI upgraded without logic changes

---

## 🚀 Setup & Run Instructions

### 1. Prerequisites
Ensure you have **Node.js** and **MongoDB** installed and running on your local machine.

### 2. Install Dependencies
Run installation in both directories:
```bash
# In backend directory
cd backend
npm install

# In frontend directory
cd ../frontend
npm install
```

### 3. Seed the Database
Before running the servers, seed the MongoDB database with default admin credentials and order logs:
```bash
# Inside backend directory
npm run seed
```
*Seeded Credentials:*
- **Admin Email**: `admin@shopsphere.com`
- **Admin Password**: `admin123`

### 4. Start the Application

#### Start Backend
Starts the server on port `3003` (to avoid EADDRINUSE conflicts):
```bash
# Inside backend directory
npm start
```

#### Start Frontend
Starts the Vite dev server:
```bash
# Inside frontend directory
npm run dev
```
Open the printed local URL (e.g., `http://localhost:5176/`) in your browser and log in with the seeded credentials.

---

## 🛠 Database Inspection (MongoDB Compass)

Since we run the seed script on connection URI `mongodb://127.0.0.1:27017/mern-shopsphere-final`, you can view the data live:
1. Open **MongoDB Compass**.
2. Connect to `mongodb://localhost:27017` or `mongodb://127.0.0.1:27017`.
3. Open the **`mern-shopsphere-final`** database.
4. You can view, modify, or insert documents in the `users` and `orders` collections.

---

## 📥 Adding New Orders

You can add new orders via two approaches:

### Approach A: Directly in MongoDB Compass
1. Go to the `orders` collection in MongoDB Compass.
2. Click **Add Data** ➔ **Insert Document**.
3. Insert a new order structure pointing to a valid customer `userId` (copy an `_id` from the `users` collection):
   ```json
   {
     "userId": { "$oid": "USER_ID_HERE" },
     "product": "AirPods Pro",
     "amount": 24900,
     "status": "completed",
     "month": "Jul"
   }
   ```
4. Click **Insert**. Refresh the web page to see the updated revenue.

### Approach B: Via API (Triggers Live Socket.IO Updates)
Using an API client (like Postman or `curl`) to create orders will trigger live, real-time dashboard updates without needing a page refresh.

#### 1. Log in to get JWT Token
* **POST**: `http://localhost:3003/auth/login`
* **Body (JSON)**:
  ```json
  {
    "email": "admin@shopsphere.com",
    "password": "admin123"
  }
  ```
* Copy the `token` from the response.

#### 2. Create Order
* **POST**: `http://localhost:3003/orders`
* **Headers**:
  * `Authorization`: `Bearer <YOUR_JWT_TOKEN>`
  * `Content-Type`: `application/json`
* **Body (JSON)**:
  ```json
  {
    "product": "iPhone 15 Pro",
    "amount": 129900,
    "status": "completed",
    "month": "Oct"
  }
  ```
The new order will be saved to MongoDB, and the frontend will instantly reflect the updated metrics.