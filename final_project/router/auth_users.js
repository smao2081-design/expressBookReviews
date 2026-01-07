const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();




let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({message: "Username and password required"});

    }

    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({message: "Invalid username or password"});

    }

    const accessToken = jwt.sign(
        { username: user.username },
        "The_cow_jumped_the_moon",
        { expiresIn: '1h' }    
    );

    req.session.authorization = {
        accessToken,
        username: user.username
    };

    return res.status(200).json({ message: "User successfully logged in", accessToken });

});
    if (userExists) {
        return res.status(409).json({message: "Username already exists" });

    }

    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
    
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
