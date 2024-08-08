const express = require('express');
const jwt = require('jsonwebtoken');
const regd_users = express.Router();
const books = require('./booksdb.js'); // Assuming booksdb.js exports the books array

let users = []; // This should store user data for the sake of this example

// Register a new user
regd_users.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    const userExists = users.some(u => u.username === username);
    if (userExists) {
        return res.status(400).json({ message: "Username already exists" });
    }

    users.push({ username, password });
    res.status(201).json({ message: "User registered successfully" });
});

// Login user
regd_users.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ username }, "fingerprint_customer");
    req.session.token = token;
    res.json({ message: "Login successful", token });
});

// Add or modify a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const { review } = req.body;
    const username = req.user.username;

    const book = books.find(b => b.isbn === isbn);
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    const existingReview = book.reviews.find(r => r.username === username);
    if (existingReview) {
        existingReview.review = review;
    } else {
        book.reviews.push({ username, review });
    }

    res.json({ message: "Review added/modified successfully" });
});

// Delete a book review
regd_users.delete('/auth/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;

    const book = books.find(b => b.isbn === isbn);
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    book.reviews = book.reviews.filter(r => r.username !== username);
    res.json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
