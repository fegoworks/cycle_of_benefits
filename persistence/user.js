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
      let queryString = `SELECT * FROM cyobDB.dbo.Tbl_Profiles WHERE userId = '${userid}'`;
      let request = new dbconnect.sql.Request(dbconnect.pool);
      request
        .query(queryString)
        .then(data => {
          let userRecord = data.recordset[0];
          if (userRecord.userId == userid) {
            callback(userRecord.userId); //return the first result
            console.log("Find: This user exists");
          } else {
            callback(null);
          }
        })
        .catch(err => {
          console.log("Find Fetch Error: " + err);
        });
    }
  },

  createUser: function(userobj, callback) {
    /* let queryString = `SELECT * FROM cyobDB.dbo.Tbl_Users WHERE userId = '${userobj.username}'`;
    let request = new dbconnect.sql.Request(dbconnect.pool);
    request.query(queryString).then(data => {
      let matchedRow = data.rowsAffected;
      if (matchedRow == 1) {
        console.log("Found: " + data.recordset[0].userId);
        callback(null);
      }  */
    this.find(userobj.username, "Profiles", id => {
      if (id) {
        console.log("Found User: " + id);
        callback(null);
        return;
      }
      let hashedPassword = userobj.password;
      // Hash the password
      hashedPassword = bcrypt.hashSync(hashedPassword, 10);
      // prepare the sql query, insert in order 5 required fields
      let queryString = `INSERT INTO cyobDB.dbo.Tbl_Users (userId, pass_code) VALUES ('${userobj.username}', '${hashedPassword}')`;
      //make request
      request
        .query(queryString)
        .then(rows => {
          if (rows.rowsAffected == 1) {
            //make new request
            callback(rows.rowsAffected);
          } else {
            callback(null);
          }
          // dbconnect.pool.close();
        })
        .catch(err => {
          console.log("Create Error: " + err);
        });
    });
    /*  }); */
  },

  createProfile: function(userobj, callback) {
    this.createUser(userobj, response => {
      console.log(response + " from create Profile");
      if (response) {
        let queryString = `INSERT INTO cyobDB.dbo.Tbl_Profiles (userId, first_name, last_name, email_address) VALUES ('${userobj.username}', '${userobj.firstname}', '${userobj.lastname}', '${userobj.email}')`;

        let request = new dbconnect.sql.Request(dbconnect.pool);
        request
          .query(queryString)
          .then(rows => {
            if (rows.rowsAffected == 1) {
              // return the record of current user
              callback(rows.rowsAffected);
              return;
            } else {
              callback(null);
            }
          })
          .catch(err => {
            console.log("Save Profile Error: " + err);
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
    if (userid) {
      let queryString = `SELECT * FROM cyobDB.dbo.Tbl_Profiles WHERE userId = '${userid}' `;
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
    } else {
      console.log("getProfile: Userid is null");
      callback(null);
    }
  },

  updateProfile: function(userid, profile, callback) {
    if (userid) {
      this.find(userid, id => {
        if (id) {
          let queryString = `UPDATE cyobDB.dbo.Tbl_Profiles
           SET first_name = '${profile.fname}', last_name = '${profile.lname}', date_of_birth = '${profile.dob}', email_address = '${profile.email}', home_address = '${profile.address}', mobile_number = '${profile.phone}', state_of_origin = '${profile.state}', nationalId = '${profile.nationalId}'
           WHERE userId = '${id}' `;
          let request = new dbconnect.sql.Request(dbconnect.pool);
          request
            .query(queryString)
            .then(data => {
              console.log(data);
              if (data.rowsAffected == 1) {
                console.log("updated");
                callback(data.rowsAffected);
              } else {
                console.log("did not update");
                callback(null);
              }
            })
            .catch(err => {
              console.log("get Profile Error: " + err);
            });
        } else {
          callback(null);
        }
      });
    } else {
      console.log("updateProfile: Userid is null");
      callback(null);
    }
  }
};

module.exports = User;
