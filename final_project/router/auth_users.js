const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 

    let userwithsamename = users.filter((user) => {
        return user.username === username;

    });

    if (userwithsamename.length > 0) {
        return true;
    } else {
        return false;
    }

}

const authenticatedUser = (username,password)=>{ 

    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });

    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }

}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message:"Error logging in"});
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
        data:username
    }, 'access', {expiresIn: 60 * 60});

    req.session.authorization = {
        accessToken, username
    }

    return res.status(200).send("User successfully logged in");

  } else {

    return res.status(208).json({message:"Invalid Login. Check username and password."});

  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.authorization.username;

    // Validate inputs
    if (!review || review.trim() === "") {
        return res.status(400).json({message: "Review cannot be empty"});
    }

    let book = books[isbn];
    
    if (book) {
        // Initialize reviews object if it doesn't exist
        if (!book.reviews) {
            book.reviews = {};
        }
        
        // Store/update review by username - this handles both new and modified reviews
        book.reviews[username] = review;
        
        return res.status(200).json({
            message: `Review for ISBN ${isbn} posted/updated successfully by ${username}`
        });
    } else {
        return res.status(404).json({message: "Book not found"});
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username; // Get username from session

    let book = books[isbn];
    
    if (book) {
        // Check if the book has reviews
        if (!book.reviews) {
            return res.status(404).json({
                message: `No reviews found for book with ISBN ${isbn}`
            });
        }
        
        // Check if the current user has a review for this book
        if (!book.reviews[username]) {
            return res.status(404).json({
                message: `No review found for user ${username} on book with ISBN ${isbn}`
            });
        }
        
        // Delete only the current user's review
        delete book.reviews[username];
        
        return res.status(200).json({
            message: `Review by ${username} for book with ISBN ${isbn} deleted successfully`
        });
        
    } else {
        return res.status(404).json({message: "Book not found"});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
