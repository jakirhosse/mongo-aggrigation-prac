// MongoDB তে $lookup অপারেটর ব্যবহারের মাধ্যমে আপনি একটি সংগ্রহ (collection) এর ডেটা অন্য একটি সংগ্রহের সাথে যোগ করতে পারেন, অর্থাৎ আপনি একটি JOIN অপারেশন করতে পারেন। এটি সাধারণত দুটি সংগ্রহের মধ্যে সম্পর্ক তৈরি করতে ব্যবহৃত হয়।

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/advancedLookup", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB!");
});

// Define Schemas
const orderSchema = new mongoose.Schema({
  customer_id: Number,
  total: Number,
});

const customerSchema = new mongoose.Schema({
  _id: Number,
  name: String,
  email: String,
});

// Create Models
const Order = mongoose.model("Order", orderSchema);
const Customer = mongoose.model("Customer", customerSchema);

// Seed Database (Optional)
app.post("/seed", async (req, res) => {
  await Order.deleteMany({});
  await Customer.deleteMany({});

  await Order.insertMany([
    { customer_id: 101, total: 250 },
    { customer_id: 102, total: 450 },
  ]);

  await Customer.insertMany([
    { _id: 101, name: "John Doe", email: "john@example.com" },
    { _id: 102, name: "Jane Smith", email: "jane@example.com" },
  ]);

  res.send("Database Seeded!");
});

// API Route: Get Orders with Customer Details
app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.aggregate([
      {
        $lookup: {
          from: "customers", // Target collection
          localField: "customer_id", // Field in 'orders'
          foreignField: "_id", // Field in 'customers'
          as: "customer_details", // Resultant field
        },
      },
    ]);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/orders-with-products", async (req, res) => {
  try {
    const result = await db
      .collection("orders")
      .aggregate([
        {
          $lookup: {
            from: "products", // Target collection
            localField: "product_id", // Field in 'orders'
            foreignField: "_id", // Field in 'products'
            as: "product_details", // Joined data field
          },
        },
        {
          $addFields: {
            total_price: {
              $multiply: [
                "$quantity",
                { $arrayElemAt: ["$product_details.price", 0] },
              ],
            },
          },
        },
      ])
      .toArray();

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/students-with-results", async (req, res) => {
  try {
    const result = await db
      .collection("students")
      .aggregate([
        {
          $lookup: {
            from: "results", // Target collection
            localField: "_id", // Field in 'students'
            foreignField: "student_id", // Field in 'results'
            as: "exam_results", // Joined data field
          },
        },
        {
          $addFields: {
            average_score: {
              $avg: {
                $map: {
                  input: "$exam_results",
                  as: "result",
                  in: "$$result.score",
                },
              },
            },
          },
        },
      ])
      .toArray();

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
