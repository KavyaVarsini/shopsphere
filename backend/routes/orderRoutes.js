const express = require("express");
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");
const { getIO } = require("../sockets/socket");

const router = express.Router();

/**
 * POST /orders
 * Create new order + emit socket event
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const order = await Order.create({
      ...req.body,
      userId: req.user.id
    });

    // 🔴 Emit real-time event
    const io = getIO();
    io.emit("new-order", order);

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /orders
 * find
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * PUT /orders/update-status
 * updateMany
 */
router.put("/update-status", authMiddleware, async (req, res) => {
  try {
    const result = await Order.updateMany(
      {},
      { $set: { status: req.body.status } }
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * DELETE /orders/delete
 * deleteMany
 */
router.delete("/delete", authMiddleware, async (req, res) => {
  try {
    const result = await Order.deleteMany({ status: "cancelled" });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// BULK INSERT ORDERS (for PDF / dataset)
router.post("/bulk", authMiddleware, async (req, res) => {
  try {
    // req.body MUST be an array
    if (!Array.isArray(req.body)) {
      return res.status(400).json({
        message: "Expected an array of orders"
      });
    }

    const orders = await Order.insertMany(req.body);

    // 🔥 ONE socket event after bulk insert
    req.io.emit("new-order");

    res.status(201).json({
      message: "Bulk orders inserted successfully",
      count: orders.length
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


module.exports = router;
