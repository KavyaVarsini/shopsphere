const express = require("express");
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();
const mongoose = require("mongoose");

/**
 * GET /analytics/revenue
 * Total revenue from completed orders
 */
router.get("/revenue", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await Order.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" }
        }
      }
    ]);

    res.json({
      totalRevenue: result[0]?.totalRevenue || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /analytics/monthly-sales
 * Monthly sales report
 */
router.get("/monthly-sales", authMiddleware, async (req, res) => {
  try {
    const sales = await Order.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: "$month",
          totalSales: { $sum: "$amount" }
        }
      }
    ]);

    const months = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    const result = months.map(m => {
      const found = sales.find(s => s._id === m);
      return {
        month: m,
        totalSales: found ? found.totalSales : 0
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



/**
 * GET /analytics/top-customers
 * Top 5 customers by total spending
 */
router.get("/top-customers", authMiddleware, async (req, res) => {
  try {
    const customers = await Order.aggregate([
      { $match: { status: "completed" } },

      // 🔥 FORCE userId → ObjectId
      {
        $addFields: {
          userObjId: {
            $cond: [
              { $eq: [{ $type: "$userId" }, "objectId"] },
              "$userId",
              { $toObjectId: "$userId" }
            ]
          }
        }
      },

      {
        $group: {
          _id: "$userObjId",
          totalSpent: { $sum: "$amount" }
        }
      },

      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },

      { $unwind: "$user" },

      {
        $project: {
          _id: 0,
          name: "$user.name",
          totalSpent: 1
        }
      },

      { $sort: { totalSpent: -1 } }
    ]);

    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




module.exports = router;
