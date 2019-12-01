"use strict";
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const pageRouter = require("./routes/pages");
const sql = require("mssql");
const path = require("path");
const session = require("express-session");
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "dist")));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
//set view engine
app.set("views", path.join(__dirname, "views"));
app.engine("html", require("ejs").__express);
app.set("view engine", "html");

// Session Params
app.use(
  session({
    secret: "cyob",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 1000 * 30
    }
  })
);

//user routes
app.use("/", pageRouter);

// Errors : Page not found
app.use((req, res, next) => {
  var err = new Error("Page not found");
  err.status = 404;
  next(err);
});

//Handle errors
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message);
});

app.listen(port, () => console.log(`listening at port ${port}...`));

//success handler
// app.get("/success/:user", (req, res) => {
//   res.redirect("/userprofile");
//   // console.log(req.params.user);
// });

//failed handler
// app.get("/failed", (req, res) => {
//   console.log(req.params.password);
//   res.end();
// });

app.post("", (req, res) => {
  // const clientData = req.body;
  // //connect to database
  // let pool = new sql.ConnectionPool(dbConfig);
  // pool
  //   .connect()
  //   .then(() => {
  //     console.log("Successfully connected to database");
  //     let request = new sql.Request(pool);
  //     // switch statement for different queries
  //     request
  //       .query("SELECT * FROM Tbl_Users")
  //       .then(data => {
  //         let dbData = data.recordset[0];
  //         // console.log("server\t" + JSON.stringify(dbData));
  //         // for (let row = 0; row < dbData.length; row++) {
  //         if (
  //           clientData.username === dbData.userId &&
  //           clientData.password === dbData.password
  //         ) {
  //           //redirect to new route
  //           res.redirect(`/success/${dbData.userId}`);
  //           // res.json({ data: dbData });
  //         } else {
  //           res.redirect("/failed");
  //         }
  //         // }
  //         pool.close();
  //       })
  //       .catch(err => {
  //         console.log("Error in query, Could not execute query: " + err);
  //         pool.close();
  //       });
  //   })
  //   .catch(err => {
  //     console.log("Could not connect to database: " + err);
  //   });
});

//function getConnection() {

// }

// getConnection();

function Login(user, password, pool) {
  //console.log(pool);
  pool
    .connect()
    .then(() => {
      console.log("Successfully connected to database");
      let request = new sql.ConnectionPool(myPool);
      request
        .query(
          `SELECT username, password FROM Tbl_Users WHERE username = ${user} AND password = ${password}`
        )
        .then(data => {
          //Show user data profile page
          myPool.close();
        })
        .catch((err, data) => {
          functions.displayAlert("Username or Email not found!", "error");
          // 2. clearPasswordFields();
          myPool.close();
        });
    })
    .catch(err => {
      console.log("Could not connect to database: " + err);
    });
}
// if (forms.currentUserObj !== "") {
//   Login(forms.currentUserObj.username, forms.currentUserObj.password);
// }

function SignUp(user, fname, lname, email, password) {
  let myPool; //connection pool
  let request = new sql.ConnectionPool(myPool);
  request
    .query(`SELECT * FROM Tbl_Users WHERE username = ${user}`)
    .then(data => {
      if (data.rowsAffected == 0) {
        request
          .query(
            `INSERT INTO Tbl_Users VALUES (${user}, ${fname}, ${lname}, ${email}, ${password})`
          )
          .then(data => {
            //1. functions.displayAlert("Successfully Registered to Cycle of Benefits!", "success");
            //2. navigate to Login Page
            myPool.close();
          })
          .catch(err => {
            //functions.displayAlert("Sign up Query Error", "error");
            myPool.close();
          });
      } else {
        // functions.displayAlert(`${username} already exists`, "info");
        myPool.close();
      }
    })
    .catch(err => {
      //1. functions.displayAlert("Input the fields in correct format", "error");
      // 2. clearFields();
      myPool.close();
    });
}

function UpdateProfile(/*all profile fileds*/) {}
function PostProject(/*all projects fileds*/) {}
function EditProject(/*all project fileds*/) {}

function hi() {
  alert("I can see you");
}

module.exports = app;
