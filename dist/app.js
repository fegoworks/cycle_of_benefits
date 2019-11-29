import * as functions from "./functions.js";
import * as forms from "./forms.js";
// import * as server from "../../src/server.js";

if (document.querySelector(".menu-btn")) {
  functions.menuToggle();
}
// let check = document.querySelector("button#check");
// check.onclick = function(e) {
//   e.preventDefault();
//   let a = "";
//   for (let i = 0; i < nav.length; i++) {
//     if (nav[i].className !== "profile") {
//       console.log(nav[i].className);
//     }
//   }
//   // alert(a);
// };
if (document.querySelectorAll(".boxes")) {
  let leftbox = document.querySelector(".leftbox");
  let navLinks = document.querySelectorAll(".leftbox nav a");
  let nav = document.querySelectorAll(".rightbox").children;
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
// window.location.assign("userprofile.html");
// ("userprofile.html");
// console.log(myLock);
//send data to server via fetch
const test = {
  name: "cole",
  hobby: "soccer"
};

// const fetchOptions = {
//     method: "post",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify(userObj)
//   };

//   fetchData()
//     .then(res => {})
//     .catch(err => {
//       console.log("fetch error: " + err);
//     });

//   async function fetchData() {
//     const response = await fetch("/submit-login", fetchOptions);
//     const jsonData = await response.json();
//     console.log(jsonData);
//     if (jsonData.status === 404) {
//       functions.displayAlert("Username or Email not found!", "error");
//       clearFormFields(loginForm);
//     } else if (jsonData.status === 200) {
//       functions.displayAlert("Login Successful!", "success");
//     }
//   }
// fetch("/api", fetchOptions)
//   .then(res => res.json())
//    .then(json =>{
//       console.log(json);
//      })
//   .catch(err => {
//     console.log("fetch failed: " + err);
//   });
