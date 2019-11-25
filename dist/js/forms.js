import * as functions from "./functions.js";

let newUserObj;
let currentUserObj;
/* Form validation*/
/* Login Form*/
if (document.getElementById("loginform")) {
  // if element exists on the page
  let loginForm = document.getElementById("loginform");
  let username = document.getElementById("username");
  let password = document.getElementById("password");

  loginForm.onsubmit = function(e) {
    e.preventDefault();
    if (username.value === "" || password.value === "") {
      functions.displayAlert("Enter your login information!", "info");
    } else {
      let userObj = {
        username: username.value,
        password: password.value
      };
      const fetchOptions = {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userObj)
      };

      fetchData()
        .then(res => {})
        .catch(err => {
          console.log("fetch error: " + err);
        });

      async function fetchData() {
        const response = await fetch("/login", fetchOptions);
        const jsonData = await response.json();
        console.log(jsonData.status);
        if (jsonData.status === "error") {
          functions.displayAlert("Username or Email not found!", "error");
          clearFormFields(loginForm);
        } else if (jsonData.status === "success") {
          functions.displayAlert("Login Successful!", "success");
        }
      }
    }
  };
}

/* Signup Form*/
if (document.getElementById("form")) {
  // if element exists on the page
  let signupForm = document.getElementById("form");
  let regForm = document.forms.namedItem("signupform");
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

export { newUserObj, submitData, currentUserObj };
