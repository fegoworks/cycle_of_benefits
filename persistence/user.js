const dbconnect = require("./connection");
const bcrypt = require("bcryptjs");

//Create a User Interface
function User() {}

User.prototype = {
  // Find the user data by id or username.
  find: function(user = null, callback) {
    // if the user variable is defined
    if (user) {
      let field = Number.isInteger(user) ? "id" : "username";
    }
    // Sql query
    let queryString = `SELECT * FROM Tbl_Users WHERE ${field} = ?`; //? = parameterized statement
    dbconnect
      .pool(queryString, user)
      .then(result => {
        if (result.length) {
          callback(result[0]); //return the first result
          dbconnect.pool.close(); //close connection
        } else {
          callback(null);
        }
      })
      .catch(err => {
        throw err;
      });
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
    // call the query give it the queryString string and the values (userfields array)
    dbconnect.pool
      .query(queryString, userfields)
      .then(result => {
        // return the last inserted id. if there is no error
        callback(result.insertId); //???
        dbconnect.pool.close();
      })
      .catch(err => {
        throw err;
      });
  },

  login: function(submittedUsername, submittedPassword, callback) {
    // find the user data by his username.
    this.find(submittedUsername, function(user) {
      // if there is a user by this username.
      if (user) {
        // now we check his password.
        let validPassword = bcrypt.compareSync(
          submittedPassword,
          user.password
        );
        if (validPassword) {
          // return userdata.
          callback(user);
          return;
        }
      }
      // if the username/password is wrong then return null.
      callback(null);
    });
  }
};

module.exports = User;
