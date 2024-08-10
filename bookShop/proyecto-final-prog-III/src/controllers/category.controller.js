const Category = require('../models/category.model');
const Book = require('../models/book.model');
const sequelize = require('../config/database');

// Mostrar todas las categorías
exports.showAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            include: {
                model: Book,
                as: 'books', // Alias para la asociación
                attributes: ['id'],
            }
        });

        const categoriesWithBookCount = categories.map(category => ({
            ...category.toJSON(),
            bookCount: category.books.length,
        }));

        res.render('categories', { categories: categoriesWithBookCount });
    } catch (err) {
        console.error('Error retrieving categories:', err);
        res.status(500).json({ error: 'Error retrieving categories' });
    }
};

exports.showAddForm = (req, res) => {
    res.render('category/addCategory');
};


exports.addCategory = async (req, res) => {
    const { name, description } = req.body;

    try {
        await Category.create({ name, description });
        res.redirect('/categories');
    } catch (err) {
        console.error('Error adding category:', err);
        res.status(500).json({ error: 'Error adding category' });
    }
};

exports.deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        await Category.destroy({ where: { id } });
        res.redirect('/categories');
    } catch (err) {
        console.error('Error deleting Category:', err);
        res.status(500).json({ error: 'Error deleting Category' });
    }
};
exports.showEditForm = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.findByPk(id);
        if (category) {
            res.render('category/editCategory', { category });
        } else {
            res.status(404).send('Category not found');
        }
    } catch (err) {
        console.error('Error fetching category:', err);
        res.status(500).json({ error: 'Error fetching category' });
    }
};

// Editar una categoría existente
exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const category = await Category.findByPk(id);
        if (category) {
            category.name = name;
            category.description = description;
            await category.save();
            res.redirect('/categories');
        } else {
            res.status(404).send('Category not found');
        }
    } catch (err) {
        console.error('Error updating category:', err);
        res.status(500).json({ error: 'Error updating category' });
    }
};