const Tour = require('../models/tourModel');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // BUILD QUERY
    // 1.a Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1.b Advanced FIltering

    // {difficulty: 'easy', duration {$gte: 5}}
    // {difficulty: 'easy', duration {gte: 5}}
    // gte, gt, lte, lt
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));

    let query = Tour.find(JSON.parse(queryStr));

    // 2 Sorting
    // 127.0.0.1:3000/api/v1/tours?sort=price
    // 127.0.0.1:3000/api/v1/tours?sort=-price descending order with - infront of query
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      console.log(sortBy);
      query = query.sort(sortBy);
      // sort('price ratingsAverage')
      // 127.0.0.1:3000/api/v1/tours?sort=-price,ratingsAverage
    } else {
      query = query.sort('-createdAt');
    }

    // 3 Field Limiting
    // POSTMAN:127.0.0.1:3000/api/v1/tours?fields=name,duration,difficulty,price
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      // - means excluding, everything except the v field
      query = query.select('-__v');
    }

    // 4 Pagination
    // 127.0.0.1:3000/api/v1/tours?page=2&limit=10
    // 1-10 page 1, 11-20, page 2, 21-30 page 3 etc.
    // Skip: Amount of results that should be skipped before querying data
    // Limit: Amount of results that we want in the query

    // * 1 converts string to number
    // || 1 be default page number 1
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    // page=2&limit=10
    // 1-10 page 1, 11-20, page 2, 21-30 page 3 etc.
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      // If num of documents we skip is greater or equal than those that exist, then page doesnt exist
      // Throwing error inside try block will automatically end, and move to the catch block
      if (skip >= numTours) throw new Error('This page does not exist');
    }

    // EXECUTE QUERY
    const tours = await query;

    // {difficulty: 'easy', duration {$gte: 5}} --> In Postman: 127.0.0.1:3000/api/v1/tours?duration[gte]=5&difficulty=easy

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    // query for the document we want to update and then update it
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      // This will return modified document and not the original
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

// Mongoose methods
// const query = await Tour.find()
//   .where('duration')
//   .equals(5)
//   .where('difficulty')
//   .equals('easy');
