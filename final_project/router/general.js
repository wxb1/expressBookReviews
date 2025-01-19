const axios = require('axios');
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
      return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
      return true;
  } else {
      return false;
  }
}

//Task 6
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!doesExist(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

//Task 1
//Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

//Task 2
//Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

    let isbn = req.params.isbn;

    let isbn_book = {};
    let status = 404;

    for (const key of Object.keys(books)) {
      if ( books[key].isbn === isbn ) {
        isbn_book = books[key];
        status = 200;
        break;
      }
    }

    return res.status(status).json(isbn_book);

 });
 
//Task 3
//Get book details based on author
public_users.get('/author/:author',function (req, res) {

  let author = req.params.author;

  let isbn_books = [];
  let status = 404;

  for (const key of Object.keys(books)) {
    if ( books[key].author === author ) {
      isbn_books.push(books[key]);
      status = 200;
    }
  }

  return res.status(status).json(isbn_books);

});

//Task 4
//Get all books based on title
public_users.get('/title/:title',function (req, res) {

  let title = req.params.title;

  let isbn_books = [];
  let status = 404;

  for (const key of Object.keys(books)) {
    if ( books[key].title === title ) {
      isbn_books.push(books[key]);
      status = 200;
    }
  }

  return res.status(status).json(isbn_books);

});

//Task 5
//Get book review
public_users.get('/review/:isbn',function (req, res) {

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

  return res.status(status).json(reviews);

});

//Task 10
//Get all books - Using async callback function
booksTask = () => {

  //function(res) and function(err) are the anonymous callback functions
  const url = "http://localhost:5000/"
 
  axios.get(url).then(function(res) {
     console.log(res.data);
  }).catch(function(err) {
     console.log(err)
  })
 
 }

 //Task 11
//Search by ISBN
isbnTask = () => {

  //function(res) and function(err) are the promise callback functions
  const url = "http://localhost:5000/isbn/0393643980"
 
  axios.get(url).then(function(res) {
    console.log(res.data);
 }).catch(function(err) {
    console.log(err)
 });
 
 }

//Task 12
//Search by Author
authorTask = async () => {

  //function(res) and function(err) are the async/await callback functions
  const url = "http://localhost:5000/author/Unknown"
 
 const result = await axios.get(url);
 console.log(result.data);
 
 }

 //Task 13
//Search by Title
titleTask = async () => {

  //function(res) and function(err) are the async/await callback functions
  const url = "http://localhost:5000/title/Pride and Prejudice"
 
 const result = await axios.get(url);
 console.log(result.data);
 
 }
 
module.exports.general = public_users;
