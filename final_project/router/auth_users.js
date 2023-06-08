const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {
    username: 'user1',
    password: 'pass1',
  },
  {
    username: 'user2',
    password: 'pass2',
  },
  {
    username: 'user3',
    password: 'pass3',
  },
];

const isValid = (username) => { //returns boolean
  let usersMatch = users.filter(
    (user) => {return(user.username === username)}
  )
  return usersMatch.length > 0
}

const authenticatedUser = (username, password) => { //returns boolean
  let usersMatch = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  return usersMatch.length > 0
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username
  const password = req.body.password

  if (!username || !password) {
    return res.status(404).json({ message: 'Error loggin in' })
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      'access',
      { expiresIn: 60 * 60 }
    )

    req.session.authorization = {
      accessToken,
      username,
    }
    return res.status(200).send('User successfully logged in')
  } else {
    return res
      .status(208)
      .json({ message: 'Invalid Login. Check username and password' })
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Task 8
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization.username;

  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review added by user " + username + JSON.stringify(books[isbn] )});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Task 9
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if(books[isbn]["reviews"][username]){
    delete books[isbn]["reviews"][username];
    return res.status(200).json({ message: "Review from user " + username + " deleted" + JSON.stringify(books[isbn] )});
  }
  return res.status(403).json({ message: "No review from user " + username + " to be deleted" + JSON.stringify(books[isbn] )});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
