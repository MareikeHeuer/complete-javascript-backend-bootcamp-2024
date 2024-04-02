const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

// Handle data check middleware outside of route handlers, so they are only concerned with CRUD
// router.param('id', tourController.checkID);

// Once a request is made to one of these routes, the request will enter the middleware stack, and when the route matches, request will happen

// 127.0.0.1:3000/api/v1/tours?limit=5&sort=-ratingsAverage,price
// Run middleware function which will manipulate incoming query object before executing getAllTours handler
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
