const express = require("express");
const path = require("path");
const User = require("../persistence/user");
const router = express.Router();

const user = new User();

//get index page
router.get("/", (req, res, next) => {
  //if user session exists
  if (req.session.user) {
    res.redirect("/profile");
    return;
  }
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
router.get("/login-success/:userdata", (req, res, next) => {
  res.json({
    status: "Login Success",
    redirect_path: `/profile`,
    userdata: req.params.userdata
  });
});
router.get("/login-failed", (req, res, next) => {
  res.json({ message: "User not found" });
});

//get user profile page
router.get("/registersuccess", (req, res, next) => {
  res.json({
    status: "Registeration Successful",
    redirect_path: "/"
  });
});
router.get("/registerfailed", (req, res, next) => {
  res.json({ message: "Sorry! This User already exists" });
});

//Post login
router.post("/submitlogin", (req, res, next) => {
  user.login(req.body.username, req.body.password, data => {
    if (data) {
      //on login, make a session
      req.session.user = data.userId;
      res.redirect("/login-success/" + userdata);
    } else {
      res.redirect("/login-failed");
    }
  });
});

router.post("/submitregister", (req, res, next) => {
  // console.log(req.body);
  let userObj = {
    username: req.body.username,
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email
  };
  user.create(userObj, data => {
    console.log("post: " + data);
    if (data) {
      req.session.opp = 0;
      req.session.user = data.userId;
      res.redirect("/registersuccess");
    } else {
      console.log("Error: Unable to create user");
      res.redirect("/registerfailed");
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
