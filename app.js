require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const md5 = require("md5");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB")

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});







const User = mongoose.model("user", userSchema);
//TODO
app.get("/register" , (req, res) => {
    res.render("register.ejs")
})


app.get("/" , (req, res) => {
    res.render("home.ejs")
})

app.get("/login" , (req, res) => {
    res.render("login.ejs")
})

app.post("/register", (req, res)=>{
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });

    newUser.save((err)=> {
        err ? console.error(err) : res.render("secrets.ejs");
    })
})

app.post("/login", (req, res)=>{
    const email = req.body.username;
    const password = md5(req.body.password);
    User.findOne({email: email}, (err, foundUser) => {
        if (err){
            
            console.error(err);
            
        } else {
            if (foundUser.email === email){
                if (foundUser.password === password) {
                    console.log("successfully endered");
                    res.render("secrets.ejs");
                }else {
                    console.error("Password incorrect")
                }
            } else {
                console.error("No User with email: " + email  )
            }
        }
    })
})



app.listen(3000, function() {
  console.log("Server started on port 3000");
});