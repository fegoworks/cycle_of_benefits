const express = require("express");
const path = require("path");
const User = require("../persistence/user");
const router = express.Router();

const user = new User();

//get index page
router.get("/", (req, res, next) => {
  res.render("index");
});
router.get("/index", (req, res, next) => {
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
  res.render("userprofile");
});

//get user profile page
router.get("/success", (req, res, next) => {
  console.log("user: " + req.params.user);
  // res.render("userprofile");
  res.end();
});

router.get("/failed", (req, res) => {
  // console.log(req.params.password);
  res.send("Username/Password incorrect!");
  res.end();
});

//Post login
router.post("/submitlogin", (req, res, next) => {
  user.login(req.body.username, req.body.password, function(data) {
    if (data) {
      //on login, make a session
      req.session.user = data;
      console.log(req.session.user);
      req.session.opp = 1;
      res.redirect("/profile");
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
        req.session.user = result;
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
