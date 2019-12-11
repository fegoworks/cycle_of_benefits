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
  if (req.session.userid) {
    //get userdata and render profile
    user.getProfile(req.session.userid, userprofile => {
      if (userprofile) {
        res.render("profile.ejs", {
          username: userprofile.userId ? userprofile.userId : "",
          firstname: userprofile.first_name ? userprofile.first_name : "",
          lastname: userprofile.last_name ? userprofile.last_name : "",
          email: userprofile.email_address ? userprofile.email_address : "",
          age: userprofile.date_of_birth ? userprofile.date_of_birth : "",
          address: userprofile.home_address ? userprofile.home_address : "",
          phone: userprofile.mobile_number ? userprofile.mobile_number : "",
          nationalId: userprofile.nationalId ? userprofile.nationalId : "",
          state: userprofile.state_of_origin ? userprofile.state_of_origin : ""
        });
        return;
      }
      console.log("profile route Error: Could not find user profile");
    });
  } else {
    res.redirect("/login");
  }
});

router.put("/updateuser", (req, res) => {
  console.log("received fetch: " + req.body.dob);
  const profile = {
    username: req.body.username,
    fname: req.body.fname /* ? req.body.fname : "" */,
    lname: req.body.lname /* ? req.body.lname : "" */,
    email: req.body.email /* ? req.body.email : "" */,
    dob: req.body.dob /* ? req.body.dob : "" */,
    address: req.body.address /* ? req.body.address : "" */,
    phone: req.body.phone /* ? req.body.phone : "" */,
    state: req.body.state /* ? req.body.state : "" */,
    nationalId: req.body.nationalId /*? req.body.nationalId : "" */
  };
  user.updateProfile(profile.username, profile, response => {
    if (response) {
      console.log("passed updateprofile method");
      res.json({
        message: response + " row(s) affected. Profile successfully updated"
      });
    } else {
      console.log("Put: Could not update profile");
      res.json({ errMessage: "Could not update profile from server" });
    }
  });
});
//get project page
// router.get("/project/:projectdata", (req, res, next) => {});

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
  if (req.session.userid) {
    let proj = {
      title: req.body.title,
      details: req.body.details,
      address: req.body.address,
      city: req.body.city,
      maxworkers: parseInt(req.body.maxworkers, 10),
      postedby: req.session.userid
    };
    project.addProject(proj, projectdata => {
      if (projectdata) {
        res.json({ success: "Project has been Submitted!" });
      } else {
        res.json({ message: "Could not add project" });
      }
    });
  } else {
    res.redirect("/login");
  }
});

//login Post
router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  if (username && password) {
    user.login(username, password, id => {
      if (id) {
        //on login, make a session
        // req.session.name = userdata.first_name + " " + userdata.last_name;
        req.session.userid = id;
        res.json({
          redirect_path: "/profile"
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
  user.createProfile(userObj, data => {
    console.log("register user: " + data);
    if (data) {
      console.log(data + " user created");
      res.json({
        status: "Registeration Successful",
        redirect_path: "/login"
      });
    } else {
      console.log("Error: Unable to create user");
      res.json({ message: "Sorry! This User already exists" });
    }
  });
});

// Get logout page
router.get("/logout", (req, res, next) => {
  // Check if the session is exist
  if (req.session.userid) {
    // destroy the session and redirect the user to the index page.
    req.session.destroy(function() {
      res.redirect("/");
    });
  }
});

module.exports = router;
