const util = require("util");
const sql = require("mssql");

const dbConfig = {
  server: "COLE-PC\\SQLEXPRESS",
  database: "cyobDB",
  user: "guestuser",
  password: "1234"
};

//connect to database
let pool = new sql.ConnectionPool(dbConfig);
pool
  .connect()
  .then(connection => {
    console.log("Connected to MSSQL Database!");
    return connection;
  })
  .catch(err => {
    console.log("Could not connect to database: " + err);
  });

module.exports = pool;