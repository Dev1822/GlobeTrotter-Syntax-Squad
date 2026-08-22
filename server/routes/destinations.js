const router = require("express").Router();
const { Destination } = require("../models");
const { Op } = require("sequelize");

router.get("/", async (req, res) => {
  try {
    const { city, state, type, zone, search, page, limit } = req.query;
    let where = {};

    if (city) where.city = { [Op.like]: `%${city}%` };
    if (state) where.state = { [Op.like]: `%${state}%` };
    if (zone && zone !== "all" && zone !== "popular") {
      where.zone = { [Op.like]: `%${zone}%` };
    }

    if (search && search.trim()) {
      const q = `%${search.trim()}%`;
      where = {
        ...where,
        [Op.or]: [
          { name: { [Op.like]: q } },
          { city: { [Op.like]: q } },
          { state: { [Op.like]: q } },
          { zone: { [Op.like]: q } }
        ]
      };
    }

    if (page || limit) {
      const currentPage = Math.max(1, parseInt(page, 10) || 1);
      const itemsPerPage = Math.max(1, parseInt(limit, 10) || 8);
      const offset = (currentPage - 1) * itemsPerPage;

      const { count, rows } = await Destination.findAndCountAll({
        where,
        offset,
        limit: itemsPerPage
      });

      return res.json({
        destinations: rows,
        total: count,
        page: currentPage,
        totalPages: Math.ceil(count / itemsPerPage) || 1,
        limit: itemsPerPage
      });
    }

    const data = await Destination.findAll({ where });
    res.json(data);
  } catch (err) {
    console.error("Destinations fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    const trimmedQ = (q || "").trim();
    if (!trimmedQ) return res.json([]);

    const likeQ = `%${trimmedQ}%`;
    const data = await Destination.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: likeQ } },
          { city: { [Op.like]: likeQ } },
          { state: { [Op.like]: likeQ } }
        ]
      },
      limit: 10
    });
    res.json(data);
  } catch (err) {
    console.error("Autocomplete search error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const idOrSlug = req.params.id;
    let data;

    // Check if numeric (ID)
    if (!isNaN(idOrSlug)) {
      data = await Destination.findByPk(idOrSlug);
    }
    
    if (!data) {
      data = await Destination.findOne({
        where: { name: idOrSlug } // Sequelize case-insensitive matches depend on collation, usually true for MySQL
      });
    }

    if (!data) return res.status(404).json({ error: "Destination not found" });
    res.json(data);
  } catch (err) {
    console.error("Destination by ID error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
