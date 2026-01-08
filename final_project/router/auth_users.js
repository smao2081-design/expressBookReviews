const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();


let users = [];  // In-memory users array

// Function to check if username is valid (not taken)
    const isValid = (username) => {
        return !users.some(user => user.username === username);
    };

// Function to authenticate user credentials
    const authenticatedUser = (username, password) => {
        return users.some(user => user.username === username && user.password === password);
    };

// Registration route
regd_users.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if username already exists
    if (!isValid(username)) {
        return res.status(409).json({ message: "Username already exists" });
    }

    // Add new user
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});

// Login route
regd_users.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Authenticate user
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const accessToken = jwt.sign(
        { username: username },
        "The_cow_jumped_the_moon",  // Replace with your secret key
        { expiresIn: '1h' }
    );

    // Save token and username in session (requires express-session middleware in main app)
    req.session.authorization = {
        accessToken,
        username: user.username
    };

    return res.status(200).json({ message: "User successfully logged in", acessToken });

}); 

   
regd_users.put('/auth/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization?.username;

    if (!username) {
        return res.status(401).json({ message: "User not logged in" });
    }

    if (!review) {
        return res.status(400).json({ message: "Review text is required" });
    }

    const book = books[isbn];

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Add or update the review for this user
    book.reviews[username] = review;

    return res.status(200).json({ message: "Review added/modified successfully", reviews: book.reviews });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
