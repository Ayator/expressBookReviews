const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


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
public_users.get('/', async function (req, res) {
  try {
    // In a real scenario, this would be an external API call
    // Using a Promise to simulate the async behavior as per lab requirements
    const get_books = () => {
      return new Promise((resolve) => {
        resolve(books);
      });
    };
    const bks = await get_books();
    res.send(JSON.stringify(bks, null, 4));
  } catch (error) {
    res.status(500).send("Error fetching books");
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const get_book = (isbn) => {
      return new Promise((resolve, reject) => {
        if (books[isbn]) {
          resolve(books[isbn]);
        } else {
          reject({ message: "Book not found" });
        }
      });
    };
    const book = await get_book(isbn);
    res.send(JSON.stringify(book, null, 4));
  } catch (err) {
    res.status(404).json(err);
  }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const get_by_author = (author) => {
      return new Promise((resolve, reject) => {
        const filtered = Object.values(books).filter(book => book.author === author);
        if (filtered.length > 0) {
          resolve(filtered);
        } else {
          reject({ message: "Author not found" });
        }
      });
    };
    const bookList = await get_by_author(author);
    res.send(JSON.stringify(bookList, null, 4));
  } catch (err) {
    res.status(404).json(err);
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const get_by_title = (title) => {
      return new Promise((resolve, reject) => {
        const filtered = Object.values(books).filter(book => book.title === title);
        if (filtered.length > 0) {
          resolve(filtered);
        } else {
          reject({ message: "Book not found" });
        }
      });
    };
    const bookList = await get_by_title(title);
    res.send(JSON.stringify(bookList, null, 4));
  } catch (err) {
    res.status(404).json(err);
  }
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
