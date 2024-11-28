app.get("/expired-records", async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Aggregation Pipeline
    const pipeline = [
      {
        $match: {
          $expr: {
            $lt: [
              "$lastUpdated",
              { $subtract: [new Date(), 1000 * 60 * 60 * 24 * 30] }, // 30 দিন পুরনো ডেটা
            ],
          },
        },
      },
    ];

    // Aggregation Pipeline
    const pipeline = [
      {
        $match: {
          $expr: {
            $eq: ["$discountedPrice", { $multiply: ["$originalPrice", 0.8] }],
          },
        },
      },
    ];

    // ডেটাবেস থেকে ডেটা ফিল্টার করা
    const results = await collection.aggregate(pipeline).toArray();

    // রেসপন্স পাঠানো
    res.status(200).json(results);
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).send("An error occurred while fetching records.");
  } finally {
    await client.close();
  }
});

// সার্ভার শুরু করা
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// গণনা বা ডাইনামিক মান যাচাই:
{
  $expr: {
    $gt: ["$salary", { $multiply: ["$hoursWorked", "$hourlyRate"] }];
  }
}

const pipeline4 = [
  {
    $match: {
      $expr: {
        $and: [
          { $gt: ["$quantity", "$stock"] }, // quantity > stock
          { $gt: ["$price", 100] }, // price > 100
        ],
      },
    },
  },
  {
    $addFields: {
      totalValue: { $multiply: ["$quantity", "$price"] }, // totalValue = quantity * price
    },
  },
  {
    $sort: { totalValue: -1 }, // Sort by totalValue in descending order
  },
  {
    $limit: 5, // Return only top 5 results
  },
];

{
  $expr: {
    $and: [{ $gt: ["$price", "$cost"] }, { $lt: ["$discountedPrice", 100] }];
  }
}

const pipeline = [
  {
    $match: {
      $or: [{ city: "Dhaka" }, { age: { $gt: 30 } }],
    },
  },
];

const pipeline1 = [
  {
    $match: {
      $or: [{ price: { $gt: 100 } }, { quantity: { $gt: 50 } }],
    },
  },
];

const pipeline2 = [
  {
    $match: {
      $or: [{ name: { $regex: /Rahim/, $options: "i" } }, { city: "Sylhet" }],
    },
  },
];

const pipelin3 = [
  {
    $match: {
      $expr: {
        $eq: [{ $add: ["$price", "$tax"] }, "$totalPrice"],
      },
    },
  },
];

// Aggregation Pipeline
const pipeline = [
  {
    $match: {
      $and: [
        { price: { $gt: 100 } },
        {
          $or: [{ category: "electronics" }, { category: "appliances" }],
        },
        { $not: { discontinued: true } },
      ],
    },
  },
  {
    $sort: { price: -1 },
  },
  {
    $project: {
      name: 1,
      category: 1,
      price: 1,
      discontinued: 1,
    },
  },
];

// ডেটা রিটার্ন
const results = await collection.aggregate(pipeline).toArray();
res.status(200).json(results);
