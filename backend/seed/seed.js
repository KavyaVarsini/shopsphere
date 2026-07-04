const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const User = require("../models/User");
const Order = require("../models/Order");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mern-shopsphere-final";

const seedData = async () => {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    console.log("🧹 Clearing existing Users and Orders...");
    await User.deleteMany({});
    await Order.deleteMany({});
    console.log("✅ Collections cleared");

    // Hash passwords
    const adminPassword = await bcrypt.hash("admin123", 10);
    const userPassword = await bcrypt.hash("user123", 10);

    // Create Users
    console.log("👤 Creating users...");
    const users = await User.insertMany([
      {
        name: "Admin User",
        email: "admin@shopsphere.com",
        password: adminPassword,
        role: "admin"
      },
      {
        name: "John Doe",
        email: "john@shopsphere.com",
        password: userPassword,
        role: "user"
      },
      {
        name: "Jane Smith",
        email: "jane@shopsphere.com",
        password: userPassword,
        role: "user"
      },
      {
        name: "Bob Johnson",
        email: "bob@shopsphere.com",
        password: userPassword,
        role: "user"
      },
      {
        name: "Alice Brown",
        email: "alice@shopsphere.com",
        password: userPassword,
        role: "user"
      }
    ]);
    console.log(`✅ Created ${users.length} users (including 1 Admin)`);

    const admin = users[0];
    const john = users[1];
    const jane = users[2];
    const bob = users[3];
    const alice = users[4];

    // Create Sample Orders
    console.log("📦 Seeding completed orders...");
    const orders = [
      // John's orders
      { userId: john._id, product: "MacBook Pro M3", amount: 159900, status: "completed", month: "Jan" },
      { userId: john._id, product: "iPhone 15 Pro", amount: 129900, status: "completed", month: "Feb" },
      { userId: john._id, product: "USB-C Adapter", amount: 1900, status: "completed", month: "Mar" },
      { userId: john._id, product: "Leather Case", amount: 4900, status: "completed", month: "Jul" },
      
      // Jane's orders (High Spender)
      { userId: jane._id, product: "iPad Pro 12.9", amount: 99900, status: "completed", month: "Jan" },
      { userId: jane._id, product: "Apple Watch Ultra", amount: 89900, status: "completed", month: "May" },
      { userId: jane._id, product: "AirPods Max", amount: 59900, status: "completed", month: "May" },
      { userId: jane._id, product: "Magic Keyboard", amount: 29900, status: "completed", month: "Aug" },
      { userId: jane._id, product: "iPhone 15 Plus", amount: 89900, status: "completed", month: "Nov" },
      
      // Bob's orders
      { userId: bob._id, product: "Dell XPS 15", amount: 145000, status: "completed", month: "Mar" },
      { userId: bob._id, product: "Mechanical Keyboard", amount: 12000, status: "completed", month: "Apr" },
      { userId: bob._id, product: "Gaming Mouse", amount: 6500, status: "completed", month: "Jun" },
      { userId: bob._id, product: "27\" 4K Monitor", amount: 32000, status: "completed", month: "Sep" },
      { userId: bob._id, product: "Noise Cancelling Headphones", amount: 25000, status: "completed", month: "Dec" },

      // Alice's orders
      { userId: alice._id, product: "Sony WH-1000XM5", amount: 29990, status: "completed", month: "Feb" },
      { userId: alice._id, product: "Kindle Paperwhite", amount: 14999, status: "completed", month: "Jun" },
      { userId: alice._id, product: "Standing Desk", amount: 45000, status: "completed", month: "Oct" },
      { userId: alice._id, product: "Ergonomic Chair", amount: 35000, status: "completed", month: "Nov" },
      
      // Admin also gets a few orders for testing
      { userId: admin._id, product: "Office Coffee Maker", amount: 18500, status: "completed", month: "Apr" },
      { userId: admin._id, product: "Whiteboard Set", amount: 3200, status: "completed", month: "Aug" }
    ];

    await Order.insertMany(orders);
    console.log(`✅ Seeded ${orders.length} completed orders across months`);

    console.log("🎉 Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedData();
