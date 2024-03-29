const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

// This will get us the global environment in which the code runs
console.log(app.get('env'));
// Node variables
// console.log(process.env);

// process.env.PORT || 3
const port = process.env.PORT || 33000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
