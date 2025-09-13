const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  let validUsers = users.filter((user) => {
    return user.username === username;
  });

  if (validUsers.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  let validUsers = users.filter((user) => {
    return user.username === username && user.password === password;
  });

  if (validUsers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(404).json({
      message: "Error logging in",
    });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };

    // Set a cookie with the username
    res.cookie("username", username, {
      httpOnly: true, // Ensures the cookie is only accessible by the web server
      secure: true, // Ensures the cookie is sent over HTTPS
      maxAge: 60 * 60 * 1000, // Cookie expiration time (1 hour)
    });

    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(404).json({
      message: "Invalid login. Check username and password",
    });
  }
});

const doesExist = (username) => {
  let usersWithSameName = users.filter((user) => {
    return user.username === username;
  });

  if (usersWithSameName.length > 0) {
    return true;
  } else {
    return false;
  }
};

regd_users.post("/register", (req, res) => {
  //Write your code here
  const { username, password } = req.body;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username: username, password: password });
      return res.status(200).json({
        message: "User successfully registered. Now you can login",
      });
    } else {
      return res.status(404).json({
        message: "User already exists",
      });
    }
  }

  return res.status(404).json({
    message: "Unable to register user",
  });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body.review;

  const book = books[isbn];

  if (book) {
    const username = req.session.authorization.username;
    book.reviews[username] = review;
    return res
      .status(200)
      .json({ message: "Review added/updated successfully" });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;

  const book = books[isbn];
  if (book) {
    const username = req.session.authorization.username;
    if (book.reviews[username]) {
      delete book.reviews[username];
      return res.status(200).json({ message: "Review deleted successfully" });
    }

    return res.status(404).json({ message: "Review not found" });
  }
  return res.status(404).json({ message: "Book not found" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
