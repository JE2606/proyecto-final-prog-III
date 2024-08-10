const express = require('express');
const router = express.Router();
const authorController = require('../controllers/author.controller');

// Rutas para la gestión de autores
router.get('/', authorController.getAuthors); // Obtener todos los autores

router.get('/add', authorController.showAddForm);
router.post('/add', authorController.addAuthor); 

router.get('/edit/:id', authorController.showEditForm);
router.post('/edit/:id', authorController.updateAuthor);

router.post('/delete/:id', authorController.deleteAuthor);

module.exports = router;
