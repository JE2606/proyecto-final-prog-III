const { Publisher, Book } = require('../models/index.model');
const sequelize = require('../config/database');

// Obtener todos los editores (publishers)
exports.getPublisher = async (req, res) => {
    try {
        const publishers = await Publisher.findAll({
            include: {
                model: Book,
                as: 'books',
                attributes: ['id']
            }
        });
        const publisherWithBookCount = publishers.map(publishers => ({
            ...publishers.toJSON(),
            bookCount: publishers.books.length, 
        }));
        res.render('publishers', { publishers: publisherWithBookCount });
    } catch (err) {
        console.error('Error: ', err);
        res.status(500).send('Internal Server Error');
    }
};


exports.getAddPublisherForm = (req, res) => {
    res.render('addPublisher');
};

// Crear un nuevo editor (publisher)
exports.createPublisher = async (req, res) => {
    const { name, telephone, country } = req.body;
    try {
        await Publisher.create({ name, telephone, country }); // Crea un nuevo editor en la base de datos
        res.redirect('/publishers'); // Redirige a la lista de editores
    } catch (err) {
        console.error('Error creating publisher:', err);
        res.status(500).send('Internal Server Error');
    }
};

exports.getEditPublisher = async (req, res) => {
    try {
        const publisher = await Publisher.findByPk(req.params.id);

        if (!publisher) {
            return res.status(404).send('Publisher not found');
        }

        res.render('editPublisher', { publisher });
    } catch (error) {
        console.error('Error fetching publisher:', error);
        res.status(500).send('Internal Server Error');
    }
};
exports.postEditPublisher = async (req, res) => {
    const { id } = req.params;
    const { name, telephone, country } = req.body;

    try {
        const publisher = await Publisher.findByPk(id);

        if (!publisher) {
            res.status(404).send('Publisher not found');
            return;
        }

        // Actualiza los datos del editor
        publisher.name = name;
        publisher.telephone = telephone;
        publisher.country = country;

        await publisher.save();

        res.redirect('/publishers'); // Redirige a la lista de editores después de actualizar
    } catch (error) {
        console.error('Error updating Publisher:', error);
        res.status(500).send('Internal Server Error');
    }
};
exports.deletePublisher = async (req, res) => {
    const { id } = req.params;
    try {
        const publisher = await Publisher.findByPk(id);

        if (!publisher) {
            return res.status(404).send('Publisher not found');
        }

        await publisher.destroy(); // Elimina el editor de la base de datos

        res.redirect('/publishers'); // Redirige a la lista de editores después de eliminar
    } catch (error) {
        console.error('Error deleting publisher:', error);
        res.status(500).send('Internal Server Error');
    }
};