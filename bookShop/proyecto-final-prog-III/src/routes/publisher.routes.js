const express = require('express');
const router = express.Router();
const publisherController = require('../controllers/publisher.controller');

// Ruta para obtener todos los editores (publishers)
router.get('/', publisherController.getPublisher);

// Ruta para mostrar el formulario de añadir editor (publisher)
router.get('/add', publisherController.getAddPublisherForm);


router.post('/add', publisherController.createPublisher);

router.get('/edit/:id', publisherController.getEditPublisher);
router.post('/edit/:id', publisherController.postEditPublisher);

router.post('/delete/:id', publisherController.deletePublisher);

module.exports = router;
