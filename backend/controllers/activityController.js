// ---------------------------------------------------------
// Activity Controller
// ---------------------------------------------------------

const Activity = require('../models/Activity');

// ---------------------------------------------------------
// GET /api/trips/:tripId/activities
// ---------------------------------------------------------
// Returns all activities for the given trip, grouped by date.
//
// Response shape:
// {
//   "tripId": 42,
//   "totalActivities": 12,
//   "totalEstimatedCost": 345.50,
//   "dates": [
//     {
//       "date": "2026-09-15",
//       "activities": [ { id, tripStopId, tripStopName, name, ... }, ... ]
//     },
//     ...
//   ]
// }
// ---------------------------------------------------------
exports.getActivitiesByTrip = async (req, res) => {
    try {
        const { tripId } = req.params;

        if (!tripId || isNaN(Number(tripId))) {
            return res.status(400).json({ error: 'A valid tripId is required.' });
        }

        // The model already orders rows by date ➜ orderIndex ➜ startTime
        const rows = await Activity.findAllByTripGroupedByDate(tripId);

        // Group flat rows into a { date → activities[] } map
        const dateMap = new Map();
        let totalEstimatedCost = 0;

        for (const row of rows) {
            // MySQL DATE columns come back as "YYYY-MM-DD" strings via mysql2
            const dateKey = row.date instanceof Date
                ? row.date.toISOString().slice(0, 10)
                : String(row.date);

            if (!dateMap.has(dateKey)) {
                dateMap.set(dateKey, []);
            }
            dateMap.get(dateKey).push({
                id:             row.id,
                tripStopId:     row.tripStopId,
                tripStopName:   row.tripStopName,
                name:           row.name,
                startTime:      row.startTime,
                endTime:        row.endTime,
                estimatedCost:  parseFloat(row.estimatedCost) || 0,
                notes:          row.notes,
                orderIndex:     row.orderIndex,
                createdAt:      row.createdAt,
                updatedAt:      row.updatedAt,
            });

            totalEstimatedCost += parseFloat(row.estimatedCost) || 0;
        }

        // Convert the Map to an ordered array
        const dates = [];
        for (const [date, activities] of dateMap) {
            dates.push({ date, activities });
        }

        return res.status(200).json({
            tripId: Number(tripId),
            totalActivities: rows.length,
            totalEstimatedCost: Math.round(totalEstimatedCost * 100) / 100,
            dates,
        });
    } catch (err) {
        console.error('[ActivityController] getActivitiesByTrip error:', err);
        return res.status(500).json({ error: 'Failed to fetch activities.' });
    }
};

// ---------------------------------------------------------
// GET /api/tripstops/:tripStopId/activities
// ---------------------------------------------------------
exports.getActivitiesByTripStop = async (req, res) => {
    try {
        const { tripStopId } = req.params;

        if (!tripStopId || isNaN(Number(tripStopId))) {
            return res.status(400).json({ error: 'A valid tripStopId is required.' });
        }

        const activities = await Activity.findAllByTripStop(tripStopId);
        return res.status(200).json({ tripStopId: Number(tripStopId), activities });
    } catch (err) {
        console.error('[ActivityController] getActivitiesByTripStop error:', err);
        return res.status(500).json({ error: 'Failed to fetch activities.' });
    }
};

// ---------------------------------------------------------
// POST /api/tripstops/:tripStopId/activities
// ---------------------------------------------------------
exports.createActivity = async (req, res) => {
    try {
        const { tripStopId } = req.params;
        const { name, date, startTime, endTime, estimatedCost, notes, orderIndex } = req.body;

        if (!name || !date) {
            return res.status(400).json({ error: 'name and date are required.' });
        }

        const activity = await Activity.create({
            tripStopId: Number(tripStopId),
            name,
            date,
            startTime,
            endTime,
            estimatedCost,
            notes,
            orderIndex,
        });

        return res.status(201).json(activity);
    } catch (err) {
        console.error('[ActivityController] createActivity error:', err);
        return res.status(500).json({ error: 'Failed to create activity.' });
    }
};

// ---------------------------------------------------------
// PUT /api/activities/:id
// ---------------------------------------------------------
exports.updateActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Activity.update(id, req.body);

        if (!updated) {
            return res.status(404).json({ error: 'Activity not found.' });
        }

        return res.status(200).json(updated);
    } catch (err) {
        console.error('[ActivityController] updateActivity error:', err);
        return res.status(500).json({ error: 'Failed to update activity.' });
    }
};

// ---------------------------------------------------------
// DELETE /api/activities/:id
// ---------------------------------------------------------
exports.deleteActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Activity.delete(id);

        if (!deleted) {
            return res.status(404).json({ error: 'Activity not found.' });
        }

        return res.status(200).json({ message: 'Activity deleted.' });
    } catch (err) {
        console.error('[ActivityController] deleteActivity error:', err);
        return res.status(500).json({ error: 'Failed to delete activity.' });
    }
};

// ---------------------------------------------------------
// PATCH /api/activities/reorder
// ---------------------------------------------------------
// Body: { items: [{ id: 1, orderIndex: 0 }, { id: 2, orderIndex: 1 }, ...] }
// ---------------------------------------------------------
exports.reorderActivities = async (req, res) => {
    try {
        const { items } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'items array is required.' });
        }

        await Activity.bulkUpdateOrder(items);
        return res.status(200).json({ message: 'Order updated.' });
    } catch (err) {
        console.error('[ActivityController] reorderActivities error:', err);
        return res.status(500).json({ error: 'Failed to reorder activities.' });
    }
};
