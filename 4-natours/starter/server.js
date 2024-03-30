const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

// To connect to local use mongose.connect(process.env.DATABASE_LOCAL)

// This one here below is for connecting to host
mongoose
  .connect(DB, {
    // Options for dealing with deprecation warnings
    useNewUrlParser: true,
    useCreateIndex: true,
    useFineAndModify: false,
  })
  .then(() => console.log('DB connection successful!'));

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

// This is a document we created using the Tour model
// This is now an instance of the Tour model
const testTour = new Tour({
  name: 'The Park Camper',
  // rating: 4.7,
  price: 997,
});

// This will save it to the tour collection in our database
testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log('ERROR', err);
  });

// This will get us the global environment in which the code runs
console.log(app.get('env'));
// Node variables
// console.log(process.env);

// process.env.PORT || 3
const port = process.env.PORT || 33000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
