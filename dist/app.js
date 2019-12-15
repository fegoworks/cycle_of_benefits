import * as functions from "./functions.js";
import * as myform from "./forms.js";

const usersession = new myform.UserSession();
/* Menu Button Toggler */
if (document.querySelector(".menu-btn")) {
  functions.menuToggle();
}

/* Display profile styles */
if (document.querySelector(".signin-link")) {
  //fetch user session to display styles
  if (checkUserSession) {
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

/* Login and View Profile */
if (document.getElementById("loginform")) {
  const form = {
    loginForm: document.getElementById("loginform"),
    username: document.getElementById("username"),
    password: document.getElementById("password"),
    formName: document.forms.namedItem("loginform")
  };

  form.loginForm.addEventListener("submit", e => {
    e.preventDefault(); //ignores the default submit behaviour through action
    usersession.loginUser(form, function(profileUrl) {
      if (profileUrl) {
        functions.displayAlert("Login Successful!", "success");
        window.location.replace(profileUrl);
      }
    });
  });
}

/* Signup */
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

/* Edit Profile */
if (document.querySelector(".profile")) {
  let editBtn = document.querySelector("#edit-button");
  let saveChanges = document.querySelector("#save_changes");
  let profileForm = document.getElementById("profile-form");
  let formName = document.forms.namedItem("profile-form");

  let inputFields = Array.from(
    profileForm.querySelectorAll(
      "input[type=text], input[type=date], input[type=email]"
    )
  ).slice(1);
  let initialValues = [];
  let editToggle = false;
  saveCurrentData(initialValues);
  //Edit Profile
  editBtn.onclick = editable;

  function editable() {
    //put form values in array
    if (!editToggle) {
      for (let i = 0; i < inputFields.length; i++) {
        inputFields[i].classList.add("edit-profile");
        inputFields[i].removeAttribute("readonly");
      }
      saveChanges.removeAttribute("disabled");
      editToggle = true;
    } else {
      for (let i = 0; i < inputFields.length; i++) {
        inputFields[i].classList.remove("edit-profile");
        inputFields[i].setAttribute("readonly", true);
      }
      saveChanges.setAttribute("disabled", true);
      editToggle = false;
    }
  }
  /* Reset fields */
  let resetBtn = document.getElementById("reset_button");
  resetBtn.onclick = () => {
    if (initialValues.length > 0) {
      // if (confirm("Are You sure you want to rest changes?")) {
      for (let i = 0; i < initialValues.length; i++) {
        formName.elements[i].value = initialValues[i];
      }
      saveChanges.setAttribute("disabled", true);
      editToggle = false;
      clearCurrentData();
    }
  };

  //Save changes
  profileForm.addEventListener("submit", e => {
    e.preventDefault();
    const form = {
      username: document.getElementById("edit_username"),
      fname: document.getElementById("edit_firstname"),
      lname: document.getElementById("edit_lastname"),
      email: document.getElementById("edit_email"),
      dob: document.getElementById("edit_dob"),
      address: document.getElementById("edit_address"),
      phone: document.getElementById("edit_phone"),
      state: document.getElementById("edit_state"),
      nationalId: document.getElementById("edit_national_id")
    };
    usersession.updateProfile(form, response => {
      if (!response) {
        functions.displayAlert("Could not update profile", "error");
      } else {
        functions.displayAlert(response, "success");
        clearCurrentData();
        saveCurrentData(initialValues);
        editToggle = false;
        editable();
      }
    });
    // for (let i = 0; i < formName.elements.length - 1; i++) {
    //   formName.elements[i].setAttribute = "readonly";
    //   /* formName.elements[i].textContent =  */
    // }
  });

  /* Functions */
  function saveCurrentData(array) {
    for (let i = 0; i < formName.elements.length - 1; i++) {
      array.push(formName.elements[i].value); // || "disabled";
    }
  }

  function clearCurrentData() {
    initialValues = [];
  }
}

/*  User profile */
if (document.querySelector(".boxes")) {
  // let leftbox = document.querySelector(".leftbox");
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

/* Load all projects */
if (document.querySelector(".projects")) {
  /* create dynamic contents */
  const ProjectList = [];
  function appendProjects(recordset) {
    let pill = document.querySelector(".project-pills");
    let project_ = document.createElement("li");
    project_.classList.add("project_");

    let proj_id = document.createElement("div");
    proj_id.classList.add("project-id");
    let proj_title = document.createElement("div");
    proj_title.classList.add("project-title");
    let proj_worth = document.createElement("div");
    proj_worth.classList.add("project-worth");
    let proj_posted = document.createElement("div");
    proj_posted.classList.add("project-posted");
    let proj_status = document.createElement("div");
    proj_status.classList.add("project-status");
    let proj_workers = document.createElement("div");
    proj_workers.classList.add("project-workers");
    let proj_current_workers = document.createElement("span");
    proj_current_workers.classList.add("current");
    let proj_total_workers = document.createElement("span");
    proj_total_workers.classList.add("total");
    let proj_button = document.createElement("div");
    proj_button.classList.add("project-button");
    let input = document.createElement("input");
    input.classList.add("my-btn");
    input.setAttribute("type", "button");
    input.setAttribute("value", "View");

    /* Add text contents */
    proj_id.appendChild(document.createTextNode(recordset.projId));
    proj_title.appendChild(document.createTextNode(recordset.proj_title));
    proj_status.appendChild(document.createTextNode(recordset.proj_status));
    proj_worth.appendChild(document.createTextNode(recordset.reward_points));
    proj_current_workers.appendChild(
      document.createTextNode(
        recordset.current_workers ? recordset.current_workers : 0 + "/"
      )
    );
    proj_total_workers.appendChild(
      document.createTextNode(
        recordset.max_no_workers ? recordset.max_no_workers : 0
      )
    );

    proj_workers.append(proj_current_workers);
    proj_workers.append(proj_total_workers);
    proj_posted.appendChild(document.createTextNode(recordset.posted_by));
    proj_button.appendChild(input);

    /* Append to project group */
    project_.appendChild(proj_id);
    project_.appendChild(proj_title);
    project_.appendChild(proj_status);
    project_.appendChild(proj_worth);
    project_.appendChild(proj_workers);
    project_.appendChild(proj_posted);
    project_.appendChild(proj_button);

    pill.appendChild(project_);
    // document.body.appendChild("pill");
  }
  // fetch data
  fetch("/allprojects", {
    method: "Get",
    headers: {
      Accept: [
        "application/x-www-form-urlencoded",
        "application/json",
        "text/plain",
        "*/*"
      ],
      "Content-Type": "application/json"
    }
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      if (data) {
        for (let i = 0; i < data.length; i++) {
          appendProjects(data[i]);
        }
        viewProject();
      } else {
        functions.displayAlert(data.errMessage, "error");
      }
    })
    .catch(err => {
      console.log("Fetch Error: All projects: " + err);
    });

  /* view Project page */
  function viewProject() {
    let projectRow = document.querySelectorAll(".project_");
    console.log(projectRow.length);
    let projectBtn = document.querySelectorAll(".project-button > input");
    let projectId = document.querySelectorAll(".project-id");
    let postedBy = document.querySelectorAll(".project-posted");
    //set static url
    for (let i = 0; i < projectRow.length; i++) {
      projectBtn[i].onclick = function() {
        usersession.viewProject(projectId[i], postedBy[i], data => {
          if (data) {
            window.location.assign(data);
          }
        });
      };
    }
  }
}

/* Post project */
if (document.querySelector("#post_project")) {
  const form = {
    projectform: document.getElementById("post_project"),
    projectTitle: document.getElementById("proj_title"),
    projectDetails: document.getElementById("proj_details"),
    projectAddress: document.getElementById("proj_address"),
    projectCity: document.getElementById("proj_city"),
    projectWorkers: document.getElementById("proj_max_workers"),
    formName: document.forms.namedItem("post_project")
  };

  form.projectform.addEventListener("submit", e => {
    e.preventDefault();
    usersession.addProject(form);
  });
}

/* Update Project */
if (document.querySelector("#project")) {
  let submitInterest = document.getElementById("interest");

  const form = {
    projectform: document.getElementById("project-form"),
    id: document.getElementById("view_id"),
    status: document.getElementById("view_status"),
    current: document.getElementById("view_current_workers"),
    max: document.getElementById("view_no_of_workers")
  };

  form.projectform.onsubmit = function(e) {
    e.preventDefault();
    usersession.enlistUser(form, data => {
      if (data) {
      }
    });
  };
}
// let id = document.getElementById("view_id");
// console.log(id.value);
async function fetchData(url, options) {
  const rawResponse = await fetch(url, options);
  const jsonData = await rawResponse.json();
  return jsonData;
}

function checkUserSession() {
  fetch("/usersession")
    .then(response => {
      return response.json();
    })
    .then(data => {
      if (data.session) {
        return true;
      }
      return false;
      // functions.displayAlert(data.errMessage, "info");
    });
}
