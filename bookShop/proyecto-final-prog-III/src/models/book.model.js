const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Author = require('./author.model');
const Category = require('./category.model');
const Publisher = require('./publisher.model');

const Book = sequelize.define('Book', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING, 
        allowNull: false,
    },
    publicationYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    authorId: {
        type: DataTypes.INTEGER,
        references: {
            model: Author,
            key: 'id'
        }
    },
    publisherId: {
        type: DataTypes.INTEGER,
        references: {
            model: Publisher,
            key: 'id'
        }
    },
    categoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: Category,
            key: 'id'
        }
    },
}, {
    tableName: 'Books',
    timestamps: false,
});

module.exports = Book;
