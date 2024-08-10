const Book = require('../models/book.model');
const Category = require('../models/category.model');
const Author = require('../models/author.model');
const Publisher = require('../models/publisher.model');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.findAll({
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

        res.render('books', { books });
    } catch (err) {
        console.error('Error retrieving books:', err);
        res.status(500).json({ error: 'Error retrieving books' });
    }
};

// Mostrar el formulario para añadir un libro nuevo
exports.showAddForm = async (req, res) => {
    try {
        const categories = await Category.findAll();
        const authors = await Author.findAll();
        const publishers = await Publisher.findAll();

        if (categories.length === 0 || authors.length === 0 || publishers.length === 0) {
            return res.render('book/addBook', { error: 'No categories, authors, or publishers found. Please create them first.' });
        }

        res.render('book/addBook', { categories, authors, publishers });
    } catch (err) {
        console.error('Error fetching categories, authors, or publishers:', err);
        res.status(500).json({ error: 'Error fetching categories, authors, or publishers' });
    }
};

exports.createBook = async (req, res) => {
    const { title, publicationYear, categoryId, authorId, publisherId } = req.body;
    const image = req.file;

    try {
        if (!image) {
            return res.status(400).json({ error: 'Book cover image is required' });
        }

        // Construir la ruta completa de la imagen
        const imagePath = `/uploads/${image.filename}`;

        const newBook = await Book.create({
            title,
            image: imagePath, // Usar imagePath para guardar la ruta en la base de datos
            publicationYear,
            categoryId,
            authorId,
            publisherId
        });

        const author = await Author.findByPk(authorId);
        if (author) {
            sendEmailToAuthor(author.email, newBook.title);
        }

        res.redirect('/books');
    } catch (err) {
        console.error('Error adding book:', err);
        res.status(500).json({ error: 'Error adding book' });
    }
};


// Función para enviar correo al autor
function sendEmailToAuthor(email, bookTitle) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'hjuane963@gmail.com',
            pass: 'hvem flob njvc grsm'
        }
    });

    const mailOptions = {
        from: 'hjuane963@gmail.com',
        to: email,
        subject: 'New Book Published',
        text: `Dear author,\n\nA new book titled "${bookTitle}" has been published. Congratulations!`
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('Error sending email:', err);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

exports.deleteBook = async (req, res) => {
    const { id } = req.params;
    try {
        const book = await Book.findByPk(id);

        if (!book) {
            return res.status(404).send('Book not found');
        }

        await book.destroy();

        res.redirect('/books'); 
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.showEditForm = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findByPk(id);
        const categories = await Category.findAll();
        const authors = await Author.findAll();
        const publishers = await Publisher.findAll();

        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        res.render('book/editBook', { book, categories, authors, publishers });
    } catch (err) {
        console.error('Error fetching book details:', err);
        res.status(500).json({ error: 'Error fetching book details' });
    }
};

// Procesar la edición del libro
exports.editBook = async (req, res) => {
    const { id } = req.params;
    const { title, publicationYear, categoryId, authorId, publisherId } = req.body;
    const image = req.file;

    try {
        let updatedFields = {
            title,
            publicationYear,
            categoryId,
            authorId,
            publisherId
        };

        // Actualizar la imagen si se proporcionó una nueva
        if (image) {
            updatedFields.image = `/uploads/${image.filename}`;
        }

        const book = await Book.findByPk(id);

        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        await book.update(updatedFields);

        res.redirect('/books');
    } catch (err) {
        console.error('Error editing book:', err);
        res.status(500).json({ error: 'Error editing book' });
    }
};