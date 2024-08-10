const express = require('express');
const path = require('path');
const hbs = require('hbs');
require('dotenv').config();
const sequelize = require('./config/database');

const authorsRouter = require('./routes/author.routes');
const publishersRouter = require('./routes/publisher.routes');
const categoryRouter = require('./routes/category.routes');
const bookRouter = require('./routes/book.routes');
const homeRouter = require('./routes/home.routes');

const app = express();

// Models
const Publisher = require('./models/publisher.model');
const Book = require('./models/book.model');
const Category = require('./models/category.model');
const Author = require('./models/author.model');

// Helper ifCond
hbs.registerHelper('ifCond', function(v1, operator, v2, options) {
    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});



app.set('view engine', 'hbs');
app.set('views', [
    path.join(__dirname, 'views'),
    path.join(__dirname, 'views', 'publisher'),
    path.join(__dirname, 'views', 'author'),
    path.join(__dirname, 'views', 'book'),
    path.join(__dirname, 'views', 'category')
]);
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));
app.set('view options', { layout: 'layouts/main' });
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para procesar datos de formularios
app.use(express.urlencoded({ extended: true }));

// Verificación de la conexión a la base de datos
sequelize.authenticate()
    .then(() => {
        console.log('Connection to the database has been established successfully.');
        // Sincronización con la base de datos (si es necesario)
        return sequelize.sync();
    })
    .then(() => {
        console.log('Database synchronized successfully.');
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });


app.use('/publishers', publishersRouter);
app.use('/authors', authorsRouter);
app.use('/categories', categoryRouter);
app.use('/books', bookRouter);
app.use('/', homeRouter);

// Puerto para escuchar las solicitudes
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
