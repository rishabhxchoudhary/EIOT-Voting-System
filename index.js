const express = require("express");
const app = express();
const path = require('path');
const bodyparser = require("body-parser");
const session = require("express-session");
const { v4:uuidv4 } = require("uuid");
const router = require("./router");
var compression = require('compression');
app.use(compression({
    level: 6
}));
const port = process.env.PORT || 80;

app.set("view engine","ejs");
app.set('views', path.join(__dirname, 'views'));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

app.use('/static', express.static(path.join(__dirname, 'public')))

app.use(session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true
}));

app.use("/route",router);


app.get("/",(req,res) => {
    if (req.session.user){
        res.redirect("/route/dashboard");
    }
    else if (req.session.admin){
        res.redirect("/route/admin/dashboard");
    }
    else{
        res.redirect("/login");
    }
})

app.get("/login",(req,res) => {
    if (req.session.user){
        res.redirect("/route/dashboard");
    }
    else{
        res.render("login");
    }
})

app.get("/admin",(req,res) => {
    if (req.session.admin){
        res.redirect("/route/admin");
    }
    else{
        res.render("admin_login");
    }
})

app.get("/signup",(req,res) => {
    if (req.session.user){
        res.redirect("/route/dashboard");
    }
    else{
        res.render("signup");
    }
})

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
} )