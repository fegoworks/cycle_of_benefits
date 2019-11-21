"use strict";
// const sql = require("mssql");
const sql = require("mssql/msnodesqlv8");
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
  user: "cole",
  password: ""
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
      console.log("database connected");
      let request = new sql.Request(pool);
      request
        .query("SELECT * FROM Tbl_Users")
        .then(columns => {
          console.log(columns);
          pool.close();
        })
        .catch(err => {
          console.log("Could not execute query: " + err);
          pool.close();
        });
    })
    .catch(err => {
      console.log("Could not connect to database: " + err);
    });
}

getConnection();
