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
    user => user.name === username
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
  let username = req.body.username
  let password = req.body.password

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
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
