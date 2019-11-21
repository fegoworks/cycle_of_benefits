import * as functions from "./functions.js";

/* Form validation*/
if (document.getElementById("form")) {
  let signupForm = document.getElementById("form");

  signupForm.onclick = retrieveData;

  // if element exists on the page
  let fname = document.forms.namedItem("signupform").first_name.value;
  //   console.log(fname);
  let lname = document.forms.namedItem("signupform").last_name.value;
  let user = document.forms.namedItem("signupform").username.value;
  let email = document.forms.namedItem("signupform").email.value;
  let password = document.forms.namedItem("signupform").password.value;
  let password_match = document.forms.namedItem("signupform").confirm_password
    .value;

  console.log(email);
  function validateSignupForm() {
    if (password !== password_match) {
      functions.displayAlert("Passwords do not match", "error");
    }
  }

  function retrieveData() {
    event.preventDefault();
    if (lname == "") {
      functions.displayAlert("No name provided", "info");
    }
    //validate input
    // if (validateSignupForm) {
    // submit data to server
    // submitData(fname, lname, user, email, password);
    // }
  }

  function submitData(fname, lname, user, email, pass) {
    // if data matches successfully, change signin to user icon
    showUserIcon();
    // call showProfile function
    showProfileMenu();
    // show dropdown div with link to profile (Myprofile)
    showProfileSlideDownMenu();

    return userObj;
    // append
  }
}
