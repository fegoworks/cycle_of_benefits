// import * as functions from "./functions.js";
// import * as server from "../../src/server.js";

const functions = require("./functions");

let newUserObj;
let currentUserObj;
/* Form validation*/
/* Login Form*/
if (document.getElementById("loginform")) {
  let loginForm = document.getElementById("loginform");
  let username = document.getElementById("username");
  let password = document.getElementById("password");

  loginForm.onsubmit = function() {
    event.preventDefault();
    if (username.value === "" || password.value === "") {
      functions.displayAlert("Incorrect login credentials !", "error");
      clearFormFields(loginForm);
    } else {
      currentUserObj = {
        username: username.value,
        password: password.value
      };
    }
  };
}

/* Signup Form*/
if (document.getElementById("form")) {
  let signupForm = document.getElementById("form");
  let regForm = document.forms.namedItem("signupform");
  // if element exists on the page
  let fname = document.getElementById("reg_firstname");
  let lname = document.getElementById("reg_lastname");
  let user = document.getElementById("reg_username");
  let email = document.getElementById("reg_email");
  let password = document.getElementById("reg_password");
  let password_match = document.getElementById("reg_conf_password");

  signupForm.onsubmit = function() {
    event.preventDefault();
    retrieveData();
    //clearFormFields(regForm);
  };

  function validateSignupForm() {
    if (
      user.value === "" ||
      lname.value === "" ||
      fname.value === "" ||
      email.value === ""
    ) {
      functions.displayAlert(
        "Please provide all required information!",
        "info"
      );
      clearFormFields(regForm);

      return false;
    } else if (password.value !== password_match.value) {
      functions.displayAlert("Passwords do not match", "error");
      //clearFormFields(regForm);
      return false;
    }
  }

  function retrieveData() {
    validateSignupForm();
    // submit data to server
    newUserObj = submitData(
      fname.value,
      lname.value,
      user.value,
      email.value,
      password.value
    );
  }
}

function clearFormFields(formID) {
  let element = formID.elements;
  for (let i = 0; i < element.length - 1; i++) {
    element[i].value = "";
  }
}

function submitData(fname = "", lname = "", user = "", email = "", pass = "") {
  let userObj = {
    fname: fname,
    lname: lname,
    user: user,
    email: email,
    pass: pass
  };
  return userObj;
}

module.exports = { newUserObj, submitData, currentUserObj };
