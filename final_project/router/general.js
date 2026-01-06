const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books, null, 4));


  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = Number(req.params.isbn);
    console.log("Requested ISBN:", isbn);
    console.log("Books available:", Object.keys(books));
    const book = books[isbn];
    if (book) {
        res.send(book);
    } else {
  //Write your code here
        return res.status(404).json({message: "Book not found"});
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const bookKeys = Object.keys(books);
    let matchBooks = {};

    bookKeys.forEach((key) => {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
            matchBooks[key] = books[key];
        }
    });

    if (Object.keys(matchBooks).length > 0) {
        res.send(matchBooks);

    } else {
        
  //Write your code here
        return res.status(404).json({ message: "No books found by this author" });
    }  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
