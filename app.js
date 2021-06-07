require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")
const _ = require("lodash");

const app = express();
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser : true, useUnifiedTopology: true})

const userSchema = mongoose.Schema({
  emailId : String,
  password : String,
})

userSchema.plugin(encrypt, { secret: process.env.SECRET , encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);

app.get("/",function(req,res){
  res.render("home");
})

app.get("/login",function(req,res){
  res.render("login");
})

app.get("/register",function(req,res){
  res.render("register");
})


app.get("/submit",function(req,res){
  res.render("submit");
})

app.get("/logout",function(req,res){
  res.redirect("/");
})
///////////////POST ROUTES/////////////////

app.post("/login",function(req,res){
  const username = req.body.username;
  User.find({emailId:req.body.username,password:req.body.password},function(err,foundUser){
    if(foundUser){
      res.render("secrets");
    }else{
      res.send("User Not Found. Try Again!!");
    }
  })
})

app.post("/register",function(req,res){
  const newUser = new User({
    emailId : req.body.username,
    password : req.body.password,
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }
    else{
      res.render("secrets");
    }
  })
})

app.listen(process.env.PORT ||3000,function(){
  console.log("Port Listening on 3000")
})
