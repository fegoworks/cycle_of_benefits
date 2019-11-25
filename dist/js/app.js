import * as functions from "./functions.js";
import * as forms from "./forms.js";
// import * as server from "../../src/server.js";

if (document.querySelector(".menu-btn")) {
  functions.menuToggle();
}

//send data to server via fetch
const data = {
  name: "cole",
  hobby: "soccer"
};
// const fetchOptions = {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json"
//   },
//   body: JSON.stringify(data)
// };

// fetchData().catch(err => {
//   console.log("fetch error: " + err);
// });

// async function fetchData() {
//   const response = await fetch("/api", fetchOptions);
//   const jsonData = await response.json();
//   if (jsonData.data.status === "error") {
//     functions.displayAlert();
//   } else {
//     console.log(json.data.password);
//   }
// }
// fetch("/api", fetchOptions)
//   .then(res => res.json())
//    .then(json =>{
//       console.log(json);
//      })
//   .catch(err => {
//     console.log("fetch failed: " + err);
//   });

// modules.export{}
