const express = require("express"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    ejs = require("ejs"),
    bcrypt = require("bcrypt-nodejs"),
    User = require("./user"),
    id = require("uuid/v4"),
    app = express();

var currentUser; 


app.set("view enginge", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

function apiTokenCheck(req, res, next){

    
};

app.get("/", (req, res) => {

    res.render("index.ejs");


});

app.get("/signup", (req, res) => {

    res.render("signup.ejs");

});

app.get("/login", (req, res) => {

    res.render("login");

});

app.get("user", (req, res) => {
    res.render("user", {

        user:currentUser
    });


});

app.get("/data", apiTokenCheck, (req,res)=>{

    User.find({}, (err, user) =>{

        if (err){
            console.log(err);
        } else {

            res.json({
                "Success": true,
                "reason":"API TOKEN  GOOD"
            });

        }
    });
});


app.post("/login", (req, res)=>{

    User.findOne({"username":req.body.username}, (err, user)=>{
        if(err){
            console.log(err);
        
        } else {
            if(bcrypt.compareSync(req.body.password, user.password)){

                currentUser = user;
                res.redirect("/user");
            } else{
                res.json({
                    "Success": false,
                    "reason": "Wrong user or password"
                });
            }
        }

    });

});

app.post("/signup", ( req, res)=>{

    new User({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password),
        token: id()

    }).save((err)=>{

        if(err){
            console.log(err);
        } else{
            res.redirect("/login");
        }


    });

});

mongoose.connect("mongodb://localhost/api");
app.listen(8080)
console.log("Server is Running in Port 8080");