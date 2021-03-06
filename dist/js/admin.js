import * as functions from "./functions.js";
import * as myfetch from "./fetch.js";

const usersession = new myfetch.UserSession();

/* Inputs */
let user_id = document.getElementById("user_id");
let project_id = document.getElementById("project_id");

/* buttons */
let showAllusersBtn = document.getElementById("showAllusers");
let showAllProjectsBtn = document.getElementById("showAllProjects");
// let addProjectPointBtn = document.getElementById("addProjectPoint");
let archiveProjectBtn = document.getElementById("archiveProject");
let showAllRedeemedRewardsBtn = document.getElementById(
  "showAllRedeemedRewards"
);
let RemoveUserBtn = document.getElementById("RemoveUser");
let RemoveProjectBtn = document.getElementById("RemoveProject");

/* Methods */
const showAllusers = () => {};

const archiveProject = id => {
  let url = "/archiveproject";
  const proj = {
    projid: id.value
  };
  let options = {
    method: "DELETE",
    headers: {
      Accept: [
        "application/x-www-form-urlencoded",
        "application/json",
        "text/plain",
        "*/*"
      ],
      "Content-Type": "application/json"
    },
    body: JSON.stringify(proj)
  };

  functions
    .fetchData(url, options)
    .then(data => {
      if (data.errMessage) {
        functions.displayAlert(data.errMessage, "error");
      } else {
        functions.displayAlert(data.message, "success");
      }
    })
    .catch(err => console.log(err));
};

const showAllRedeemedRewards = () => {
  let url = "/showrewards";
  let options = {
    method: "GET",
    headers: {
      Accept: [
        "application/x-www-form-urlencoded",
        "application/json",
        "text/plain",
        "*/*"
      ],
      "Content-Type": "application/json"
    }
  };

  functions
    .fetchData(url, options)
    .then(data => {
      if (data.errMessage) {
        functions.displayAlert(data.errMessage, "error");
      } else {
        functions.displayAlert("Rewards Display coming soon", "success");
      }
    })
    .catch(err => console.log(err));
};

const RemoveUser = id => {
  let url = "/removeuser";
  const user = {
    userid: id.value
  };
  let options = {
    method: "DELETE",
    headers: {
      Accept: [
        "application/x-www-form-urlencoded",
        "application/json",
        "text/plain",
        "*/*"
      ],
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  };
  functions
    .fetchData(url, options)
    .then(data => {
      if (data.errMessage) {
        functions.displayAlert(data.errMessage, "error");
      } else {
        functions.displayAlert(data.message, "success");
      }
    })
    .catch(err => console.log(err));
};

const RemoveProject = id => {
  let url = "/removeproject";
  const project = {
    projid: id.value
  };
  let options = {
    method: "DELETE",
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

  functions
    .fetchData(url, options)
    .then(data => {
      if (data.errMessage) {
        functions.displayAlert(data.errMessage, "error");
      } else {
        functions.displayAlert(data.message, "success");
      }
    })
    .catch(err => console.log(err));
};

showAllProjectsBtn.onclick = () => {
  window.location.assign("/projects");
};

showAllRedeemedRewardsBtn.onclick = showAllRedeemedRewards;
// showAllusersBtn.onclick = showAllusers;
RemoveProjectBtn.onclick = () => {
  if (project_id.value) {
    RemoveProject(project_id);
  } else {
    functions.displayAlert("Enter id", "info");
  }
};
archiveProjectBtn.onclick = () => {
  if (project_id.value) {
    archiveProject(project_id);
  } else {
    functions.displayAlert("Enter id", "info");
  }
};

RemoveUserBtn.onclick = () => {
  if (user_id.value) {
    RemoveUser(user_id);
  } else {
    functions.displayAlert("Enter id", "info");
  }
};
