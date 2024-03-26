const express = require('express');

// Create variable called app (standard) and assign the result of calling express
// This will add a bunch of methods to our app variable
const app = express();

// Define route
// call app with request method and pass url as argument and callback function
app.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: 'Hello from the server side!', app: 'Natours' });
});

app.post('/', (req, res) => {
  res.send('You can post to this endpoint');
});

// Start up server
// Add port as argument and a callback function, which will run when the server starts listening
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
