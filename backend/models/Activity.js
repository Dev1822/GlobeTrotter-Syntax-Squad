// ---------------------------------------------------------
// Activity Model
// ---------------------------------------------------------
// Thin data-access layer over the Activities table.
// All methods return Promises (mysql2/promise under the hood).
// ---------------------------------------------------------

const pool = require('../db/connection');

const Activity = {
    // --------------------------------------------------
    // Fetch all activities for a trip, grouped by date
    // --------------------------------------------------
    // JOINs Activities → TripStops to filter by tripId.
    // Results are ordered by date ➜ orderIndex ➜ startTime
    // so the controller can group them in a single pass.
    // --------------------------------------------------
    async findAllByTripGroupedByDate(tripId) {
        const sql = `
            SELECT
                a.id,
                a.tripStopId,
                ts.name   AS tripStopName,
                a.name,
                a.date,
                a.startTime,
                a.endTime,
                a.estimatedCost,
                a.notes,
                a.orderIndex,
                a.createdAt,
                a.updatedAt
            FROM Activities a
            INNER JOIN TripStops ts ON ts.id = a.tripStopId
            WHERE ts.tripId = ?
            ORDER BY a.date ASC, a.orderIndex ASC, a.startTime ASC
        `;

        const [rows] = await pool.execute(sql, [tripId]);
        return rows;
    },

    // --------------------------------------------------
    // Fetch all activities for a specific TripStop
    // --------------------------------------------------
    async findAllByTripStop(tripStopId) {
        const sql = `
            SELECT *
            FROM Activities
            WHERE tripStopId = ?
            ORDER BY date ASC, orderIndex ASC, startTime ASC
        `;

        const [rows] = await pool.execute(sql, [tripStopId]);
        return rows;
    },

    // --------------------------------------------------
    // Fetch a single activity by id
    // --------------------------------------------------
    async findById(id) {
        const sql = `SELECT * FROM Activities WHERE id = ?`;
        const [rows] = await pool.execute(sql, [id]);
        return rows[0] || null;
    },

    // --------------------------------------------------
    // Create a new activity
    // --------------------------------------------------
    async create({ tripStopId, name, date, startTime, endTime, estimatedCost, notes, orderIndex }) {
        const sql = `
            INSERT INTO Activities
                (tripStopId, name, date, startTime, endTime, estimatedCost, notes, orderIndex)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await pool.execute(sql, [
            tripStopId,
            name,
            date,
            startTime  || null,
            endTime    || null,
            estimatedCost ?? 0,
            notes      || null,
            orderIndex ?? 0,
        ]);

        return { id: result.insertId, tripStopId, name, date, startTime, endTime, estimatedCost, notes, orderIndex };
    },

    // --------------------------------------------------
    // Update an existing activity
    // --------------------------------------------------
    async update(id, fields) {
        const allowed = ['name', 'date', 'startTime', 'endTime', 'estimatedCost', 'notes', 'orderIndex'];
        const setClauses = [];
        const values = [];

        for (const key of allowed) {
            if (fields[key] !== undefined) {
                setClauses.push(`\`${key}\` = ?`);
                values.push(fields[key]);
            }
        }

        if (setClauses.length === 0) return Activity.findById(id);

        values.push(id);
        const sql = `UPDATE Activities SET ${setClauses.join(', ')} WHERE id = ?`;
        await pool.execute(sql, values);

        return Activity.findById(id);
    },

    // --------------------------------------------------
    // Delete an activity
    // --------------------------------------------------
    async delete(id) {
        const sql = `DELETE FROM Activities WHERE id = ?`;
        const [result] = await pool.execute(sql, [id]);
        return result.affectedRows > 0;
    },

    // --------------------------------------------------
    // Bulk-update orderIndex (for drag-and-drop reorder)
    // --------------------------------------------------
    // Expects an array of { id, orderIndex } objects.
    // Runs inside a transaction for atomicity.
    // --------------------------------------------------
    async bulkUpdateOrder(items) {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            const sql = `UPDATE Activities SET orderIndex = ? WHERE id = ?`;
            for (const { id, orderIndex } of items) {
                await conn.execute(sql, [orderIndex, id]);
            }

            await conn.commit();
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    },
};

module.exports = Activity;
