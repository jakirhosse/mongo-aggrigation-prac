// limit   ei work ////////////

db.students.aggregate([{ $limit: 3 }]);

// skip//////////

db.books.aggregate([{ $skip: 2 }]);

//       1 2 data bad diye amke porer gulo provide korbe ///
