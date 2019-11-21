//Alert Display
let alertDiv = document.createElement("div");
alertDiv.classList.add("alert-info");
let alertsCount = 0;

function displayAlert(msg, type) {
  alertsCount = alertsCount + 1;
  let parag = document.createElement("p");
  parag.classList.add("p-info");
  parag.append(document.createTextNode(msg));

  // Alert Close button
  let closeButton = document.createElement("button");
  closeButton.classList.add("close-button");
  closeButton.append(document.createTextNode("close"));
  parag.appendChild(closeButton);
  // alertDiv.appendChild(closeButton);

  if (type === "error") {
    parag.style.background = "red";
  } else if (type === "info") {
    parag.style.background = "blue";
  } else if (type === "success") {
    parag.style.background = "green";
  }

  alertDiv.append(parag);
  document.body.appendChild(alertDiv);

  closeButton.onclick = function() {
    alertsCount--;
    parag.style.display = "none";
    if (alertsCount === 0) {
      // document.body.removeChild(alertDiv);
      alertDiv.style.display = "none";
    }
  };
}

function showProfileMenu() {
  // show icon when user is logged in successfully
  let ul = document.querySelector(".menu-list");
  let listItem = document.createElement("li");
  let a = document.createElement("a");
  a.setAttribute("href", "/index.html");
  a.classList.add("menu-item");
  a.textContent = "Sign Out";

  listItem.appendChild(a);
  ul.appendChild(listItem);
  let navItem = document.querySelectorAll(".menu-item");
  navItem[3].setAttribute("href", "/userprofile.html");
  navItem[3].textContent = "My Profile";
  console.log(navItem[4]);
}

function showUserIcon() {
  // show icon when user is logged in successfully

  let signinLink = document.querySelector(".signin-link");
  signinLink.textContent = "";
  signinLink.removeAttribute("href");
  let userIcon = document.createElement("i");
  userIcon.classList.add("fas", "fa-user", "fa-2x");
  signinLink.appendChild(userIcon);
}

function showProfileSlideDownMenu() {
  // show slidedown menu for screens more than 900px
  //needs to call showUserIcon();
  let userIcon = document.querySelector(".signin-link");
  let profileDiv = document.createElement("div");
  profileDiv.classList.add("profile-div");
  let ul = document.createElement("ul");

  let profile = document.createElement("li");
  let profileLink = document.createElement("a");
  profileLink.setAttribute("href", "/userprofile.html");
  profileLink.textContent = "My Profile";
  profile.appendChild(profileLink);

  let signout = document.createElement("li");
  let signoutLink = document.createElement("a");
  signoutLink.setAttribute("href", "/message.html");
  signoutLink.classList.add();
  signoutLink.textContent = "Log Out";
  signout.appendChild(signoutLink);

  ul.appendChild(profileLink);
  ul.appendChild(signoutLink);
  profileDiv.appendChild(ul);
  document.body.appendChild(profileDiv);

  let dropdown = false;

  userIcon.onclick = function() {
    if (!dropdown) {
      userIcon.classList.add("slide-up");
      profileDiv.classList.add("slide-down");

      //reset Menu State
      dropdown = true;
    } else {
      userIcon.classList.remove("slide-up");
      profileDiv.classList.remove("slide-down");

      //reset Menu State
      dropdown = false;
    }
  };
}

export {
  displayAlert,
  showProfileMenu,
  showUserIcon,
  showProfileSlideDownMenu
};
// create an i element, attache a class of "fas fa-user-tie"
//create a dropdown div for wider screens(>600px), include a ul with two list items: profile and signout
// };
