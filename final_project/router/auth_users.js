const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  // Filter the users array for any user with the same username
  let validusers = users.filter((username) => {
    return (user.username === username);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
      return true;
  } else {
      return false;
  }
}

// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
  // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
      return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
      return true;
  } else {
      return false;
  }
}

//Task 7
//only registered users can login
regd_users.post("/login", (req,res) => {

  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
      // Generate JWT access token
      let accessToken = jwt.sign({
          data: password
      }, 'access', { expiresIn: 60 * 60 });

      // Store access token and username in session
      req.session.authorization = {
          accessToken, username
      }
      return res.status(200).send("User successfully logged in");
  } else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }

});

//Task 8
//Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

  let isbn = req.params.isbn;
  let update_review = req.body.review;

  let reviews = {};
  let status = 404;

  for (const key of Object.keys(books)) {
    if ( books[key].isbn === isbn ) {
      reviews = books[key].reviews;
      status = 200;
      break;
    }
  }

  let review = {};

  if ( status === 200 ) { 

    let username = req.session.authorization['username'];
    let new_user_review = true;

    for (const key of Object.keys(reviews)) {
      if ( reviews[key].username === username ) {
        review = reviews[key];
        new_user_review = false;
        break;
      }
    }

    review.username = username;
    review.review = update_review;

    if ( new_user_review ) {
      reviews[Object.keys(reviews).length + 1 ] = review;
    }

  }

  return res.status(status).json(review);

});

//Task 9
//Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {

  let isbn = req.params.isbn;
  let reviews = {};
  let status = 404;

  for (const key of Object.keys(books)) {
    if ( books[key].isbn === isbn ) {
      reviews = books[key].reviews;
      status = 200;
      break;
    }
  }

  let review = {};

  if ( status === 200 ) { 

    let username = req.session.authorization['username'];

    let del_key = 0;

    for (const key of Object.keys(reviews)) {
      if ( reviews[key].username === username ) { 
        review = JSON.stringify(reviews[key]);    
        del_key = parseInt(key);
        break;
      }
    }

    if ( del_key > 0 ) {
      while ( reviews.hasOwnProperty(del_key + 1) ) {
        reviews[del_key] = reviews[del_key + 1];
        del_key++;
      }

      delete reviews[del_key];
      review = JSON.parse(review);
    }

  }

  return res.status(status).json(review);

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
