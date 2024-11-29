const pipeline = [
  {
    $group: {
      _id: "$product", // প্রোডাক্ট অনুযায়ী গ্রুপ
      totalSales: { $sum: "$quantity" }, // মোট বিক্রয়
      orderCount: { $sum: 1 }, // মোট অর্ডারের সংখ্যা
    },
  },
];

// output //
[
  { _id: "Laptop", totalSales: 6, orderCount: 3 },
  { _id: "Smartphone", totalSales: 7, orderCount: 2 },
];

const pipeline = [
  {
    $group: {
      _id: { $month: "$date" }, // মাস অনুযায়ী গ্রুপ
      totalIncome: { $sum: "$income" }, // মোট আয় যোগ
    },
  },
  {
    $sort: { _id: 1 }, // মাস অনুযায়ী সাজানো
  },
];

const pipeline = [
  {
    $group: {
      _id: "$department", // বিভাগ অনুযায়ী গ্রুপ
      employees: { $addToSet: "$employeeName" }, // অনন্য কর্মচারীদের তালিকা
    },
  },
];

const pipeline = [
  {
    $group: {
      _id: "$customer",
      totalAmount: { $sum: "$amount" },
      averageAmount: { $avg: "$amount" },
      minPurchase: { $min: "$amount" },
      maxPurchase: { $max: "$amount" },
    },
  },
];

const results = await collection.aggregate(pipeline).toArray();
res.status(200).json(results);

const pipeline = [
  {
    $group: {
      _id: {
        customer: "$customer", // গ্রুপিং কাস্টমার অনুযায়ী
        month: { $month: "$date" }, // মাস অনুযায়ী গ্রুপিং
      },
      totalAmount: { $sum: "$amount" }, // amount ফিল্ডের যোগফল
    },
  },
  {
    $sort: { "_id.customer": 1, "_id.month": 1 }, // কাস্টমার এবং মাস অনুযায়ী সাজানো
  },
];

// Aggregation Pipeline
const pipeline = [
  {
    $group: {
      _id: {
        customer: "$customer", // গ্রুপিং কাস্টমার অনুযায়ী
        month: { $month: "$date" }, // মাস অনুযায়ী গ্রুপিং
      },
      maxPurchase: { $max: "$amount" }, // সর্বোচ্চ ক্রয় নির্ধারণ
      averageAmount: { $avg: "$amount" }, // গড় নির্ধারণ
    },
  },
  {
    $sort: { "_id.customer": 1, "_id.month": 0 }, // কাস্টমার এবং মাস অনুযায়ী সাজানো
  },
];

// ডেটা রিটার্ন
const results = await collection.aggregate(pipeline).toArray();
