import * as functions from "./functions.js";
import * as myform from "./forms.js";
// const forms = require("./forms");
const usersession = new myform.UserSession();

usersession.loginData(function(userSessionName) {
  if (userSessionName) {
    console.log("i got it: " + userSessionName);
  }
});

if (document.getElementById("form")) {
  const form = {
    signupForm: document.getElementById("form"),
    fname: document.getElementById("reg_firstname"),
    lname: document.getElementById("reg_lastname"),
    user: document.getElementById("reg_username"),
    email: document.getElementById("reg_email"),
    password: document.getElementById("reg_password"),
    password_match: document.getElementById("reg_conf_password"),
    formName: document.forms.namedItem("form")
  };

  document.getElementById("form").addEventListener("submit", e => {
    e.preventDefault();
    usersession.signupData(form);
  });
}
usersession.signupData();
// if (isSession) {
//
// }
// if (document.querySelector(".signin-link")) {
//   console.log("what is your problem");
//   let userLink = document.querySelector(".signin-link");
//   userLink.textContent = "";
//   userLink.removeAttribute("href");
//   let userIcon = document.createElement("i");
//   userIcon.classList.add("fas", "fa-user", "fa-2x");
//   userLink.appendChild(userIcon);

//   functions.enableSlideMenu(userLink);
//   functions.appendProfileToMobileMenu();
// }
if (document.querySelector(".menu-btn")) {
  functions.menuToggle();
}

if (document.querySelector(".boxes")) {
  let leftbox = document.querySelector(".leftbox");
  let navLinks = document.querySelectorAll(".leftbox nav a");
  let nav = document.querySelector(".rightbox").children;
  let postproject = document.querySelector(".postproject");
  let profile = document.querySelector(".profile");
  let messages = document.querySelector(".messages");
  let rewards = document.querySelector(".rewards");

  navLinks.forEach(link => {
    link.onclick = function(e) {
      e.preventDefault();
      navLinks.forEach(otherlinks => {
        otherlinks.classList.remove("active");
      });
      link.classList.add("active");
      if (link.id === "postproject") {
        for (let i = 0; i < nav.length; i++) {
          nav[i].classList.add("noshow");
        }
        postproject.classList.remove("noshow");
      } else if (link.id === "profile") {
        for (let i = 0; i < nav.length; i++) {
          nav[i].classList.add("noshow");
        }
        profile.classList.remove("noshow");
      } else if (link.id === "messages") {
        for (let i = 0; i < nav.length; i++) {
          nav[i].classList.add("noshow");
        }
        messages.classList.remove("noshow");
      } else if (link.id === "rewards") {
        for (let i = 0; i < nav.length; i++) {
          nav[i].classList.add("noshow");
        }
        rewards.classList.remove("noshow");
      }
    };
  });
}

// fetch("/api", fetchOptions)
//   .then(res => res.json())
//    .then(json =>{
//       console.log(json);
//      })
//   .catch(err => {
//     console.log("fetch failed: " + err);
