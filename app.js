require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const saltRounds = 5;

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const userSchema = mongoose.Schema({
  emailId: String,
  password: String,
})

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("home");
})

app.get("/login", function(req, res) {
  res.render("login");
})

app.get("/register", function(req, res) {
  res.render("register");
})


app.get("/submit", function(req, res) {
  res.render("submit");
})

app.get("/logout", function(req, res) {
  res.redirect("/");
})
///////////////POST ROUTES/////////////////

app.post("/login", function(req, res) {
  User.findOne({
    emailId: req.body.username
  }, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        bcrypt.compare(req.body.password, foundUser.password, function(err, result) {
          if (result == true) {
            console.log("Logged In");
            res.render("secrets");
          } else {
            res.send("Incorrect Password. Try Again!!");
          }
        });
      } else {
        res.send("User Not Found. Try Again!!");
      }
    }
  })
})

app.post("/register", function(req, res) {
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User({
      emailId: req.body.username,
      password: hash,
    });
    newUser.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    })
  });
})

app.listen(process.env.PORT || 3000, function() {
  console.log("Port Listening on 3000")
})
