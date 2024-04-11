const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  // EXECUTE QUERY
  /* 
    All this chaining works because after calling all these methods we always return this
    this is the obj itself which has access to each of these methods
    We are creating a new obj of the API features class, in there passing a query obj and queryString from Express
    in each of these methods we calla fter another, we are manipulating the query, until the end
    By the end, we await the result of the query so it can come back with all documents that were selected 
    */
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  // query for the document we want to update and then update it
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    // This will return modified document and not the original
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Handler function that will calculate statistics about tour
exports.getTourStats = catchAsync(async (req, res) => {
  // Aggregation pipeline is like using regular query
  // Difference, in aggregation, we can manipulate data in a couple of stages
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }, // greater or equal to
    },
    {
      // allows us to group doocuments together using accumulator, can calculate average
      $group: {
        // null because we want everything in one group
        // _id: null,
        // Can also specify specific fields
        // _id: '$difficulty',
        _id: { $toUpper: '$difficulty' },
        // For each of the documents that will go through this pipeline, 1 will be added to the numcounter
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 }, // 1 for ascending
    },
    /*{
        $match: { _id: { $ne: 'EASY' } }, // All documents that are not EASY
      }, */
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; // 2121
  const plan = await Tour.aggregate([
    {
      // unwind deconstructs an array field from the input document and then oputputs one document for each element in the array
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        // push creates an array
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        // id won't show up if 0
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      // Limits the number of outputs to set value
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});

// Mongoose methods
// const query = await Tour.find()
//   .where('duration')
//   .equals(5)
//   .where('difficulty')
//   .equals('easy');
