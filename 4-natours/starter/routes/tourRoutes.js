const express = require('express');
const tourController = require('./../controllers/tourController');

const router = express.Router();

// Handle data check middleware outside of route handlers, so they are only concerned with CRUD
router.param('id', tourController.checkID);

// Once a request is made to one of these routes, the request will enter the middleware stack, and when the route matches, request will happen
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;