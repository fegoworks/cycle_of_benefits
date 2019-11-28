const express = require("express");
const sql = require("mssql");
const path = require("path");
const router = express.Router();

let dbConfig = {
  server: "COLE-PC\\SQLEXPRESS",
  database: "cyobDB",
  user: "guestuser",
  password: "1234"
};

router.get("/", (req, res, next) => {
  res.render("index");
});
//get index page
router.get("/index.html", (req, res, next) => {
  res.render("index");
  // res.sendFile("/", path.join())
});

router.get("/projects.html", (req, res, next) => {
  res.render("projects");
});

router.get("/about.html", (req, res, next) => {
  res.render("about");
});

router.get("/register.html", (req, res, next) => {
  res.render("register");
});

router.get("/login.html", (req, res, next) => {
  res.render("login");
});

router.get("/about.html", (req, res, next) => {
  res.render("about");
});

//get user profile page
router.get("/success", (req, res, next) => {
  console.log(req.body.username);
  // res.render("userprofile");
  res.end();
});

//Post login
router.post("/login", (req, res, next) => {
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
            req.body.username === dbData.userId &&
            req.body.password === dbData.password
          ) {
            //redirect to new route
            res.redirect("/success");
            // res.json({ data: dbData });
          } else {
            res.redirect("/failed");
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

router.post("/register", (req, res, next) => {
  // res
});
module.exports = router;
