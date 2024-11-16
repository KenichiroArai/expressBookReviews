const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    let result = null;

    const { username, password } = req.body;

    if (!username || !password) {
        result = res.status(400).json({ message: "Username and password are required" });
        return result;
    }
  
    const userExists = users.some(user => user.username === username);
    if (userExists) {
        result = res.status(400).json({ message: "Username already exists" });
        return result;
    }
  
    users.push({ username, password });

    result = res.status(201).json({ message: "User successfully registered" });
    return result;
});

function getBooks() {
    return new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        } else {
            reject("Books data not found");
        }
    });
}

// Get the book list available in the shop
public_users.get('/',
    function (req, res) {
        getBooks()
            .then((books) => {
            let result = res.send(JSON.stringify(books, null, 4));
            return result;
        })
        .catch((error) => {
            res.status(500).json({ message: error });
        });
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
    let result = null;

    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (!book) {
        result = res.status(404).json({ message: "Book not found or no reviews available" });
        return result;
    } else if (!book.reviews) {
        result = res.status(404).json({ message: "Book not found or no reviews available" });
        return result;
    }

    result = res.status(200).json(book.reviews);
    return result;
});

module.exports.general = public_users;
