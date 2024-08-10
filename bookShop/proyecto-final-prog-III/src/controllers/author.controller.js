const Author = require('../models/author.model');
const Book = require('../models/book.model');
const sequelize = require('../config/database');


exports.getAuthors = async (req, res) => {
    try {
        const authors = await Author.findAll({
            include: {
                model: Book,
                as: 'books',
                attributes: ['id']
            }
        });
        const authorWithBookCount = authors.map(authors => ({
            ...authors.toJSON(),
            bookCount: authors.books.length, 
        }));
        res.render('authors', { authors: authorWithBookCount });
    } catch (err) {
        console.error('Error fetching authors:', err);
        res.status(500).json({ error: 'Error fetching authors' });
    }
};

// Mostrar formulario para agregar un autor
exports.showAddForm = (req, res) => {
    res.render('addAuthor');
};


exports.addAuthor = async (req, res) => {
    const { name, email } = req.body;

    try {
        const newAuthor = await Author.create({ name, email });
        res.redirect('/authors');
    } catch (err) {
        console.error('Error adding author:', err);
        res.status(500).json({ error: 'Error adding author' });
    }
};

exports.deleteAuthor = async (req, res) => {
    const { id } = req.params;

    try {
        await Author.destroy({ where: { id } });
        res.redirect('/authors');
    } catch (err) {
        console.error('Error deleting author:', err);
        res.status(500).json({ error: 'Error deleting author' });
    }
};


// Mostrar el formulario de edición
exports.showEditForm = async (req, res) => {
    const { id } = req.params;
    try {
        const author = await Author.findByPk(id);
        if (author) {
            res.render('author/editAuthor', { author });
        } else {
            res.status(404).send('Author not found');
        }
    } catch (err) {
        console.error('Error fetching author:', err);
        res.status(500).json({ error: 'Error fetching author' });
    }
};

// Actualizar un autor
exports.updateAuthor = async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    try {
        const author = await Author.findByPk(id);
        if (author) {
            author.name = name;
            author.email = email;
            await author.save();
            res.redirect('/authors');
        } else {
            res.status(404).send('Author not found');
        }
    } catch (err) {
        console.error('Error updating author:', err);
        res.status(500).json({ error: 'Error updating author' });
    }
};

