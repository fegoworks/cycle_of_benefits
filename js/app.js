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
