const dbconnect = require("./connection");
const sql = require("mssql");

//Project Interface
function Project() {}

Project.prototype = {
  addProject: function(projObj, callback) {
    let queryString = `SELECT * FROM cyobDB.dbo.Tbl_Projects WHERE projId = '${projObj.id}'`;
    let request = new dbconnect.sql.Request(dbconnect.pool);
    request.query(queryString).then(data => {
      let matchedRow = data.rowsAffected;
      if (matchedRow >= 1) {
        console.log("Found Project: " + data.recordset[0].projId);
        callback(null);
      } else {
        let queryString = `INSERT INTO cyobDB.dbo.Tbl_Projects (proj_title, proj_desc, proj_address, proj_city, max_no_workers, posted_by) VALUES ('${projObj.title}', '${projObj.desc}','${projObj.address}' , '${projObj.city}', '${projObj.maxworkers}', '${projObj.postedby}')`;
        //make new request
        request
          .query(queryString)
          .then(rows => {
            if (rows.rowsAffected == 1) {
              // return the record of current user
              callback(projObj);
              return;
            } else {
              callback(null);
            }
            // dbconnect.pool.close();
          })
          .catch(err => {
            console.log("Add Project Error: " + err);
          });
      }
    });
  },

  getProject: function(projectId, callback) {
    let queryString = `SELECT * FROM cyobDB.dbo.Tbl_Projects WHERE projId = '${projectId}' `;
    let request = new dbconnect.sql.Request(dbconnect.pool);
    request
      .query(queryString)
      .then(data => {
        let projectRecord = data.recordset[0];
        if (projectRecord) {
          callback(projectRecord);
        } else {
          callback(null);
        }
      })
      .catch(err => {
        console.log("Get Project Error: " + err);
      });
  }
};

module.exports = Project;
