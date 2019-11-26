import * as functions from "./functions.js";
import * as forms from "./forms.js";
// import * as server from "../../src/server.js";

if (document.querySelector(".menu-btn")) {
  functions.menuToggle();
}

// window.location.assign("userprofile.html");
// ("userprofile.html");
// console.log(myLock);
//send data to server via fetch
const test = {
  name: "cole",
  hobby: "soccer"
};

// const fetchOptions = {
//     method: "post",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify(userObj)
//   };

//   fetchData()
//     .then(res => {})
//     .catch(err => {
//       console.log("fetch error: " + err);
//     });

//   async function fetchData() {
//     const response = await fetch("/submit-login", fetchOptions);
//     const jsonData = await response.json();
//     console.log(jsonData);
//     if (jsonData.status === 404) {
//       functions.displayAlert("Username or Email not found!", "error");
//       clearFormFields(loginForm);
//     } else if (jsonData.status === 200) {
//       functions.displayAlert("Login Successful!", "success");
//     }
//   }
// fetch("/api", fetchOptions)
//   .then(res => res.json())
//    .then(json =>{
//       console.log(json);
//      })
//   .catch(err => {
//     console.log("fetch failed: " + err);
//   });

// modules.export{}
