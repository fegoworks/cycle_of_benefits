import * as functions from "./functions.js";
import * as myform from "./forms.js";

const usersession = new myform.UserSession();

// on login page
if (document.getElementById("loginform")) {
  const form = {
    loginForm: document.getElementById("loginform"),
    username: document.getElementById("username"),
    password: document.getElementById("password"),
    formName: document.forms.namedItem("loginform")
  };

  form.loginForm.addEventListener("submit", e => {
    e.preventDefault(); //ignores the default submit behaviour through action
    usersession.loginUser(form, function(userSessionData) {
      if (userSessionData) {
        console.log("i got it: " + userSessionData.first_name);
        if (confirm("Go to your profile?")) {
          //send data to profile page
          window.location.replace(data.redirect_path);
        } else {
          window.location.assign("/");
        }
      }
    });
  });
}

//on signup page
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
    usersession.signupUser(form);
  });
}

//pass session variable here to load user data on profile page
if (document.querySelector(".signin-link")) {
  if (usersession.getCurrentUser()) {
    console.log("what is your problem");
    let userLink = document.querySelector(".signin-link");
    userLink.textContent = "";
    userLink.removeAttribute("href");
    let userIcon = document.createElement("i");
    userIcon.classList.add("fas", "fa-user", "fa-2x");
    userLink.appendChild(userIcon);

    functions.enableSlideMenu(userLink);
    functions.appendProfileToMobileMenu();
  }
}

if (document.querySelector(".menu-btn")) {
  functions.menuToggle();
}

// user profile
if (document.querySelector(".boxes")) {
  let leftbox = document.querySelector(".leftbox");
  let navLinks = document.querySelectorAll(".leftbox nav a");
  let nav = document.querySelector(".rightbox").children;
  let postproject = document.querySelector(".postproject");
  let profile = document.querySelector(".profile");
  let messages = document.querySelector(".messages");
  let rewards = document.querySelector(".rewards");

  //stacked divs display function
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

async function fetchData(url, options) {
  const rawResponse = await fetch(url, options);
  const jsonData = await rawResponse.json();
  return jsonData;
}

// let projectNumber = document.querySelectorAll(".project-number");
// console.log(projectNumber[3].textContent);
//projects page
if (document.querySelector(".projects")) {
  let projectRow = document.querySelectorAll(".project_");
  let projectBtn = document.querySelectorAll("project-button");
  let projectNumber = document.querySelectorAll(".project-number");
  let projectTitle = document.querySelectorAll(".project-title");
  let projectDesc = document.querySelectorAll(".project-desc");
  let projectStatus = document.querySelectorAll(".project-status");
  let projectWorkers = document.getElementsByClassName("project-workers");
  // let currentWorkers = projectWorkers[i].querySelectorAll(".current-workers");
  // let totalWorkers = projectWorkers[i].querySelectorAll(".current-workers");

  //set static url
  let url = "/viewproject";

  for (let i = 0; i < projectRow.length; i++) {
    projectBtn[i].onclick = function() {
      //fetch project data
      const project = {
        number: projectNumber[i].textContent,
        title: projectTitle[i].textContent,
        desc: projectDesc[i].textContent,
        status: projectStatus[i].textContent,
        workers: projectNumber[i].textContent
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
        body: JSON.stringify(project)
      };

      fetch(url, fetchOptions).then(rawResponse => rawResponse.json());

      window.location.assign(`/id=?${projectId}`);
    };
  }
}
