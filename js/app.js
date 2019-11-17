// "use strict";
const menuBtn = document.querySelector(".menu-btn");
const menuHeader = document.querySelector(".menu-header");

let showMenu = false;

menuBtn.addEventListener("click", menuToggle);

function menuToggle() {
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
}

//ALERT HANDLER
// put the style contents in a style sheet and add just classes instead
let alertInfo = "";
alertInfo = "sup victoria";

let alertDiv = document.createElement("div");
alertDiv.classList.add("alert-info");
alertDiv.append(document.createTextNode(alertInfo));

// Alert Close button
let closeButton = document.createElement("button");
closeButton.classList.add("close-button");
closeButton.append(document.createTextNode("close"));
alertDiv.appendChild(closeButton);

closeButton.onclick = closeAlert;

// Add alert info div based on form events from login and signup pages
function addAlert(msg, color) {
  document.body.appendChild(alertDiv);
}
// close alert
function closeAlert() {
  alertDiv.style.display = "none";
}
