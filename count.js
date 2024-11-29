db.students.aggregate([{ $count: "total_students" }]);

db.students.aggregate([
  { $group: { _id: "$gender", count: { $sum: 1 } } }, // Count by gender
  { $count: "total_groups" }, // Count total groups
]);

db.students.aggregate([
  { $unwind: "$scores" },
  { $match: { scores: { $gte: 80 } } },
  { $count: "high_scores" },
]);

const express = require("express");
const { MongoClient } = require("mongodb");

let db;

// MongoDB Connection
MongoClient.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((client) => {
    db = client.db(DB_NAME);
    console.log(`Connected to database: ${DB_NAME}`);
  })
  .catch((err) => console.error(err));

// API to count total students
app.get("/count-students", async (req, res) => {
  try {
    const countResult = await db
      .collection("students")
      .aggregate([{ $count: "total_students" }])
      .toArray();

    res.json(countResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to count students above a certain age
app.get("/count-older-students", async (req, res) => {
  try {
    const countResult = await db
      .collection("students")
      .aggregate([
        { $match: { age: { $gte: 30 } } },
        { $count: "students_above_30" },
      ])
      .toArray();

    res.json(countResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
