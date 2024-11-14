const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const secretKey = 'sample_secret_key';

const isValid = (username)=>{ //returns boolean
    let result = false;
    result = users.some(user => user.username === username);
    return result;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let result = false;
    result = users.some(user => user.username === username && user.password === password);
    return result;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    let result = null;

    const { username, password } = req.body;

    if (!username || !password) {
        result = res.status(400).json({ message: "Username and password are required" });
        return result;
    }
  
    if (!authenticatedUser(username, password)) {
        result = res.status(401).json({ message: "Invalid username or password" });
        return result;
    }
    
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
    result = res.status(200).json({ message: "Login successful", token });

    return result;
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
