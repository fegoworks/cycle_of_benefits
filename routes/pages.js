const express = require("express");
const path = require("path");
const User = require("../persistence/user");
const Project = require("../persistence/project");
const router = express.Router();

const user = new User();
const project = new Project();

//get index page
router.get("/", (req, res, next) => {
  console.log(req.session.userid + ": " + req.session.cookie.maxAge);
  res.render("index");
});

router.get("/usersession", (req, res) => {
  if (req.session.userid) {
    res.json({ session: req.session.userid });
    return;
  }
  res.json({ errMessage: "Session expired, Login" });
});

router.get("/projects", (req, res) => {
  res.render("projects");
});

router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res, next) => {
  if (!req.session.userid) {
    res.render("login");
    return;
  }
  res.redirect("/profile");
});

router.get("/project:id", (req, res, next) => {
  const proj_id = req.params.id;
  project.getProject(proj_id, data => {
    if (data) {
      res.render("viewproject", {
        id: data.projId ? data.projId : "",
        title: data.proj_title ? data.proj_title : "",
        details: data.proj_details ? data.proj_details : "",
        location:
          data.proj_address + ", " + data.proj_city
            ? data.proj_address + ", " + data.proj_city
            : "",
        status: data.proj_status ? data.proj_status : "",
        worth: data.reward_points ? data.reward_points : 0,
        tools: data.proj_tools ? data.proj_tools : "",
        current: data.current_workers ? data.current_workers : 0,
        maxworkers: data.max_no_workers ? data.max_no_workers : 1,
        postedby: data.posted_by ? data.posted_by : ""
      });
      return;
    }
    console.log("Project exists in Database but without parameter");
    res.redirect("/projects");
  });
});

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
      console.log(response + "row(s) affected.");
      res.json({
        message: "Profile successfully updated"
      });
    } else {
      console.log("Put: Could not update profile");
      res.json({ errMessage: "Could not update profile from server" });
    }
  });
});

//Load Projects
router.get("/allprojects", (req, res) => {
  project.allProjects(data => {
    if (data) {
      res.json(data.recordset);
      return;
    }
    res.json({ errMessage: "Could not retrieve project data" });
  });
});

/* Add user and project to worklist */
router.post("/enlist", (req, res) => {
  if (req.session.userid) {
    const proj = {
      userid: req.session.userid,
      projid: req.body.projid,
      current: req.body.current,
      max: req.body.max,
      status: req.body.status
    };

    project.enlistWorker(proj.userid, proj.projid, rows => {
      if (rows) {
        //if user is successfully added to list of workers
        res.json({ message: "You have been enlisted successfully" });
        return;
      }
      res.json({ errMessage: "Sorry, could not insert into worklist" });
    });
  }
});

router.put("/currentworkers", (req, res) => {
  if (req.session.userid) {
    const userProj = {
      userid: req.session.userid,
      projid: req.body.projid /* ? req.body.projid : "" */
    };
    //getProject
    project.getProject(userProj.projid, projrecord => {
      if (projrecord) {
        //check worklist table
        project.checkWorklist(
          projrecord.projId,
          userProj.userid,
          noduplicate => {
            if (noduplicate) {
              project.updateCurrentWorker(projrecord, result => {
                if (result) {
                  res.json({ message: "All clear for enlisting" });
                } else {
                  res.json({
                    errMessage: "Sorry, This Project has already been assigned!"
                  });
                }
              });
            } else {
              res.json({
                errMessage:
                  "You have already been listed as a worker for this project!"
              });
            }
          }
        );
      } else {
        res.json({ errMessage: "Project record not found" });
      }
    });
  } else {
    res.json({ errMessage: "you must be logged in to enlist" });
  }
});

//project view post
router.post("/projectview", (req, res, next) => {
  console.log("Project_id: " + req.body.id);
  project.findProject(req.body.id, req.body.postedby, projid => {
    if (projid) {
      res.json({
        redirect_path: "/project" + projid
      });
    } else {
      res.json({ errMessage: "Cannot find project" });
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
        res.status(404).json({ errMessage: "Login Failed" });
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

router.get("/login-check", (req, res) => {
  if (req.session.userid) {
    res.redirect("/profile");
  } else {
    res.redirect("/login");
  }
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
