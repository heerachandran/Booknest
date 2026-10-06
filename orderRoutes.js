const express = require("express");
const router = express.Router();

const Order = require("../models/Order");

// ===============================
// CREATE ORDER
// ===============================
router.post("/", async (req, res) => {
    try {
        console.log("=================================");
        console.log("ORDER REQUEST RECEIVED");
        console.log(req.body);
        console.log("=================================");

        const order = new Order({
            ...req.body,
            orderData: req.body
        });

        const savedOrder = await order.save();

        console.log("ORDER SAVED SUCCESSFULLY");
        console.log("Order ID:", savedOrder._id);

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order: savedOrder
        });

    } catch (error) {
        console.log("ORDER SAVE ERROR:");
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Failed to save order",
            error: error.message
        });
    }
});


// ===============================
// GET ALL ORDERS
// ===============================
router.get("/", async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders: orders
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get orders",
            error: error.message
        });
    }
});


// ===============================
// GET ONE ORDER
// ===============================
router.get("/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            order: order
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get order",
            error: error.message
        });
    }
});


module.exports = router;