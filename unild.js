// MongoDB-এর $unwind অপারেটর অ্যাগ্রিগেশন পাইপলাইনে ব্যবহার করা হয় অ্যারে ফিল্ডকে একাধিক ডকুমেন্টে "flatten" করতে। সহজ কথায়, কোনো ডকুমেন্টের অ্যারে ফিল্ডে একাধিক উপাদান থাকলে $unwind সেই উপাদানগুলোকে আলাদা আলাদা ডকুমেন্ট হিসেবে ভেঙে দেয়।

const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 3000;

// MongoDB Connection URL and Database Name
const MONGO_URI = "mongodb://localhost:27017";
const DB_NAME = "school";

let db;

// Connect to MongoDB
MongoClient.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((client) => {
    db = client.db(DB_NAME);
    console.log(`Connected to database: ${DB_NAME}`);
  })
  .catch((err) => console.error(err));

// API to get students with flattened subjects
app.get("/students-unwind", async (req, res) => {
  try {
    const students = await db
      .collection("students")
      .aggregate([
        {
          $unwind: { path: "$subjects", includeArrayIndex: "subjectIndex" },
        },
      ])
      .toArray();

    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});




//   how to addfield work

db.students.aggregate([
        {
          $addFields: {
            age: { $add: ["$age", 5] }
          }
        }
      ]);

      
      db.students.aggregate([
        {
          $addFields: {
            result: {
              $cond: { if: { $gte: ["$scores", 50] }, then: "Pass", else: "Fail" }
            }
          }
        }
      ]);

      
      db.students.aggregate([
        {
          $addFields: {
            grade: {
              $cond: { if: { $gte: ["$marks", 80] }, then: "A", else: "B" }
            },
            isEligible: { $gte: ["$marks", 50] }
          }
        }
      ]);
      
      app.get("/students-extended", async (req, res) => {
        try {
          const students = await db.collection("students").aggregate([
            {
              $addFields: {
                averageScore: { $avg: "$scores" },
                status: {
                  $cond: { if: { $gte: [{ $avg: "$scores" }, 50] }, then: "Pass", else: "Fail" }
                }
              }
            }
          ]).toArray();
        }
})      