// Category Service
const Category = require('../models/category');
const Server = require('../models/server');
const TextChannel = require('../models/textChannel');

// Create a new category
const createCategory = async (req, res) => {
  try {
    const serverId = req.params.serverId;
    const { name, allowedRoles } = req.body;

    // Ensure allowedRoles is correctly structured
    if (!allowedRoles || !Array.isArray(allowedRoles)) {
      return res.status(400).json({ message: 'Invalid allowedRoles format' });
    }

    // Create new category
    const newCategory = new Category({
      name,
      allowedRoles: allowedRoles.map(role => ({
        role: role.role,
        read: role.read || false,
        write: role.write || false
      }))
    });
    const savedCategory = await newCategory.save();

    // Add category to server
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
    const categoryId = req.params.categoryId;
    const category = await Category.findById(categoryId).populate('channels');
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update category
const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const updatedData = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      updatedData,
      { new: true } // Return the updated document
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Step 1: Find the category to get the associated channels
    const category = await Category.findById(categoryId).populate('channels');
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Step 2: Delete all channels associated with the category
    const channelIds = category.channels.map((channel) => channel._id);
    await TextChannel.deleteMany({ _id: { $in: channelIds } });

    // Step 3: Delete the category itself
    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    // Step 4: Remove the category from the server's categories array
    await Server.findOneAndUpdate(
      { categories: categoryId },
      { $pull: { categories: categoryId } }
    );

    res.status(200).json({ message: 'Category and its channels deleted successfully' });
  } catch (error) {
    console.error('Error deleting category and its channels:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getCategoryByID,
};
