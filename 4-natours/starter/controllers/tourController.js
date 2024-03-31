const Tour = require('./../models/tourModel');
const express = require('express');

const app = express();

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    // results: tours.length,
    // // Data is envelope for our data. We specify it and the data will then intern have an object which contains the response we want to send
    // data: { tours },
  });
};

exports.getTour = app.get('/api/v1/tours/:id', (req, res) => {
  console.log(req.params);

  // Trick in JS, where we multiply a string that looks like a number with another number, it will automatically convert that string to a number
  const id = req.params.id * 1;
  // const tour = tours.find((el) => el.id === id);

  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour,
  //   },
  // });
});

exports.createTour = app.post('/api/v1/tours', (req, res) => {
  res.status(201).json({
    status: 'success',
    // data: {
    //   tour: newTour,
    // },
  });
});

exports.updateTour = app.patch('/api/v1/tours/:id', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
});

exports.deleteTour = app.delete('/api/v1/tours/:id', (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
