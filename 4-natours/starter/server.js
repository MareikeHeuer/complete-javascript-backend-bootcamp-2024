const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

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
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful!'));

// This will get us the global environment in which the code runs
console.log(app.get('env'));
// Node variables
// console.log(process.env);

// process.env.PORT || 3
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
