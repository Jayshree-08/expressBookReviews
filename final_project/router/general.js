
const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

const BASE_URL = "http://localhost:5000";

// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ username, password });
            return res.status(200).json({ message: "User successfully registered. Now you can login." });
        }
        return res.status(404).json({ message: "User already exists!" });
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Get all books
public_users.get('/', async (req, res) => {
    try {
        const response = await axios.get(BASE_URL + '/books');
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(200).json(books);
    }
});

// Get book by ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const response = await axios.get(BASE_URL + '/books/' + req.params.isbn);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(200).json(books[req.params.isbn] || {});
    }
});

// Get books by author
public_users.get('/author/:author', async (req, res) => {
    try {
        const response = await axios.get(BASE_URL + '/books/author/' + encodeURIComponent(req.params.author));
        return res.status(200).json(response.data);
    } catch (error) {
        const result = Object.values(books).filter(
            book => book.author.toLowerCase() === req.params.author.toLowerCase()
        );
        return res.status(200).json(result);
    }
});

// Get books by title
public_users.get('/title/:title', async (req, res) => {
    try {
        const response = await axios.get(BASE_URL + '/books/title/' + encodeURIComponent(req.params.title));
        return res.status(200).json(response.data);
    } catch (error) {
        const result = Object.values(books).filter(
            book => book.title.toLowerCase().includes(req.params.title.toLowerCase())
        );
        return res.status(200).json(result);
    }
});

// Get book reviews
public_users.get('/review/:isbn', (req, res) => {
    const book = books[req.params.isbn];
    if (book) {
        return res.status(200).json(book.reviews);
    }
    return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
