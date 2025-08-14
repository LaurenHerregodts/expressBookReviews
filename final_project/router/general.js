const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
        return res.status(404).json({message:"User already exists!"});
    }
  }

  return res.status(404).json({message:"Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const keys = Object.keys(books);
    const targetAuthor = req.params.author;
    const matches = [];

    for (const key of keys) {
        if (books[key].author === targetAuthor) {
            matches.push(books[key]);
        }    
    }

    if (matches.length > 0) {
        res.json(matches);
    } else {
        res.status(404).json({ message: "No books found by that author" });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const keys = Object.keys(books);
    const targetTitle = req.params.title;
    const matches = [];

    for (const key of keys) {
        if (books[key].title === targetTitle) {
            matches.push(books[key]);
        }    
    }

    if (matches.length > 0) {
        res.json(matches);
    } else {
        res.status(404).json({ message: "No books found with that title" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        res.json(books[isbn].reviews);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
