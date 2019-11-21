"use strict";
// const sql = require("mssql");
const sql = require("mssql");
// const http = require("http");
// const fs = require("fs");
const port = 3000;

/*
const server = http.createServer((req, res) => {
  if(req.url === "/"){
    res.writeHead(200, { "Content-Type": "text/html" });
    fs.write("index.html", (error, data) => {
      if (error) {
        res.writeHead(404);
        res.write("Error: Coundn't find file");
      } else {
        res.write(data);
      }
      res.end();
    });
  }
});

server.listen(port, error => {
  if (error) {
    console.log("Server not connected", error);
  } else {
    console.log("Server is listening on port " + port);
  }
});
*/

let dbConfig = {
  server: "COLE-PC\\SQLEXPRESS",
  database: "cyobDB",
  user: "guestuser",
  password: "1234"
  //   provider: "SQLNCLI11",
  //   server: `COLE-PC\\SQLEXPRESS`,
  //   Security: "SSPI",
  //   Database: "cyobDB",
  //   user: "Cole-PC\\Cole"
};

function getConnection() {
  let pool = new sql.ConnectionPool(dbConfig);
  //console.log(pool);
  pool
    .connect()
    .then(() => {
      console.log("Successfully connected to database");
      let request = new sql.Request(pool);
      request
        .query("SELECT * FROM Tbl_Users")
        .then(data => {
          console.log(data.recordset);
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
}

getConnection();

function Login(user, password) {
  let myPool; //connection pool
  let request = new sql.ConnectionPool(myPool);
  request
    .query(
      `SELECT username, password FROM Tbl_Users WHERE username = ${user} AND password = ${password}`
    )
    .then(data => {
      //1. displayMessage("Login Successful!", "success");
      //2. call the three methods to display user icons
      myPool.close();
    })
    .catch((err, data) => {
      //1. displayMessage("Username or Email not found!", "error");
      // 2. clearPasswordFields();
      myPool.close();
    });
}

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
            //1. displayMessage("Successfully Registered to Cycle of Benefits!", "success");
            //2. navigate to Login Page
            myPool.close();
          })
          .catch(err => {
            //displayMessage("Sign up Query Error", "error");
            myPool.close();
          });
      } else {
        // displayMessage(`${username} already exists`, "info");
        myPool.close();
      }
    })
    .catch(err => {
      //1. displayMessage("Input the fields in correct format", "error");
      // 2. clearFields();
      myPool.close();
    });
}

function UpdateProfile(/*all profile fileds*/) {}
function PostProject(/*all projects fileds*/) {}
function EditProject(/*all project fileds*/) {}
