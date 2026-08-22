const { Trip, TripStop, TripActivity, Expense } = require("../models");

exports.getTrips = async (req, res) => {
  try {
    const trips = await Trip.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: TripStop,
          as: 'stops',
          include: [{ model: TripActivity, as: 'activities' }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(trips);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [
        {
          model: TripStop,
          as: 'stops',
          include: [{ model: TripActivity, as: 'activities' }]
        }
      ],
      order: [
        [{ model: TripStop, as: 'stops' }, 'orderIndex', 'ASC'],
        [{ model: TripStop, as: 'stops' }, { model: TripActivity, as: 'activities' }, 'orderIndex', 'ASC']
      ]
    });
    if (!trip) return res.status(404).json({ msg: "Trip not found" });
    res.json(trip);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.createTrip = async (req, res) => {
  try {
    const { name, startDate, endDate, description, stops } = req.body;
    const trip = await Trip.create({
      userId: req.user.id,
      name: name || "New Trip",
      startDate,
      endDate,
      description
    });

    if (stops && stops.length > 0) {
      await Promise.all(stops.map((stop, index) => 
        TripStop.create({
          tripId: trip.id,
          city: stop.city,
          startDate: stop.startDate,
          endDate: stop.endDate,
          orderIndex: index
        })
      ));
    }

    const createdTrip = await Trip.findByPk(trip.id, {
      include: [{ model: TripStop, as: 'stops' }]
    });

    res.json(createdTrip);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!trip) return res.status(404).json({ msg: "Trip not found" });

    await trip.update(req.body);
    res.json(trip);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!trip) return res.status(404).json({ msg: "Trip not found" });

    await trip.destroy();
    res.json({ msg: "Trip removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Add a stop to a trip
exports.addStop = async (req, res) => {
  try {
    const trip = await Trip.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!trip) return res.status(404).json({ msg: "Trip not found" });

    const maxOrder = await TripStop.max('orderIndex', { where: { tripId: trip.id } });
    const orderIndex = maxOrder !== null ? maxOrder + 1 : 0;

    const stopStartDate = (req.body.startDate && req.body.startDate.trim() !== "") ? req.body.startDate : trip.startDate;
    const stopEndDate = (req.body.endDate && req.body.endDate.trim() !== "") ? req.body.endDate : trip.endDate;

    const stop = await TripStop.create({
      tripId: trip.id,
      city: req.body.city,
      startDate: stopStartDate,
      endDate: stopEndDate,
      orderIndex
    });

    res.json(stop);
  } catch (err) {
    console.error("addStop error:", err);
    res.status(500).json({ msg: err.message || "Failed to add stop" });
  }
};

// Reorder stops
exports.reorderStops = async (req, res) => {
  try {
    const { stops } = req.body; // array of { id, orderIndex }
    await Promise.all(stops.map(stop => 
      TripStop.update({ orderIndex: stop.orderIndex }, { where: { id: stop.id } })
    ));
    res.json({ msg: "Stops reordered" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Add activity
exports.addActivity = async (req, res) => {
  try {
    const stop = await TripStop.findByPk(req.params.stopId);
    if (!stop) return res.status(404).json({ msg: "Stop not found" });

    const maxOrder = await TripActivity.max('orderIndex', { where: { stopId: stop.id } });
    const orderIndex = maxOrder !== null ? maxOrder + 1 : 0;

    const activity = await TripActivity.create({
      stopId: stop.id,
      ...req.body,
      orderIndex
    });

    res.json(activity);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
exports.shareTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!trip) return res.status(404).json({ msg: 'Trip not found' });
    trip.shareToken = require('crypto').randomBytes(16).toString('hex');
    trip.shareEnabled = true;
    await trip.save();
    res.json(trip);
  } catch (err) {
    res.status(500).send('Server error');
  }
};
exports.toggleTripSharing = async (req, res) => {
  try {
    const trip = await Trip.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!trip) return res.status(404).json({ msg: 'Trip not found' });
    trip.shareEnabled = req.body.shareEnabled;
    await trip.save();
    res.json(trip);
  } catch (err) {
    res.status(500).send('Server error');
  }
};
exports.getSharedTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({ 
      where: { shareToken: req.params.token, shareEnabled: true },
      include: [ { model: TripStop, as: 'stops', include: [{ model: TripActivity, as: 'activities' }] } ]
    });
    if (!trip) return res.status(404).json({ msg: 'Trip not found or sharing disabled' });
    res.json(trip);
  } catch (err) {
    res.status(500).send('Server error');
  }
};
