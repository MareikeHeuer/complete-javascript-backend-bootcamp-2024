const mongoose = require('mongoose');
const slugify = require('slugify');

// mongoose.Schema used to specify a schema for our data
// First object is scheme dfinition
// Second object for options
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      // This will ensure the name is unique
      unique: true,
      trim: true,
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group site'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have acover image'],
    },
    // An arry inside which we have strings
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      // Select hides the createdAt field in the results
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    // This will make virtual properties part of the output in the database
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual property will be created each time we get data from DB, so we need to chain it here
// Since Virtual Property is technically not part of the database, cant perform DB queries on them
// Use Virtual Properties for Business Logic
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create() , .insertMany does not trigger the middleware
// This means we can make changes to the data before save or create happens
tourSchema.pre('save', function (next) {
  // This points to current document that is being processed, hence the name document middleware
  console.log(this);
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', function (next) {
//   console.log('Will save document...');
//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
// This keyword now points to current query, not the current document
// Regex all strings that start with find
tourSchema.pre(/^find/, function (next) {
  // tourSchema.pre('find', function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

// tourSchema.pre('findOne', function (next) {
//   this.find({ secretTour: { $ne: true } });
//   next();
// });

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  // docs is all documents returned by search query
  next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  // this points to the current aggregation object
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

// Convention to ALWAYS use capital letter for model and variable names
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
