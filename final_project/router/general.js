const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    const bookList = await Promise.resolve(books);
    res.send(JSON.stringify(bookList));
  } catch (err) {
    res.status(500).json({ message: "Error retrieving book list" });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  const bookDetails = new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  });

  bookDetails
    .then((book) => {
      res.send(JSON.stringify(book));
    })
    .catch((err) => {
      res.status(404).json({ message: err });
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;

  const keys = Object.keys(books);

  const result = [];

  for (const key of keys) {
    const book = books[key];
    if (book.author === author) {
      result.push(book);
    }
  }

  if (result.length > 0) {
    return res.send(JSON.stringify(result));
  }
  return res.status(404).json({ message: "No books found by this author" });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;

  const keys = Object.keys(books);

  const result = [];
  for (const key of keys) {
    const book = books[key];
    if (book.title === title) {
      result.push(book);
    }

    if (result.length > 0) {
      return res.send(JSON.stringify(result));
    }
    return res.status(404).json({ message: "No books found with this title" });
  }
});

public_users.get("/search", function (req, res) {
  const type = req.query.type;
  const term = req.query.term.toLowerCase();

  const keys = Object.keys(books);
  const result = [];

  for (const key of keys) {
    const book = books[key];
    if (
      (type === "author" && book.author.toLowerCase().includes(term)) ||
      (type === "title" && book.title.toLowerCase().includes(term)) ||
      (type === "isbn" && key.includes(term))
    ) {
      result.push(book);
    }
  }

  if (result.length > 0) {
    return res.send(JSON.stringify(result));
  } else {
    return res
      .status(404)
      .json({ message: "No books found matching the criteria" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  const book = books[isbn];

  if (book) {
    return res.send(JSON.stringify(book.reviews));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
