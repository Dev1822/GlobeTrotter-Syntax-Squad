const express = require("express");
const router = express.Router();
const tripController = require("../controllers/tripController");
const auth = require("../middleware/auth");

router.post("/", auth, tripController.createTrip);
router.get("/", auth, tripController.getTrips);
router.get("/share/:token", tripController.getSharedTrip);
router.get("/:id", auth, tripController.getTrip);
router.put("/:id", auth, tripController.updateTrip);
router.delete("/:id", auth, tripController.deleteTrip);

router.post("/:id/stops", auth, tripController.addStop);
router.put("/:id/stops/reorder", auth, tripController.reorderStops);
router.post("/stops/:stopId/activities", auth, tripController.addActivity);

router.post("/:id/share", auth, tripController.shareTrip);
router.put("/:id/share-toggle", auth, tripController.toggleTripSharing);

module.exports = router;
