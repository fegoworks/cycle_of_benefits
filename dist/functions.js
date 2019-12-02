// import * as forms from "./forms.js";
// const usersession = new forms.UserSession();

function menuToggle() {
  /* Toggle Menu*/
  const menuBtn = document.querySelector(".menu-btn");
  const menuHeader = document.querySelector(".menu-header");

  let showMenu = false;
  menuBtn.onclick = function() {
    if (!showMenu) {
      menuBtn.classList.add("close");
      menuHeader.classList.add("show");

      //reset Menu State
      showMenu = true;
    } else {
      menuBtn.classList.remove("close");
      menuHeader.classList.remove("show");

      //reset Menu State
      showMenu = false;
    }
  };
}

function displayAlert(msg, type) {
  //Alert Display
  let parag = document.createElement("p");
  parag.classList.add("p-info");
  parag.append(document.createTextNode(msg));

  // Alert Close button
  let closeButton = document.createElement("button");
  closeButton.classList.add("close-button");
  closeButton.append(document.createTextNode("X"));
  parag.append(closeButton);
  // alertDiv.appendChild(closeButton);

  if (type === "error") {
    parag.style.background = "red";
  } else if (type === "info") {
    parag.style.background = "blue";
  } else if (type === "success") {
    parag.style.background = "green";
  }

  if (document.getElementById("alert-info")) {
    let alertDiv = document.getElementById("alert-info");
    alertDiv.appendChild(parag);
  } else {
    let alertDiv = document.createElement("div");
    alertDiv.classList.add("alert-info");
    alertDiv.setAttribute("id", "alert-info");
    alertDiv.appendChild(parag);
    document.body.appendChild(alertDiv);
  }
  closeButton.onclick = function() {
    // parag.style.display = "none";
    let alertDiv = document.getElementById("alert-info");
    alertDiv.removeChild(parag);
    if (document.getElementsByClassName("p-info").length == 0) {
      document.body.removeChild(alertDiv);
      // alertDiv.style.display = "none";
    }
  };
}

function appendProfileToMobileMenu() {
  // show icon when user is logged in successfully
  let menuItem = document.querySelectorAll(".menu-item");
  //grab and change the sign in list item to my profile
  menuItem[3].setAttribute("href", "./profile");
  menuItem[3].textContent = "My Profile";

  //append signout menu
  let menuList = document.querySelector(".menu-list");
  let signoutMenu = document.createElement("li");
  let signoutLink = document.createElement("a");
  signoutLink.setAttribute("href", "./logout");
  signoutLink.classList.add("menu-item"); //add existing class
  signoutLink.textContent = "Sign Out";

  signoutMenu.appendChild(signoutLink);
  menuList.appendChild(signoutMenu);
}

function enableSlideMenu(userIconLink) {
  //called by showUserIcon();
  //create a new div
  let profileDiv = document.createElement("div");
  profileDiv.classList.add("profile-div"); //add existing class
  let ul = document.createElement("ul");

  let profile = document.createElement("li");
  let profileLink = document.createElement("a");
  profileLink.setAttribute("href", "/profile");
  profileLink.textContent = "My Profile";
  profile.appendChild(profileLink);

  let signout = document.createElement("li");
  let signoutLink = document.createElement("a");
  signoutLink.setAttribute("href", "/logout");
  signoutLink.textContent = "Log Out";
  signout.appendChild(signoutLink);

  ul.appendChild(profileLink);
  ul.appendChild(signoutLink);
  profileDiv.appendChild(ul);
  document.body.appendChild(profileDiv);

  let dropdown = false;

  userIconLink.onclick = function() {
    if (!dropdown) {
      userIconLink.classList.add("enable-slide");
      profileDiv.classList.add("slide-down");

      //reset Menu State
      dropdown = true;
    } else {
      userIconLink.classList.remove("enable-slide");
      profileDiv.classList.remove("slide-down");

      //reset Menu State
      dropdown = false;
    }
  };
}

// function showUserIcon() {
// show icon when user is logged in successfully

// }
// }

//function that connects to the data base and retrieve project information appends as a div to the list of project

//function that loads all project data on request through the projects.html url

//a project button functionality that when clicked loads projectpage.html of the corrresponding project

//a userprofile page with navigation links at the left
//--post project
//--my messages
//--my Profile userprofile

export { menuToggle, displayAlert, appendProfileToMobileMenu, enableSlideMenu };
// create an i element, attache a class of "fas fa-user-tie"
//create a dropdown div for wider screens(>600px), include a ul with two list items: profile and signout
// };
