const fs = require('fs');
const express = require('express');

// Create variable called app (standard) and assign the result of calling express
// This will add a bunch of methods to our app variable
const app = express();
// This is a middleware, a function that can modify the incoming request data
// It stands in the middle between request and response
app.use(express.json());

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

// : means created a variable
app.get('/api/v1/tours/:id', (req, res) => {
  console.log(req.params);

  // Trick in JS, where we multiply a string that looks like a number with another number, it will automatically convert that string to a number
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  // Check if id is larger than tours array, if yes, then send back a 404 error that we could not find any tour for the given ID
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
  // console.log(req.body);
  // tours is an array ob objects, of which we want the id property of the last one.
  /* Adding 1 to the id ensures that the new ID generated is unique and higher than the IDs of existing objects in the array. 
  It's commonly used in scenarios where each new object needs a unique identifier, and the convention is to increment IDs sequentially.
  */
  const newId = tours[tours.length - 1].id + 1;
  /* Object.assign allows us to create a new object by merging 2 existing ones together */
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});

app.patch('/api/v1/tours/:id', (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
});

app.delete('/api/v1/tours/:id', (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Start up server
// Add port as argument and a callback function, which will run when the server starts listening
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
