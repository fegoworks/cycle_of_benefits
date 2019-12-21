import * as functions from "./functions.js";

function UserSession() {}

/*Fetch Methods*/
UserSession.prototype = {
  Path: {
    path: null,
    set path_(url) {
      this.path = url;
    },
    get path_() {
      return this.path;
    }
  },

  loginUser: function(form, callback) {
    let url = form.loginForm.getAttribute("action")
      ? "/login"
      : "/cannotgetposturl";
    if (form.username.value === "" || form.password.value === "") {
      functions.displayAlert("Enter your login information!", "info");
      return false;
    } else {
      //retrieve user data
      const user = {
        username: form.username.value,
        password: form.password.value
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
        body: JSON.stringify(user)
      };

      fetchData(url, fetchOptions)
        .then(data => {
          if (data.errMessage) {
            console.log("Error: " + data.errMessage);
            functions.displayAlert(
              data.errMessage + ": Username or Password not correct!",
              "error"
            );
          } else {
            console.log(data.redirect_path);
            // console.log(data.userdata);
            clearFormFields(form.formName);
            callback(data.redirect_path);
            this.Path.path_ = data.redirect_path;
          }
          callback(null);
        })
        .catch(error => console.error("HTTP- Error: ", "\n" + error));
    }
  },

  signupUser: function(form) {
    if (form) {
      if (
        !validateSignupForm(form.formName) ||
        form.password.value !== form.password_match.value
      ) {
        functions.displayAlert(
          "Please provide all required information!",
          "error"
        );
        functions.displayAlert("Passwords do not match", "error");
        form.password_match.value = "";
        return false;
      } else {
        let url = form.signupForm.getAttribute("action") || "/submitregister";
        //retrieve user data
        const userobj = {
          username: form.user.value,
          password: form.password.value,
          firstname: form.fname.value,
          lastname: form.lname.value,
          email: form.email.value
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
          body: JSON.stringify(userobj)
        };
        fetchData(url, fetchOptions)
          .then(data => {
            // console.log(data);
            if (!data.redirect_path) {
              functions.displayAlert(
                "Error setting up Account: " + data.message,
                "error"
              );
              form.user.value = "";
              form.password.value = "";
              form.password_match.value = "";
            } else {
              functions.displayAlert(data.status, "success");
              clearFormFields(form.formName);
              //get data and send to
              if (confirm("Sign in?")) {
                window.location.assign(data.redirect_path);
              } else {
                window.location.assign("/");
                return false;
              }
            }
          })
          .catch(err => {
            console.log("fetch failed: " + err);
          });
      }
    }
  },

  addProject: function(form) {
    // validation
    if (!validateSignupForm(form.formName)) {
      functions.displayAlert("Fill all required fields", "error");
      return false;
    } else {
      let url = "/addproject";
      const newProject = {
        title: form.projectTitle.value,
        details: form.projectDetails.value,
        address: form.projectAddress.value,
        city: form.projectCity.value,
        maxworkers: form.projectWorkers.value
      };
      // console.log(newProject);
      const options = {
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
        body: JSON.stringify(newProject)
      };

      fetchData(url, options)
        .then(jsonData => {
          if (jsonData.success) {
            functions.displayAlert(jsonData.success, "success");
            clearFormFields(form.formName);
          } else {
            functions.displayAlert(jsonData.message, "error");
          }
        })
        .catch(error => {
          console.log("post project Fetch error: " + error);
        });
    }
  },

  viewProject: function(projectId, postedBy, callback) {
    //fetch project data
    const project = {
      id: projectId.textContent,
      postedby: postedBy.textContent
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

    let url = "/projectview";
    fetchData(url, fetchOptions)
      .then(data => {
        if (!data.redirect_path) {
          functions.displayAlert(data.errMessage, "info");
          callback(null);
        } else {
          callback(data.redirect_path);
        }
      })
      .catch(err => {
        console.log("project fetch error: " + err);
      });
  },

  updateProfile: function(form, callback) {
    let url = "/updateuser";
    const profile = {
      username: form.username.value,
      fname: form.fname.value,
      lname: form.lname.value,
      email: form.email.value,
      dob: form.dob.value,
      address: form.address.value,
      phone: form.phone.value,
      state: form.state.value,
      nationalId: form.nationalId.value
    };
    const options = {
      method: "PUT",
      headers: {
        Accept: [
          "application/x-www-form-urlencoded",
          "application/json",
          "text/plain",
          "*/*"
        ],
        "Content-Type": "application/json"
      },
      body: JSON.stringify(profile)
    };

    fetchData(url, options)
      .then(data => {
        if (data.message) {
          console.log(data.message);
          callback(data.message);
        } else {
          callback(null);
        }
      })
      .catch(err => {
        console.log("Update Profile: " + err);
      });
  },

  clearPath: function() {
    //clear path
    this.Path.path_ = null;
  },

  enlistWorker: function(form, callback) {
    //fetch project data
    const project = {
      projid: form.id.textContent
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

    let url = "/enlist";
    fetchData(url, fetchOptions)
      .then(data => {
        if (!data.message) {
          functions.displayAlert(data.errMessage, "error");
          callback(null);
        } else {
          callback(data.message);
        }
      })
      .catch(err => {
        console.log("enlist fetch error: " + err);
      });
  },

  incrementWorkers: function(form, callback) {
    const project = {
      projid: form.id.textContent
    };
    const fetchOptions = {
      method: "PUT",
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

    let url = "/currentworkers";
    fetchData(url, fetchOptions)
      .then(data => {
        if (data.errMessage) {
          functions.displayAlert(data.errMessage, "error");
          callback(null);
        } else {
          callback(data.message);
        }
      })
      .catch(err => {
        console.log("increment fetch error: " + err);
      });
  },

  redeemReward: function(form, callback) {
    const reward = {
      used: form.used.value,
      total: form.total.textContent,
      benefit: form.benefit.value
    };
    const fetchOptions = {
      method: "PUT",
      headers: {
        Accept: [
          "application/x-www-form-urlencoded",
          "application/json",
          "text/plain",
          "*/*"
        ],
        "Content-Type": "application/json"
      },
      body: JSON.stringify(reward)
    };

    let url = "/redeemreward";
    fetchData(url, fetchOptions)
      .then(data => {
        if (data.errMessage) {
          functions.displayAlert(data.errMessage, "error");
          callback(null);
        } else {
          callback(data.message);
        }
      })
      .catch(err => {
        console.log("redeem reward error: " + err);
      });
  },

  loadPoints: function(callback) {
    let url = "/loadpoints";
    fetchData(url, {
      method: "PUT",
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
      .then(data => {
        if (data) {
          console.log(data);
          callback(data);
        }
      })
      .catch(err => {
        console.log("Load Points Fetch err: ", err);
      });
  }
};

function clearFormFields(formName) {
  let element = formName.elements;
  for (let i = 0; i < element.length - 1; i++) {
    element[i].value = "";
  }
}

function validateSignupForm(formName) {
  let element = formName.elements;
  //check for empty fields
  for (let i = 0; i < element.length - 1; i++) {
    if (element[i].value == "") {
      return false;
    }
  }
  return true;
}

async function fetchData(url, options) {
  const rawResponse = await fetch(url, options);
  const jsonData = await rawResponse.json();
  return jsonData;
}

export { UserSession };
