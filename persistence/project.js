const dbconnect = require("./connection");
const sql = require("mssql");

//Project Interface
function Project() {}

Project.prototype = {
  generateId: function(callback) {
    let request = new dbconnect.sql.Request(dbconnect.pool);
    request
      .query("SELECT * FROM cyobDB.dbo.Tbl_Projects")
      .then(data => {
        if (data) {
          //get last Id
          const row = data.rowsAffected;
          const lastId = data.recordset[row - 1].projId;
          const newId = lastId + 1;
          console.log(newId);
          callback(newId);
          return;
        } else {
          callback(null);
        }
      })
      .catch(err => {
        console.log("Generate Id- Fetch error: " + err);
      });
  },

  findProject: (id, callback) => {
    if (id) {
      let queryString = `SELECT * FROM cyobDB.dbo.Tbl_Projects
                        WHERE projId = ${id}`;
      let request = new dbconnect.sql.Request(dbconnect.pool);
      request
        .query(queryString)
        .then(data => {
          let projRecord = data.recordset[0];
          if (projRecord) {
            console.log("Find: This project exists");
            callback(projRecord.projId);
            return;
          }
          callback(null);
          console.log("Find: No such project");
        })
        .catch(err => {
          console.log("Find Fetch Error: " + err);
        });
    }
  },

  addProject: function(projObj, callback) {
    //   generate project Id
    // let queryString = `SELECT * FROM cyobDB.dbo.Tbl_Projects WHERE projId = '${projObj.id}'`;
    // let queryString = `SELECT projId FROM
    //     (SELECT * FROM Tbl_Projects
    //     WHERE posted_by = '${projObj.postedby}') AS temp
    //     WHERE projId = temp.projId`;

    let queryString = `INSERT INTO cyobDB.dbo.Tbl_Projects (proj_title, proj_details, proj_address, proj_city, max_no_workers, posted_by) VALUES ('${projObj.title}', '${projObj.details}','${projObj.address}' , '${projObj.city}', ${projObj.maxworkers}, '${projObj.postedby}')`;

    //make new request
    let request = new dbconnect.sql.Request(dbconnect.pool);
    request
      .query(queryString)
      .then(data => {
        if (data.rowsAffected == 1) {
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
    //   .catch(err => {
    //     console.log("Projects Check Fetch Error: " + err);
    //   });
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
