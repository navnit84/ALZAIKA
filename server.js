// Express.js + MongoDB API for Al Zaika Biryani Orders
// Save as server.js and run with: node server.js

import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = "mongodb://localhost:27017"; // replace with your MongoDB Atlas URI if needed
const client = new MongoClient(uri);
let ordersCollection;

async function connectDB() {
  try {
    await client.connect();
    const db = client.db("alzaika_biryani");
    ordersCollection = db.collection("orders");
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection failed", err);
    process.exit(1);
  }
}
connectDB();

// Root route
app.get("/", (req, res) => {
  res.send("✅ Al Zaika Biryani API with MongoDB is running");
});

// Place order
app.post("/order", async (req, res) => {
  const order = req.body;
  if (!order || !order.id) {
    return res.status(400).json({ error: "Invalid order data" });
  }
  try {
    await ordersCollection.insertOne(order);
    console.log("📦 New Order Saved:", order);
    res.json({ success: true, message: "Order saved successfully", orderId: order.id });
  } catch (err) {
    console.error("❌ Error saving order:", err);
    res.status(500).json({ error: "Failed to save order" });
  }
});

// Get all orders
app.get("/orders", async (req, res) => {
  try {
    const orders = await ordersCollection.find({}).toArray();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Get order by ID
app.get("/order/:id", async (req, res) => {
  try {
    const order = await ordersCollection.findOne({ id: req.params.id });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
