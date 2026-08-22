// ---------------------------------------------------------
// Activity Routes
// ---------------------------------------------------------

const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/activityController');

// Activities scoped to a Trip (grouped by date)
router.get('/trips/:tripId/activities', ctrl.getActivitiesByTrip);

// Activities scoped to a TripStop
router.get('/tripstops/:tripStopId/activities',  ctrl.getActivitiesByTripStop);
router.post('/tripstops/:tripStopId/activities', ctrl.createActivity);

// Single-activity operations
router.put('/activities/:id',    ctrl.updateActivity);
router.delete('/activities/:id', ctrl.deleteActivity);

// Drag-and-drop reorder
router.patch('/activities/reorder', ctrl.reorderActivities);

module.exports = router;
