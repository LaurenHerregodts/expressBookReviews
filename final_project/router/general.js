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
//public_users.get('/',function (req, res) {
//  res.send(JSON.stringify(books, null, 4));
//});
public_users.get('/', async function (req, res) {
    try {
        console.log("Fetching books using async-await...");
        
        // Create async operation
        const booksData = await new Promise((resolve, reject) => {
            setTimeout(() => {
                if (books) {
                    resolve(books);
                } else {
                    reject(new Error("No books available"));
                }
            }, 100);
        });

        res.status(200).json(booksData);
        
    } catch (error) {
        res.status(500).json({ 
            message: "Error retrieving books", 
            error: error.message 
        });
    } finally {
        console.log("Async-await operation completed");
    }
});

// Get book details based on ISBN
//public_users.get('/isbn/:isbn',function (req, res) {
//  const isbn = req.params.isbn;
//  res.send(books[isbn]);
// });
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    
    try {
        console.log(`Searching for book with ISBN ${isbn} using async-await...`);
        
        const book = await new Promise((resolve, reject) => {
            setTimeout(() => {
                if (books[isbn]) {
                    resolve(books[isbn]);
                } else {
                    reject(new Error(`Book with ISBN ${isbn} not found`));
                }
            }, 100);
        });

        res.status(200).json(book);
        
    } catch (error) {
        res.status(404).json({ 
            message: `Book with ISBN ${isbn} not found` 
        });
    } finally {
        console.log(`ISBN search completed for ${isbn}`);
    }
});
  
// Get book details based on author
//public_users.get('/author/:author',function (req, res) {
//    const keys = Object.keys(books);
//    const targetAuthor = req.params.author;
//    const matches = [];

//    for (const key of keys) {
//        if (books[key].author === targetAuthor) {
//            matches.push(books[key]);
//        }    
//    }

//    if (matches.length > 0) {
//        res.json(matches);
//    } else {
//        res.status(404).json({ message: "No books found by that author" });
//    }
//});

public_users.get('/author/:author', async function (req, res) {
    const targetAuthor = req.params.author;
    
    try {
        console.log(`Searching for books by author ${targetAuthor} using async-await...`);
        
        const matchingBooks = await new Promise((resolve, reject) => {
            setTimeout(() => {
                const keys = Object.keys(books);
                const matches = [];

                for (const key of keys) {
                    if (books[key].author === targetAuthor) {
                        matches.push(books[key]);
                    }
                }

                if (matches.length > 0) {
                    resolve(matches);
                } else {
                    reject(new Error(`No books found by author: ${targetAuthor}`));
                }
            }, 100);
        });

        res.status(200).json(matchingBooks);
        
    } catch (error) {
        res.status(404).json({ 
            message: `No books found by author: ${targetAuthor}` 
        });
    } finally {
        console.log(`Author search completed for ${targetAuthor}`);
    }
});

// Get all books based on title
//public_users.get('/title/:title',function (req, res) {
//    const keys = Object.keys(books);
//    const targetTitle = req.params.title;
//    const matches = [];

//    for (const key of keys) {
//       if (books[key].title === targetTitle) {
//            matches.push(books[key]);
//        }    
//    }

//    if (matches.length > 0) {
//        res.json(matches);
//    } else {
//        res.status(404).json({ message: "No books found with that title" });
//    }
//});
public_users.get('/title/:title', async function (req, res) {
    const targetTitle = req.params.title;
    
    try {
        console.log(`Searching for books with title "${targetTitle}" using async-await...`);
        
        const matchingBooks = await new Promise((resolve, reject) => {
            setTimeout(() => {
                const keys = Object.keys(books);
                const matches = [];

                for (const key of keys) {
                    if (books[key].title === targetTitle) {
                        matches.push(books[key]);
                    }
                }

                if (matches.length > 0) {
                    resolve(matches);
                } else {
                    reject(new Error(`No books found with title: ${targetTitle}`));
                }
            }, 100);
        });

        res.status(200).json(matchingBooks);
        
    } catch (error) {
        res.status(404).json({ 
            message: `No books found with title: ${targetTitle}` 
        });
    } finally {
        console.log(`Title search completed for "${targetTitle}"`);
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
