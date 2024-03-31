const mongoose = require('mongoose');

// mongoose.Schema used to specify a schema for our data
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    // This will ensure the name is unique
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

// Convention to ALWAYS use capital letter for model and variable names
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
