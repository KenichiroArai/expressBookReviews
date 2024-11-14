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
public_users.get('/',
    function (req, res) {
        let result = res.send(JSON.stringify(books, null, 4));
        return result;
    }
);

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let result = null;
    const isbn = req.params.isbn;
    result = res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    let result = null;

    const author = req.params.author;
    const matchingBooks = [];

    for (let i = 0; i < Object.keys(books).length; i++) {
        const isbn = Object.keys(books)[i];
        const book = books[isbn];
        if (!book.author) {
            continue;
        }
        if (book.author != author) {
            continue;
        }
        matchingBooks.push(book);
    }

    if (matchingBooks.length <= 0) {
        res.status(404).json({ message: "No books found for this author" });
        return result;
    }
    result = res.status(200).json(matchingBooks);
    return result;
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let result = null;

    const title = req.params.title;
    const matchingBooks = [];

    for (let i = 0; i < Object.keys(books).length; i++) {
        const isbn = Object.keys(books)[i];
        const book = books[isbn];
        if (!book.title) {
            continue;
        }
        if (book.title != title) {
            continue;
        }
        matchingBooks.push(book);
    }

    if (matchingBooks.length <= 0) {
        res.status(404).json({ message: "No books found for this title" });
        return result;
    }
    result = res.status(200).json(matchingBooks);
    return result;
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
