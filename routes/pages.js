const express = require("express");
const path = require("path");
const User = require("../persistence/user");
const router = express.Router();

const user = new User();

//get index page
router.get("/", (req, res, next) => {
  //if user session exists
  // if(req.session.user){
  //   res.redirect('/profile');
  //   return;
  // }
  // console.log(req.session);
  res.render("index");
});

router.get("/projects", (req, res, next) => {
  res.render("projects");
});

router.get("/about", (req, res, next) => {
  res.render("about");
});

router.get("/register", (req, res, next) => {
  res.render("register");
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.get("/profile", (req, res, next) => {
  if (req.session.user) {
    res.render("userprofile");
    return;
  }
  res.redirect("/");
});

//get user profile page
router.get("/success/:userfirstname", (req, res, next) => {
  res.json({
    status: "Login Success",
    redirect_path: `/profile`,
    firstname: req.params.userfirstname
  });
});

router.get("/failed", (req, res, next) => {
  res.json({ message: "User not found" });
});

//Post login
router.post("/submitlogin", (req, res, next) => {
  console.log(req.body);
  user.login(req.body.username, req.body.password, function(data) {
    if (data) {
      //on login, make a session
      req.session.user = data.userId;
      req.session.opp = 1;
      res.redirect("/success/" + data.firstName);
    } else {
      res.redirect("/failed");
    }
  });
});

router.post("/submitregister", (req, res, next) => {
  let userObj = {
    username: req.body.username,
    password: req.body.password,
    firstname: req.body.first_name,
    lastname: req.body.last_name,
    email: req.body.email
  };
  user.create(userObj, function(userid) {
    if (userid) {
      user.find(userid, function(result) {
        req.session.opp = 0;
        req.session.user = result.userId;
        res.redirect("/");
      });
    } else {
      console.log("Error: Unable to create user");
    }
  });
});

// Get logout page
router.get("/logout", (req, res, next) => {
  // Check if the session is exist
  if (req.session.user) {
    // destroy the session and redirect the user to the index page.
    req.session.destroy(function() {
      res.redirect("/");
    });
  }
});

module.exports = router;
