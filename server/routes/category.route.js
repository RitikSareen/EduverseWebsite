// Category Routes
const express = require('express');
const router = express.Router();
const { createCategory, getCategories, updateCategory, deleteCategory } = require('../services/category.service');


router.post('/', createCategory);
// Create a new category within a server (requires permission to edit)
router.post('/servers/:serverId/categories', createCategory);

// Get categories within a server (requires permission to view)
router.get('/servers/:serverId/categories', getCategories);

// Update a category (requires permission to edit)
router.put('/categories/:categoryId', updateCategory);

// Delete a category (requires permission to edit)
router.delete('/categories/:categoryId', deleteCategory);

module.exports = router;
