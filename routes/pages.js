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
  // if (req.session.user) {
  //   res.redirect("/profile");
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

router.get("/projectview", (req, res, next) => {
  res.render("viewproject");
});

// router.get("/profile", redirectHome, (req, res) => {
//   res.render("profile");
// });

router.get("/profile", (req, res) => {
  // res.render("profile.ejs");
  console.log(req.session.userid);
  if (req.session.userid) {
    //get userdata and render profile
    user.getProfile(req.session.userid, userprofile => {
      if (userprofile) {
        res.render("profile.ejs", {
          username: userprofile.username ? userprofile.username : "",
          firstname: userprofile.first_name ? userprofile.first_name : "",
          lastname: userprofile.last_name ? userprofile.last_name : "",
          age: userprofile.age ? userprofile.age : "",
          email: userprofile.email_address ? userprofile.email_address : "",
          address: userprofile.home_address ? userprofile.home_address : "",
          phone: userprofile.mobile_number ? userprofile.mobile_number : "",
          nationalId: userprofile.nationalId ? userprofile.nationalId : "",
          state: userprofile.state_of_origin ? userprofile.state_of_origin : ""
        });
        return;
      } else {
        console.log("profile route Error: Could not find user profile");
      }
    });
  } else {
    res.redirect("/login");
  }
});

//get project page
// router.get("/project/:projectdata", (req, res, next) => {});

// router.get("/loginfailed", (req, res, next) => {
//   res.json({ message: "User not found" });
// });

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
router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  if (username && password) {
    user.login(username, password, id => {
      if (id) {
        console.log("user Found");
        //on login, make a session
        // req.session.name = userdata.first_name + " " + userdata.last_name;
        req.session.userid = id;
        // res.redirect("/profile");
        res.json({
          redirect_path: "http://localhost:3000/profile"
          // userdata: userdata
        });
      } else {
        // res.json({ message: "Login Failed" });
        res.status(404).json({ message: "Login Failed" });
        console.log("Login Post Err: user not found");
      }
    });
  }
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
