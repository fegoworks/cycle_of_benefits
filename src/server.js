"use strict";
// import * as functions from "../dist/js/functions";
// import * as forms from "../dist/js/forms";
// import * as app from "../dist/js/app";
// const functions = require("../dist/js/functions");
// const forms = require("../dist/js/forms");
const sql = require("mssql");
const http = require("http");
// const fs = require("fs");
const port = 3000;
const express = require("express");
const app = express();

app.listen(port, () => console.log(`listening at port ${port}`));
app.use(express.static("dist"));
app.use(express.json({ limit: "1mb" }));
// app.get("/index", (req, res))
app.post("/login", (req, res) => {
  const clientData = req.body;
  //connect to database
  let pool = new sql.ConnectionPool(dbConfig);
  pool
    .connect()
    .then(() => {
      console.log("Successfully connected to database");
      let request = new sql.Request(pool);
      // switch statement for different queries
      request
        .query("SELECT * FROM Tbl_Users")
        .then(data => {
          let dbData = data.recordset[0];
          // console.log("server\t" + JSON.stringify(dbData));
          // for (let row = 0; row < dbData.length; row++) {
          if (
            clientData.username === dbData.userId &&
            clientData.password === dbData.password
          ) {
            //send data back
            res.json({
              status: "success",
              data: dbData
            });
          } else {
            res.json({
              status: "error",
              data: {}
            });
          }
          // }
          pool.close();
        })
        .catch(err => {
          console.log("Error in query, Could not execute query: " + err);
          pool.close();
        });
    })
    .catch(err => {
      console.log("Could not connect to database: " + err);
    });
});

let dbConfig = {
  server: "COLE-PC\\SQLEXPRESS",
  database: "cyobDB",
  user: "guestuser",
  password: "1234"
};

function getData(data) {
  return data;
}

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

module.exports = { Login, SignUp, UpdateProfile, PostProject, EditProject, hi };
