try {
  const students = await Student.aggregate([
    {
      $sort: {
        marks: -1, // Descending by marks
        age: 1, // Ascending by age
      },
    },
  ]);
  res.json(students);
} catch (error) {
  res.status(500).json({ message: error.message });
}

// MongoDB $project/////////////
// 1. নির্দিষ্ট ফিল্ড বাছাই করা বা বাদ দেওয়া///

db.students.aggregate([
  {
    $project: {
      name: 1, // name ফিল্ড রাখুন
      marks: 1, // marks ফিল্ড রাখুন
      _id: 0, // _id ফিল্ড বাদ দিন
    },
  },
]);

// নতুন ফিল্ড তৈরি করা///

db.students.aggregate([
  {
    $project: {
      name: 1,
      marks: 1,
      isPass: { $gte: ["$marks", 50] }, // নতুন ফিল্ড: marks ৫০ বা তার বেশি হলে isPass true হবে
    },
  },
]);

// 3. বিদ্যমান ফিল্ডকে রূপান্তর করা//

db.students.aggregate([
  {
    $project: {
      fullName: "$name", // name ফিল্ডের নাম পরিবর্তন করে fullName রাখা
      age: 1,
      marks: 1,
    },
  },
]);

//       4. গণনা বা ডেটা প্রসেস করা

db.students.aggregate([
  {
    $project: {
      name: 1,
      marks: 1,
      totalMarks: { $multiply: ["$marks", 2] }, // marks এর দ্বিগুণ নির্ধারণ
      ageCategory: {
        $cond: {
          if: { $gte: ["$age", 21] }, // বয়স ২১ বা তার বেশি হলে "Adult"
          then: "Adult",
          else: "Youth", // নাহলে "Youth"
        },
      },
    },
  },
]);
