import * as functions from "./functions.js";

/* Form validation*/
async function fetchData(url, options) {
  const rawResponse = await fetch(url, options);
  const jsonData = await rawResponse.json();
  return jsonData;
}

/* Login Form*/
if (document.getElementById("loginform")) {
  // if element exists on the page
  let loginForm = document.getElementById("loginform");
  let username = document.getElementById("username");
  let password = document.getElementById("password");

  loginForm.addEventListener("submit", e => {
    e.preventDefault(); //ignores the default submit behaviour through action
    let url = loginForm.getAttribute("action")
      ? "/submitlogin"
      : "/cannotgetposturl";
    if (username.value === "" || password.value === "") {
      functions.displayAlert("Enter your login information!", "info");
      return false;
    } else {
      //retrieve user data
      const user = {
        username: username.value,
        password: password.value
      };
      const fetchOptions = {
        method: "POST",
        headers: {
          Accept: [
            "application/x-www-form-urlencoded",
            "application/json",
            "text/plain",
            "*/*"
          ],
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      };
      fetchData(url, fetchOptions)
        .then(data => {
          if (!data.redirect_path) {
            console.log("inside fetch function: " + data.message);
            functions.displayAlert(
              "Username or Password not correct!",
              "error"
            );
            clearFormFields(loginForm);
          } else {
            console.log(data);
            functions.displayAlert("Login Successful!", "success");
            console.log(
              "Success: Don't need to fetch data" + data.redirection_path
            );
            clearFormFields(loginForm);
            //get data and send to
            if (confirm("Go to your profile?")) {
              window.location.assign(data.redirect_path);
              functions.showUserIcon(data.firstname);
            } else {
              window.location.assign("/");
            }
          }
        })
        .catch(error => console.error("Fetch Error: ", error));
    }
  });
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
