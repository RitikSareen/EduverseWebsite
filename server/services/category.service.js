// Category Service
const Category = require('../models/category');
const Server = require('../models/server');

// Create a new category
const createCategory = async (req, res) => {
  try {
    const serverId = req.params.serverId; // Get the server ID from the URL parameters
    const { name, allowedRoles } = req.body; // Extract name and allowedRoles from the request body

    // Step 1: Create the new category
    const newCategory = new Category({
      name,
      allowedRoles
    });
    const savedCategory = await newCategory.save();

    // Step 2: Update the server's categories array to include the new category
    await Server.findByIdAndUpdate(
      serverId,
      { $push: { categories: savedCategory._id } },
      { new: true }
    );

    res.status(201).json(savedCategory);
  } catch (error) {
    console.error('Error creating category:', error);
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

const getCategoryByID = async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
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
  getCategoryByID
};
