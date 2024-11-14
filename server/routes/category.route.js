const express = require('express');
const router = express.Router();
const { 
  createCategory, 
  getCategories, 
  getCategoryByID, 
  updateCategory, 
  deleteCategory 
} = require('../services/category.service');

// Route to create a new category within a specific server
router.post('/create/:serverId', createCategory);

// Route to get all categories for a server
router.get('/:serverId', getCategories);

// Route to get a single category by ID
router.get('/:serverId/:categoryId', getCategoryByID);

// Route to update a category by ID
router.put('/:serverId/:categoryId', updateCategory);

// Route to delete a category by ID
router.delete('/:serverId/:categoryId', deleteCategory);

module.exports = router;