const express = require("express");
const path = require("path");
const User = require("../persistence/user");
const Project = require("../persistence/project");
const router = express.Router();

const user = new User();
const project = new Project();

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

// router.get("/testprofile", (req, res, next) => {
//   res.render("userprofile");
// });

router.get("/register", (req, res, next) => {
  res.render("register");
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.get("/projectview", (req, res, next) => {
  res.render("viewproject");
});

router.get("/profile", (req, res, next) => {
  if (req.session.user) {
    res.render("userprofile");
    return;
  }
  res.redirect("/");
});

//get project page
// router.get("/project/:projectdata", (req, res, next) => {});

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

//project view post
router.post("/viewproject", (req, res, next) => {
  console.log(req.body.id);
  project.getProject(req.body.id, projectdata => {
    if (projectdata) {
      res.json({
        redirect_path: "/projectview",
        projectdata: projectdata
      });
    } else {
      res.json({ message: "Cannot find project" });
    }
  });
});

// Add Project
router.post("/addproject", (req, res, next) => {
  if (req.session.user) {
    let proj = {
      title: req.body.title,
      details: req.body.details,
      address: req.body.address,
      city: req.body.city,
      maxworkers: parseInt(req.body.maxworkers, 10),
      postedby: "test" //req.session.name
    };
    project.addProject(proj, projectdata => {
      if (projectdata) {
        res.json({ success: "Project has been Submitted!" });
      } else {
        res.json({ message: "Could not add project" });
      }
    });
  }
});

//login Post
router.post("/submitlogin", (req, res, next) => {
  user.login(req.body.username, req.body.password, userdata => {
    if (userdata) {
      //on login, make a session
      req.session.name = userdata.firstname + " " + userdata.last_name;
      req.session.user = userdata.userId;
      res.redirect("/login-success/" + userdata);
    } else {
      res.redirect("/login-failed");
    }
  });
});

//register post
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
