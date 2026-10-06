const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();


// ===============================
// MIDDLEWAREnode
// ===============================

app.use(cors());
app.use(express.json());


// ===============================
// ROUTES
// ===============================

app.use("/api/products", productRoutes);

app.use("/api/orders", orderRoutes);


// ===============================
// TEST ROUTE
// ===============================

app.get("/", (req, res) => {
    res.send("BookNest Backend is running!");
});


// ===============================
// MONGODB CONNECTION
// ===============================

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {

        console.log("=================================");
        console.log("MongoDB connected successfully");
        console.log("=================================");

        app.listen(5000, () => {
            console.log("BookNest server running on:");
            console.log("http://localhost:5000");
        });

    })
    .catch((error) => {

        console.log("=================================");
        console.log("MongoDB connection error");
        console.log(error.message);
        console.log("=================================");

    });