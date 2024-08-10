const { Op } = require('sequelize');
const Book = require('../models/book.model');
const Category = require('../models/category.model');
const Author = require('../models/author.model');
const Publisher = require('../models/publisher.model');

exports.getAllBooks = async (req, res) => {
    try {
        let filter = {};

        // Filtro por categorías seleccionadas
        if (req.query.categories) {
            const categories = Array.isArray(req.query.categories) ? req.query.categories : [req.query.categories];
            filter.categoryId = {
                [Op.in]: categories
            };
        }

        // Búsqueda por título del libro
        if (req.query.search) {
            filter.title = {
                [Op.like]: `%${req.query.search}%`
            };
        }

        const books = await Book.findAll({
            where: filter,
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['name']
                },
                {
                    model: Author,
                    as: 'author',
                    attributes: ['name']
                },
                {
                    model: Publisher,
                    as: 'publisher',
                    attributes: ['name']
                }
            ]
        });

        const categories = await Category.findAll();
        res.render('home', { books, categories });
    } catch (err) {
        console.error('Error retrieving books:', err);
        res.status(500).json({ error: 'Error retrieving books' });
    }
};
exports.getBookDetails = async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id, {
            include: [
                {
                    model: Category,
                    as: 'category'
                },
                {
                    model: Author,
                    as: 'author'
                },
                {
                    model: Publisher,
                    as: 'publisher'
                }
            ]
        });

        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        res.render('detail', { book });
    } catch (err) {
        console.error('Error retrieving book details:', err);
        res.status(500).json({ error: 'Error retrieving book details' });
    }
};