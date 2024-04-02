const mongoose = require('mongoose');

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

// Convention to ALWAYS use capital letter for model and variable names
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
