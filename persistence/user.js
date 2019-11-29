const dbconnect = require("./connection");
const bcrypt = require("bcryptjs");
const sql = require("mssql");

//Create a User Interface
function User() {}

User.prototype = {
  // Find the user data by id or username.
  find: function(userid = null, callback) {
    // if the userid variable is defined
    if (userid) {
      // Sql query
      // console.log("Passed in: " + typeof userid);
      let queryString = "SELECT * FROM Tbl_Users";
      let request = new dbconnect.sql.Request(dbconnect.pool);
      request
        .query(queryString)
        .then(data => {
          let dbData = data.recordset[0];
          // console.log("In database: " + typeof dbData.userId);
          // for (let row = 0; row < dbData.length; row++) {
          if (dbData.userId === userid) {
            // console.log(userid);
            callback(dbData); //return the first result
          } else {
            callback(null);
          } //close connection
          // }
          dbconnect.pool.close();
        })
        .catch(err => {
          console.log("Find Error: " + err);
        });
    }
  },

  // This function will insert data into the database. (create a new user)
  // body is an object
  create: function(body, callback) {
    let hashedPassword = body.password;
    // Hash the password first
    hashedPassword = bcrypt.hashSync(hashedPassword, 10);
    let userfields = [];
    // loop in the attributes of the object and push the values into the bind array.
    for (prop in body) {
      userfields.push(body[prop]); //5 from post route data
    }
    // prepare the sql query, insert inorder 5 fields
    let queryString = `INSERT INTO Tbl_Users VALUES (?, ?, ?, ?, ?)`;
    let request = new dbconnect.sql.Request(dbconnect.pool);
    request
      .query(queryString, userfields)
      .then(result => {
        // return the last inserted id. if there is no error
        callback(result.insertId); //???
        dbconnect.pool.close();
      })
      .catch(err => {
        console.log("Error: " + err);
      });
  },

  login: function(submittedUsername, submittedPassword, callback) {
    // let request = new dbconnect.sql.Request(dbconnect.pool);
    // let queryString = "SELECT * FROM Tbl_Users";
    // request
    //   .query(queryString)
    //   .then(data.Record => {
    //       if(submittedUsername === dbData.userId &&
    //         submittedPassword === dbData.password){

    //         }
    //     dbconnect.pool.close(); //close connection
    //   })
    //   .catch(err => {
    //     console.log("Find Error: " + err);
    //   });
    // find the user data by his username.
    this.find(submittedUsername, function(user) {
      // if there is a user by this username.
      if (user) {
        // now we check his password.
        // let validPassword = bcrypt.compareSync(
        //   submittedPassword,
        //   user.password
        // );
        if (submittedPassword === user.password) {
          // return userdata.
          callback(user.userId);
          return;
        }
      }
      // if the username/password is wrong then return null.
      callback(null);
    });
  }
};

module.exports = User;
