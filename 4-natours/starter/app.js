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

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    // Data is envelope for our data. We specify it and the data will then intern have an object which contains the response we want to send
    data: { tours },
  });
};

const getTour = app.get('/api/v1/tours/:id', (req, res) => {
  console.log(req.params);

  // Trick in JS, where we multiply a string that looks like a number with another number, it will automatically convert that string to a number
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

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

const createTour = app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
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

const updateTour = app.patch('/api/v1/tours/:id', (req, res) => {
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

const deleteTour = app.delete('/api/v1/tours/:id', (req, res) => {
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

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.get('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', updateTour);
// app.get('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

// Start up server
// Add port as argument and a callback function, which will run when the server starts listening
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
