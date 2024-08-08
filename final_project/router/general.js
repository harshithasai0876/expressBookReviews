const express = require('express');
const public_users = express.Router();
const books = require('./booksdb.js'); // Assuming booksdb.js exports the books array

// Get the list of books
public_users.get('/', (req, res) => {
    res.json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books.find(b => b.isbn === isbn);
    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

// Get book details based on author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;
    const filteredBooks = books.filter(b => b.author === author);
    res.json(filteredBooks);
});

// Get book details based on title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;
    const filteredBooks = books.filter(b => b.title === title);
    res.json(filteredBooks);
});

// Get book reviews based on ISBN
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books.find(b => b.isbn === isbn);
    if (book) {
        res.json(book.reviews);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;

