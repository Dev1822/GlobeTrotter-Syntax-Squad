const { PackingList } = require("../models");

// Preset templates
const TEMPLATES = {
  beach: [
    { name: "Sunscreen", category: "Toiletries" },
    { name: "Swimsuit", category: "Clothing" },
    { name: "Sunglasses", category: "Other" },
    { name: "Beach towel", category: "Other" },
    { name: "Flip flops", category: "Clothing" },
    { name: "Hat / cap", category: "Clothing" },
    { name: "Waterproof phone case", category: "Electronics" },
    { name: "Insect repellent", category: "Toiletries" },
  ],
  business: [
    { name: "Formal shirts", category: "Clothing" },
    { name: "Dress pants / skirts", category: "Clothing" },
    { name: "Laptop & charger", category: "Electronics" },
    { name: "Business cards", category: "Documents" },
    { name: "Passport / ID", category: "Documents" },
    { name: "Power bank", category: "Electronics" },
    { name: "Notebook & pen", category: "Other" },
    { name: "Toiletry bag", category: "Toiletries" },
  ],
  camping: [
    { name: "Tent", category: "Other" },
    { name: "Sleeping bag", category: "Other" },
    { name: "Flashlight / headlamp", category: "Electronics" },
    { name: "First aid kit", category: "Medicine" },
    { name: "Water bottle", category: "Other" },
    { name: "Trail shoes", category: "Clothing" },
    { name: "Insect repellent", category: "Toiletries" },
    { name: "Rain jacket", category: "Clothing" },
  ],
};

// Helper for generating item IDs since Sequelize JSON doesn't auto-generate them
const generateItemId = () => Math.random().toString(36).substring(2, 15);

// GET /api/packing/:tripId
exports.getPackingList = async (req, res) => {
  try {
    let list = await PackingList.findOne({
      where: {
        tripId: req.params.tripId,
        userId: req.user.id,
      }
    });
    if (!list) {
      list = await PackingList.create({
        tripId: req.params.tripId,
        userId: req.user.id,
        items: [],
      });
    }
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/packing/:tripId/items  — add a single item
exports.addItem = async (req, res) => {
  try {
    const { name, category } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: "Item name is required" });
    }

    let list = await PackingList.findOne({
      where: { tripId: req.params.tripId, userId: req.user.id }
    });

    if (!list) {
      list = await PackingList.create({
        tripId: req.params.tripId,
        userId: req.user.id,
        items: [],
      });
    }

    const items = list.items || [];
    const duplicate = items.find(
      (item) => item.name.trim().toLowerCase() === name.trim().toLowerCase(),
    );

    if (duplicate) {
      return res.status(400).json({
        message: "Item already exists in the packing list",
      });
    }

    items.push({
      _id: generateItemId(),
      name: name.trim(),
      category: category || "Other",
      packed: false,
    });

    list.items = items;
    await list.save();

    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PATCH /api/packing/:tripId/items/:itemId — toggle packed
exports.toggleItem = async (req, res) => {
  try {
    const list = await PackingList.findOne({
      where: { tripId: req.params.tripId, userId: req.user.id }
    });
    if (!list)
      return res.status(404).json({ message: "Packing list not found" });

    const items = list.items || [];
    const itemIndex = items.findIndex(i => i._id === req.params.itemId || i.id === req.params.itemId);
    
    if (itemIndex === -1) return res.status(404).json({ message: "Item not found" });

    items[itemIndex].packed = !items[itemIndex].packed;
    
    list.items = items;
    list.changed('items', true);
    await list.save();
    
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE /api/packing/:tripId/items/:itemId
exports.deleteItem = async (req, res) => {
  try {
    const list = await PackingList.findOne({
      where: { tripId: req.params.tripId, userId: req.user.id }
    });
    if (!list)
      return res.status(404).json({ message: "Packing list not found" });

    const items = list.items || [];
    const updatedItems = items.filter(i => i._id !== req.params.itemId && i.id !== req.params.itemId);
    
    list.items = updatedItems;
    list.changed('items', true);
    await list.save();
    
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/packing/:tripId/template — apply a preset template
exports.applyTemplate = async (req, res) => {
  try {
    const { template } = req.body;
    const templateItems = TEMPLATES[template];
    if (!templateItems)
      return res.status(400).json({ message: "Invalid template name" });

    let list = await PackingList.findOne({
      where: { tripId: req.params.tripId, userId: req.user.id }
    });

    if (!list) {
      list = await PackingList.create({
        tripId: req.params.tripId,
        userId: req.user.id,
        items: [],
      });
    }

    const items = list.items || [];
    const existingNames = new Set(
      items.map((item) => item.name.trim().toLowerCase()),
    );

    const newItemsToAdd = templateItems
      .filter((item) => !existingNames.has(item.name.trim().toLowerCase()))
      .map((item) => ({
        ...item,
        _id: generateItemId(),
        packed: false,
      }));

    items.push(...newItemsToAdd);
    
    list.items = items;
    list.changed('items', true);
    await list.save();

    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE /api/packing/:tripId/items — clear all items
exports.clearAll = async (req, res) => {
  try {
    const list = await PackingList.findOne({
      where: { tripId: req.params.tripId, userId: req.user.id }
    });
    
    if (list) {
      list.items = [];
      list.changed('items', true);
      await list.save();
    }
    
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
