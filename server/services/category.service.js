// Category Service
const Category = require('../models/category');
const Server = require('../models/server');

// Create a new category
const createCategory = async (req, res) => {
  try {
    const newCategory = new Category({
      categoryName: req.body.categoryName,
      server: req.params.serverId,
      channels: [],
    });
    const savedCategory = await newCategory.save();

    const server = await Server.findById(req.params.serverId);
    server.categories.push(savedCategory._id);
    await server.save();

    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ server: req.params.serverId });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update category
const updateCategory = async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(req.params.categoryId, req.body, { new: true });
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.categoryId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
