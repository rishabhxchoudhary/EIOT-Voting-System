var express = require("express");
var router = express.Router();
var students = require('./student_list');
const db = require("./database");
var passwordHash = require('password-hash');

// Post Methods

// Form Post
router.post("/form/:id",async (req,res)=>{
    if (req.session.user){
        let id = req.params.id;
        let choice = req.body.radio;
        try{
            await  db.updateForm(choice,req.session.user.roll_number,id);
            res.redirect(`/route/form/${id}`);
        }
        catch(e){
            res.render("error",{error:e});
        }
    }
    else{
        res.render("login",{
            alert: "User Not Logged In."
        })
    }
})

// Post
router.post("/admin/form",async (req,res)=>{
    if (req.session.admin){
        let course = req.body.course;
        let date = req.body.date;
        let slot = req.body.slot;
        try{
            await db.insertNewForm(course,date,slot);
            res.redirect("/");
        }
        catch(e){
            res.render("error",{
                error: e
            })
        }
    }
    else{
        res.render("login",{
            alert: "User Not Logged In."
        })
    }
})

// Login Method
router.post("/login",async (req,res)=>{
    let username = req.body.username.toLowerCase();
    let password = req.body.password;
    let result = await db.findUserByEmail(username.toLowerCase());
    if(result){
        if (passwordHash.verify(password, result.password)){
            req.session.user = {
                roll_number: req.body.username.toLowerCase()
            };
            res.redirect("/");
        }
        else{
            res.render("error",{
                error:"Incorrect Password. Contact +919769857233 (Rishabh) to make a new account. "
            });
        }

    }
    else{
        res.render("error",{error:"Account does not exist with this username."})
    }
})

// Admin Login Method
router.post("/adminLogin",async (req,res)=>{
    let username = req.body.username.toLowerCase();
    let password = req.body.password;
    if (students.cr_roll_numbers.includes(username)){
        let result = await db.findUserByEmail(username.toLowerCase());
        if(result){
            if (passwordHash.verify(password, result.password)){
                req.session.admin = {
                    roll_number: req.body.username.toLowerCase()
                };
                res.redirect("/");
            }
            else{
                res.render("error",{
                    error:"Incorrect Password. Contact +919769857233 (Rishabh) to make a new account. "
                });
            }
    
        }
        else{
            res.render("error",{error:"Account does not exist with this username."})
        }
    }
    else{
        res.render("error",{error:"Only CRs have access to this!"})
    }
})


// Signup Method
router.post("/signup", async (req,res)=>{
    let username = req.body.username.toUpperCase();
    let password = req.body.password;
    password = passwordHash.generate(password);

    if (students.roll_numbers.includes(username.toLowerCase())){
        try{
            let result = await db.findUserByEmail(username.toLowerCase());
            if (result){
                res.render("error",{error:"Account already exists with this username."});
            }
            else{
                await db.insertNewUser(username,password);
                req.session.user = {
                    roll_number: username.toLowerCase()
                };
                res.redirect("/")
            }
        }
        catch(e){
            res.render("error",{error:e});
        }
    }
    else{
        res.render("error",{
            error: `Only EIOT Students are Allowed to register!.Username was not correct.Entered username : ${req.body.username} `
        });
    }
})





// Get Methods 

// Log Out
router.get("/logout",(req,res)=>{
    if (req.session.user){
        req.session.destroy(function(err){
            if(err){
                res.render("error",{error:err});
            }
            else{
                res.redirect("/");
            }
        });
    }
    else{
        res.redirect("/");
    }
})
router.get("/admin/logout",(req,res)=>{
    if (req.session.admin){
        req.session.destroy(function(err){
            if(err){
                res.render("error",{error:err});
            }
            else{
                res.redirect("/");
            }
        });
    }
    else{
        res.redirect("/");
    }
})

// Dashboard
router.get("/dashboard",async (req,res)=>{
    if (req.session.user){
        const result = await db.fetchAllForms();
        res.render("dashboard",{
            title: req.session.user.roll_number,
            _data: result
        });
    }
    else{
        res.render("login",{
            alert: "User Not Logged In."
        })
    }
})

// Dashboard
router.get("/admin/dashboard",async (req,res)=>{
    if (req.session.admin){
        res.render("crpage",{
            title: req.session.admin.roll_number
        });
    }
    else{
        res.render("admin_login",{
            alert: "User Not Logged In."
        })
    }
})

// Form Details
router.get("/form/:id",async (req,res)=>{
    if (req.session.user){
        let id = req.params.id;
        const result = await db.findFormById(id);
        if (result.responded.includes(req.session.user.roll_number)){
            res.render("form_responded",{
                result,
                title: req.session.user.roll_number,
            });
        }
        else{
            res.render("form_not_responded",{result,title: req.session.user.roll_number,});
        }
    }
    else{
        res.render("login",{
            alert: "User Not Logged In."
        })
    }
})


module.exports = router;
