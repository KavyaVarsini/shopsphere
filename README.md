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

---

## 🌐 Production Deployment Guide (Vercel & Render)

Follow these steps to host your application live on the internet.

### 1. Database Setup (MongoDB Atlas)
Since your local MongoDB Compass database cannot be accessed by external servers like Render, you need a cloud MongoDB database:
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. Create a new database user (keep the username and password handy).
3. Under **Network Access**, click **Add IP Address** and select **Allow Access from Anywhere** (adds `0.0.0.0/0` so Render can connect).
4. Go to **Database** ➔ **Connect** ➔ **Drivers** and copy the Connection String. It will look like this:
   `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/shopsphere?retryWrites=true&w=majority`

---

### 2. Backend Deployment (Render)
Render is a great free hosting platform for Node.js backend services:
1. Create a free account at [Render](https://render.com/).
2. Click **New +** ➔ **Web Service**.
3. Link your GitHub account and import your repository (`shopsphere`).
4. Set the following configuration values:
   - **Name**: `shopsphere-backend`
   - **Root Directory**: `backend`
   - **Language**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Expand **Advanced** and add the following **Environment Variables**:
   - `MONGO_URI`: *Your MongoDB Atlas Connection String (with password replaced)*
   - `JWT_SECRET`: *A secure random string (e.g. `my_super_secret_production_key`)*
6. Click **Deploy Web Service**.
7. Once deployed, copy your backend URL from the top of the dashboard (e.g., `https://shopsphere-backend.onrender.com`).

---

### 3. Frontend Deployment (Vercel)
Vercel is the industry standard for hosting React/Vite frontends:
1. Create a free account at [Vercel](https://vercel.com/).
2. Click **Add New...** ➔ **Project**.
3. Import your GitHub repository (`shopsphere`).
4. Set the following configuration values:
   - **Root Directory**: Select the **`frontend`** directory (this is critical!).
   - **Framework Preset**: `Vite` (automatically detected).
5. Open the **Environment Variables** accordion and add:
   - **Key**: `VITE_API_URL`
   - **Value**: *Your deployed Render backend URL from Step 2 (e.g. `https://shopsphere-backend.onrender.com`)*
6. Click **Deploy**.
7. Vercel will build your assets and generate a live public URL for your dashboard!

   VERCEL DEPLOYMENT LINK : https://shopsphere-livid-gamma.vercel.app/

