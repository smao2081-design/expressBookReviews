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

    // Find user with matching credentials
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const accessToken = jwt.sign(
        { username: user.username },
        "Your_jwt_secret_key",  // Replace with your secret key
        { expiresIn: '1h' }
    );

    // Save token and username in session (requires express-session middleware)
    req.session.authorization = {
        accessToken,
        username: user.username
    };

    return res.status(200).json({ message: "User successfully logged in", accessToken });


}); 

   
regd_users.put('/auth/review/:isbn', (regd_users.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Authenticate user
    
    const user = users.find(u => u.username === username && u.password === password);
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    
    
    
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


regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization?.username;

    if (!username) {
        return res.status(401).json({ message: "User not logged in" });
    }

    const book = books[isbn];

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (book.reviews && book.reviews[username]) {
        // Delete the review of the logged-in user
        delete book.reviews[username];
        return res.status(200).json({ message: "Review deleted successfully", reviews: book.reviews });
    } else {
        return res.status(404).json({ message: "Review by user not found" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
