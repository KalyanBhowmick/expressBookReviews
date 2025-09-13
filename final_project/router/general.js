const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  const bookList = new Promise((resolve, reject) => {
    resolve(books);
  });

  bookList
    .then((books) => {
      res.send(JSON.stringify(books));
    })
    .catch((err) => {
      res.status(500).json({ message: "Error retrieving book list" });
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books.find((b) => b.isbn === isbn);
  if (book) {
    return res.send(JSON.stringify(book));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const booksByAuthor = books.filter((b) => b.author === author);
  if (booksByAuthor.length > 0) {
    return res.send(JSON.stringify(booksByAuthor));
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const booksByTitle = books.filter((b) => b.title === title);
  if (booksByTitle.length > 0) {
    return res.send(JSON.stringify(booksByTitle));
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books.find((b) => b.isbn === isbn);
  if (book) {
    return res.send(JSON.stringify(book.reviews));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
