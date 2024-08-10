const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home.controller');


router.get('/', homeController.getAllBooks);
router.get('/books/:id', homeController.getBookDetails);

module.exports = router;
