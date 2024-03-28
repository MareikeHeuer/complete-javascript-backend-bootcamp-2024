const app = require('./app');

// Good practice to have everything related to express in one file and everything that is related to the server in another main file

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
