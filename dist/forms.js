import * as functions from "./functions.js";

function UserSession() {}

async function fetchData(url, options) {
  const rawResponse = await fetch(url, options);
  const jsonData = await rawResponse.json();
  return jsonData;
}
/* Form validation*/
UserSession.prototype = {
  /* Login Form*/
  loginData: function(callback) {
    if (document.getElementById("loginform")) {
      // if element exists on the page
      let loginForm = document.getElementById("loginform");
      let username = document.getElementById("username");
      let password = document.getElementById("password");

      loginForm.addEventListener("submit", e => {
        e.preventDefault(); //ignores the default submit behaviour through action
        let url = loginForm.getAttribute("action")
          ? "/submitlogin"
          : "/cannotgetposturl";
        if (username.value === "" || password.value === "") {
          functions.displayAlert("Enter your login information!", "info");
          return false;
        } else {
          //retrieve user data
          const user = {
            username: username.value,
            password: password.value
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
              if (!data.redirect_path) {
                console.log("Error: " + data.message);
                functions.displayAlert(
                  "Username or Password not correct!",
                  "error"
                );
              } else {
                // console.log(data);
                functions.displayAlert("Login Successful!", "success");
                console.log(
                  "Success: Don't need to fetch data" + data.redirection_path
                );
                clearFormFields(loginForm);
                //get data and send to
                if (confirm("Go to your profile?")) {
                  callback(data.firstname);
                  window.location.replace(data.redirect_path);
                } else {
                  window.location.assign("/");
                  callback(null);
                }
              }
            })
            .catch(error => console.error("Fetch Error: ", error));
        }
      });
    }
  },
  /* Register */
  signupData: function(form) {
    /* Signup Form*/
    // let signupForm = document.getElementById("form");
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

        // fetchData(url, fetchOptions)
        //   .then(data => {
        //     if (!data.redirect_path) {
        //       functions.displayAlert(
        //         "Error setting up Account: " + data.message,
        //         "error"
        //       );
        //     } else {
        //       console.log(data);
        //       functions.displayAlert(data.status, "success");
        //       clearFormFields(form.formName);
        //       //get data and send to
        //       if (confirm("Sign in?")) {
        //         window.location.assign(data.redirect_path);
        //       } else {
        //         window.location.assign("/");
        //         return false;
        //       }
        //     }
        //   })
        //   .catch(error => console.error("Fetch Error: ", error));
      }
    }
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
