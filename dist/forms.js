import * as functions from "./functions.js";

function UserSession() {}

/* Form validation*/
UserSession.prototype = {
  p_path: "",
  // get profileUrl() {
  //   return this.p_path;
  // },
  // set profileUrl(url) {
  //   this.p_path = url;
  // },

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

      fetch(url, fetchOptions)
        .then(response => {
          return response.json();
        })
        .then(data => {
          if (data.message) {
            console.log("Error: " + data);
            functions.displayAlert(
              data.message + ": Username or Password not correct!",
              "error"
            );
          } else {
            // console.log(data.redirect_path);
            // console.log(data.userdata);
            clearFormFields(form.formName);
            this.p_path = data.redirect_path;
            console.log(this.p_path);
            callback(data.redirect_path);
            return;
          }
          callback(null);
        })
        .catch(error => console.error("HTTP- Error: ", "\n" + error));
    }
  },
  /* Register */
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
        fetch(url, fetchOptions)
          .then(rawResponse => rawResponse.json())
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
              console.log(data);
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

      fetch(url, options)
        .then(rawResponse => rawResponse.json())
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

  updateProfile: (form, callback) => {
    /* if (!validateSignupForm(form.formName)) {
      // functions.displayAlert("Fill all required fields", "error");
      // return false;
    } else {

    }*/
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

    fetch(url, options)
      .then(response => {
        return response.json();
      })
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

function retrieveData() {
  // submit data to server
  newUserObj = submitData(
    fname.value,
    lname.value,
    user.value,
    email.value,
    password.value
  );
}
//
function submitData(fname = "", lname = "", user = "", email = "", pass = "") {
  let userObj = {
    fname: fname,
    lname: lname,
    user: user,
    email: email,
    pass: pass
  };
  return userObj;
}

export { UserSession };
