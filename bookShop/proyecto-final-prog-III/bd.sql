-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS bookshop_db;

-- Seleccionar la base de datos
USE bookshop_db;

-- Tabla para autores
CREATE TABLE IF NOT EXISTS Authors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
);
insert into Authors(name, email)
values('Juan Perez', 'juanperez@gmail.com');
select * from Authors;

-- Tabla para categorías
CREATE TABLE IF NOT EXISTS Categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

-- Tabla para editoriales (publishers)
CREATE TABLE IF NOT EXISTS Publishers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    country VARCHAR(255) NOT NULL
);

-- Tabla para libros
CREATE TABLE IF NOT EXISTS Books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image LONGBLOB NOT NULL,
    publicationYear INT NOT NULL,
    authorId INT,
    publisherId INT,
    categoryId INT,
    FOREIGN KEY (authorId) REFERENCES Authors(id),
    FOREIGN KEY (publisherId) REFERENCES Publishers(id),
    FOREIGN KEY (categoryId) REFERENCES Categories(id)
);


INSERT INTO Publishers (name, telephone, country) VALUES ('Penguin Random House', '+1-212-782-9000', 'United States');
INSERT INTO Publishers (name, telephone, country) VALUES ('HarperCollins', '+1-212-207-7000', 'United States');
INSERT INTO Publishers (name, telephone, country) VALUES ('Macmillan Publishers', '+44-20-7014-6000', 'United Kingdom');


