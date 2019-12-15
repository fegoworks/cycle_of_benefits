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

  if (type === "error") {
    parag.style.background = "red";
  } else if (type === "info") {
    parag.style.background = "blue";
  } else if (type === "success") {
    parag.style.background = "green";
  }

  if (
    document.querySelector(".modal") &&
    document.querySelector(".alert-box")
  ) {
    let modal = document.querySelector(".modal");
    let alertBox = document.querySelector(".alert-box");
    alertBox.appendChild(parag);
    modal.appendChild(alertBox);
  } else {
    // background
    let modal = document.createElement("div");
    modal.classList.add("modal");
    let alertBox = document.createElement("div");
    alertBox.classList.add("alert-box");
    alertBox.appendChild(parag);
    modal.appendChild(alertBox);
    document.body.appendChild(modal);
  }
  closeButton.onclick = function() {
    let modal = document.querySelector(".modal");
    let alertBox = document.querySelector(".alert-box");
    alertBox.removeChild(parag);
    // modal.removeChild(alertBox);
    if (document.querySelectorAll(".p-info").length == 0) {
      // alertBox.removeChild(parag);
      document.body.removeChild(modal);
      // alertBox.style.display = "none";
    }
    // if(alert)
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

function enableSlideMenu(userIcon) {
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

  userIcon.onclick = function() {
    if (!dropdown) {
      userIcon.classList.add("enable-slide");
      profileDiv.classList.add("slide-down");

      //reset Menu State
      dropdown = true;
    } else {
      userIcon.classList.remove("enable-slide");
      profileDiv.classList.remove("slide-down");

      //reset Menu State
      dropdown = false;
    }
  };
}

export { menuToggle, displayAlert, appendProfileToMobileMenu, enableSlideMenu };
