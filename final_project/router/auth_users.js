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

    // セッションにトークンを保存
    req.session.authorization = {
      accessToken: token
    };
  
    result = res.status(200).json({ message: "Login successful", token });

    return result;
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;

    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized access: No token provided" });
    }

    // トークンから 'Bearer ' を取り除く
    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(401).json({ message: "Unauthorized access: Invalid token format" });
    }

    const token = tokenParts[1];

    // Verify the token and extract the username
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token", error: err.message });
        }

        const username = decoded.username;

        if (!books[isbn]) {
            return res.status(404).json({ message: "Book not found" });
        }

        // レビューを追加または更新
        if (!books[isbn].reviews) {
            books[isbn].reviews = {};
        }

        books[isbn].reviews[username] = review;

        return res.status(200).json({
            message: "Review added/updated successfully",
            reviews: books[isbn].reviews
        });
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
