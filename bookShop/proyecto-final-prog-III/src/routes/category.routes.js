const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

router.get('/', categoryController.showAllCategories);

router.get('/add', categoryController.showAddForm);
router.post('/add', categoryController.addCategory);

router.post('/delete/:id', categoryController.deleteCategory);

router.get('/edit/:id', categoryController.showEditForm);
router.post('/edit/:id', categoryController.updateCategory);

module.exports = router;
