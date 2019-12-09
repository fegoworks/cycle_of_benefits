const dbconnect = require("./connection");
const bcrypt = require("bcryptjs");
const sql = require("mssql");

//Create a User Interface
function User() {}

User.prototype = {
  // Find the user data by id or username.
  find: function(userid, callback) {
    // if the userid variable is defined
    if (userid) {
      // Sql query
      console.log(userid);
      let queryString = "SELECT * FROM cyobDB.dbo.Tbl_Users";
      let request = new dbconnect.sql.Request(dbconnect.pool);
      request
        .query(queryString)
        .then(data => {
          console.log("Find: " + data);
          let userRecord = data.recordset[0];
          if (userRecord.userId == userid) {
            callback(userRecord); //return the first result
            console.log("This user exists");
            // return full record
          } else {
            callback(null);
          }
          // dbconnect.pool.close();
        })
        .catch(err => {
          console.log("Find Fetch Error: " + err);
        });
    }
  },

  // This function will insert data into the database. (create a new user)
  // body is an object
  create: function(userobj, callback) {
    let queryString = `SELECT * FROM cyobDB.dbo.Tbl_Users WHERE userId = '${userobj.username}'`;
    let request = new dbconnect.sql.Request(dbconnect.pool);
    request.query(queryString).then(data => {
      let matchedRow = data.rowsAffected;
      if (matchedRow >= 1) {
        console.log("Found: " + data.recordset[0].userId);
        callback(null);
      } else {
        let hashedPassword = userobj.password;
        // Hash the password
        hashedPassword = bcrypt.hashSync(hashedPassword, 10);

        // prepare the sql query, insert in order 5 required fields
        let queryString = `INSERT INTO cyobDB.dbo.Tbl_Users (userId, pass_code, first_name, last_name, email_address) VALUES ('${userobj.username}', '${hashedPassword}', '${userobj.firstname}', '${userobj.lastname}', '${userobj.email}')`;
        //make new request
        request
          .query(queryString)
          .then(rows => {
            if (rows.rowsAffected == 1) {
              // return the record of current user
              callback(userobj);
              return;
            } else {
              callback(null);
            }
            // dbconnect.pool.close();
          })
          .catch(err => {
            console.log("Create Error: " + err);
          });
      }
    });
  },

  login: function(submittedUsername, submittedPassword, callback) {
    let queryString = `SELECT * FROM cyobDB.dbo.Tbl_Users WHERE userId = '${submittedUsername}' `;
    let request = new dbconnect.sql.Request(dbconnect.pool);
    request
      .query(queryString)
      .then(data => {
        let userRecord = data.recordset[0];
        if (userRecord) {
          let validPassword = bcrypt.compareSync(
            submittedPassword,
            userRecord.pass_code
          );
          if (validPassword) {
            callback(userRecord.userId);
          } else {
            callback(null);
          }
        }
      })
      .catch(err => {
        console.log("Login Error: " + err);
      });
  },

  getProfile: function(userid, callback) {
    let queryString = `SELECT * FROM cyobDB.dbo.Tbl_Profiles WHERE username = '${userid}' `;
    let request = new dbconnect.sql.Request(dbconnect.pool);
    request
      .query(queryString)
      .then(data => {
        let userRecord = data.recordset[0];
        if (userRecord) {
          callback(userRecord);
        } else {
          callback(null);
        }
      })
      .catch(err => {
        console.log("get Profile Error: " + err);
      });
  }
};

module.exports = User;
