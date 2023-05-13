//Build Query

//filter query string
// 1A) Filtering
// const queryObj = { ...req.query }; //creating a shallow copy of an object
// const excludedFields = ['page', 'sort', 'limit', 'fields'];
// excludedFields.forEach((item) => delete queryObj[item]); //deleting items from object

// // 1B) Advanced filtering
// let queryStr = JSON.stringify(queryObj);
// queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`); //using regex to change the query string. \b = matches exact string
// console.log(JSON.parse(queryStr));

//{ difficulty: 'easy', duration: { $gte: 5 }} Mongo Query
//{ duration: { gte: '5' } } Express Query
// gte, gt, lte, lt,

// let query = Tour.find(JSON.parse(queryStr));

// 2) Sorting

// if (req.query.sort) {
//   const sortBy = req.query.sort.split(',').join(' ');
//   query = query.sort(sortBy);
// } else {
//   query = query.sort('-createdAt');
// }

// 3) Field Limiting

// if (req.query.fields) {
//   const fields = req.query.fields.split(',').join(' ');
//   query = query.select(fields); //projecting
// } else {
//   query = query.select('-__v');
// }

// 4) Pagination

// tours?page=2&limit=10, page 1, 11-20, page 2, 21-30, page 3
// const page = req.query.page * 1 || 1;
// const limit = req.query.limit * 1 || 100;
// const skip = (page - 1) * limit;

// query = query.skip(skip).limit(limit);

// if (req.query.page) {
//   const numTours = await Tour.countDocuments();
//   if (skip >= numTours) throw new Error('This page does not exist.');
// }

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkID = (req, res, next, value) => {
//   //params middleware
//   console.log(`Tour ID is ${value}`);
//   const id = req.params.id * 1;
//   if (id > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid Id',
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Required Information Not Found',
//     });
//   }
//   next();
// };
