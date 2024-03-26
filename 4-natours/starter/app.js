const fs = require('fs');
const express = require('express');

// Create variable called app (standard) and assign the result of calling express
// This will add a bunch of methods to our app variable
const app = express();

// Read data before route handler since callack function in route handler will run in event loop and shouldn't have blocking code there
// JSON.parse converts json to array of js objects
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Define route
// Call app with request method and pass url as argument and callback function
// ALWAYS specify API version
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    // Data is envelope for our data. We specify it and the data will then intern have an object which contains the response we want to send
    data: { tours },
  });
});

// Start up server
// Add port as argument and a callback function, which will run when the server starts listening
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
