const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Task 6
  let username = req.body.username
  let password = req.body.password
  if (!username || !password) return res.status(404).json({ message: "User/password invalid" });
  if (isValid(username)) return res.status(404).json({ message: "User already exists" });

  users.push({ 'username': username, 'password': password })
  return res.status(200).send("New user added: " + JSON.stringify(users.filter(user =>
    user.username === username), null, 2));;
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Task 10
  getBooksAsync()
    .then(response => {
      return res.status(200).send(response);
    }).catch(err => {
      return res.status(404).json({ errorMessage: "Failed to get books" });
    })
});
function getBooksAsync() {
  return new Promise((resolve) => {
    resolve(JSON.stringify(books, null, 4));
  });
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Task 11
  let isbn = req.params.isbn
  getDetailIsbnAsync(isbn)
    .then(response => {
      return res.status(200).send(response);
    }).catch(err => {
      return res.status(404).json({ errorMessage: "Failed to get books" });
    })
});
function getDetailIsbnAsync(isbn) {
  return new Promise((resolve) => {
    resolve(JSON.stringify(books[isbn], null, 4));
  });
}


// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Task 12
  const author = req.params.author
  getBooksAuthorAsync(author)
    .then(response => {
      return res.status(200).send(response);
    }).catch(err => {
      return res.status(404).json({ errorMessage: "Failed to get books" });
    })
});

function getBooksAuthorAsync(author) {
  const isbns = Object.keys(books)
  authorBooks = []
  isbns.forEach((isbn) => {
    if (books[isbn].author === author) authorBooks.push(books[isbn])
  })
  return new Promise((resolve) => {
    resolve(JSON.stringify(authorBooks, null, 2));
  });
}

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Task 13
  const title = req.params.title
  getBooksTitleAsync(title)
    .then(response => {
      return res.status(200).send(response);
    }).catch(err => {
      return res.status(404).json({ errorMessage: "Failed to get books" });
    })
});

function getBooksTitleAsync(title) {
  const isbns = Object.keys(books)
  titleBooks = []
  isbns.forEach((isbn) => {
    if (books[isbn].title === title) titleBooks.push(books[isbn])
  })
  return new Promise((resolve) => {
    resolve(JSON.stringify(titleBooks, null, 2));
  });
}


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Task 5
  let isbnBook = books[req.params.isbn]
  return res.status(200).send(JSON.stringify(isbnBook.reviews, null, 2));
});

module.exports.general = public_users;
