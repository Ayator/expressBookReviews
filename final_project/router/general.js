const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    const userExists = users.some((user) => user.username === username);
    if (!userExists) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  const get_books = new Promise((resolve, reject) => {
    resolve(books);
  });
  get_books.then((bks) => {
    res.send(JSON.stringify(bks, null, 4));
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const get_books = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({ message: "Book not found" });
    }
  });

  get_books
    .then((book) => {
      res.send(JSON.stringify(book, null, 4));
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const get_books = new Promise((resolve, reject) => {
    const filtered = Object.values(books).filter(book => book.author === author);
    if (filtered.length > 0) {
      resolve(filtered);
    } else {
      reject({ message: "Author not found" });
    }
  });

  get_books
    .then((bookList) => {
      res.send(JSON.stringify(bookList, null, 4));
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const get_books = new Promise((resolve, reject) => {
    const filtered = Object.values(books).filter(book => book.title === title);
    if (filtered.length > 0) {
      resolve(filtered);
    } else {
      reject({ message: "Book not found" });
    }
  });

  get_books
    .then((bookList) => {
      res.send(JSON.stringify(bookList, null, 4));
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
