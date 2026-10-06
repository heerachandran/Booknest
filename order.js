const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        customerName: {
            type: String
        },

        email: {
            type: String
        },

        phone: {
            type: String
        },

        address: {
            type: String
        },

        items: {
            type: Array,
            default: []
        },

        totalAmount: {
            type: Number,
            default: 0
        },

        paymentMethod: {
            type: String
        },

        status: {
            type: String,
            default: "Pending"
        },

        orderData: {
            type: mongoose.Schema.Types.Mixed
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Order", orderSchema);