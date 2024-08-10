const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');
const upload = require('../config/multer');

router.get('/', bookController.getAllBooks);

router.get('/add', bookController.showAddForm);
router.post('/add', upload.single('image'), bookController.createBook);

router.get('/edit/:id', bookController.showEditForm);
router.post('/edit/:id', upload.single('image'), bookController.editBook);

router.post('/delete/:id', bookController.deleteBook);

module.exports = router;
