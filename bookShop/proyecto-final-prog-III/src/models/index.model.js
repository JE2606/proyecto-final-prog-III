const sequelize = require('../config/database');
const Book = require('./book.model');
const Author = require('./author.model');
const Category = require('./category.model');
const Publisher = require('./publisher.model');

// Definir asociaciones aquí
Author.hasMany(Book, { foreignKey: 'authorId', as: 'books' });
Category.hasMany(Book, { foreignKey: 'categoryId', as: 'books' });
Publisher.hasMany(Book, { foreignKey: 'publisherId', as: 'books' });

Book.belongsTo(Author, { foreignKey: 'authorId', as: 'author' });
Book.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Book.belongsTo(Publisher, { foreignKey: 'publisherId', as: 'publisher' });

sequelize.sync()
    .then(() => {
        console.log('Base de datos sincronizada');
    })
    .catch((error) => {
        console.error('Error al sincronizar la base de datos:', error)
    });

module.exports = {
    Book,
    Author,
    Publisher,
    Category
};
