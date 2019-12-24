const dbconnect = require("./connection");

//Create a User Interface
function Control() {}

Control.prototype = {
  archiveProject: function(projid, callback) {
    if (projid) {
      let request = new dbconnect.sql.Request(dbconnect.pool);
      let queryString = `SELECT * FROM cyobDB.dbo.Tbl_Worklist
      WHERE projId = ${project.projid}
      AND proj_status = 'Completed'`;
      request
        .query(queryString)
        .then(data => {
          if (data.recordset.length > 0) {
            let len = data.recordset.length;
            let innerQuery = `DELETE FROM cyobDB.dbo.Tbl_Worklist
            WHERE projId = ${projid}`;
            let isArchived = false;
            let rows = 0;
            //1. loop through and delete all worklist rows with associated projid
            for (let i = 0; i < len; i++) {
              request
                .query(innerQuery)
                .then(data => {
                  rows++;
                  if (rows == len) {
                    console.log("project archived: " + isArchived);
                    isArchived = true;
                    callback("Done");
                    return;
                  }
                  callback(null);
                })
                .catch(err => console.log(err));
            }
            //2. add project to archived projects table
            /* if (isArchived) {
              request
                .query(
                  `INSERT INTO cyobDB.dbo.Tbl_Archives
                    SELECT * FROM cyobDB.dbo.Tbl_Projects
                    WHERE projId = ${projid}`
                )
                .then(data => {
                  if (data.rowsAffected.length == 1) {
                    console.log(projid + " Project has been sent to Archive");
                    callback("project Archived");
                    return;
                  }
                  callback(null);
                })
                .catch(err => console.log(err));
            } */
          }
        })
        .catch(err => console.log(err));
    }
  },

  getAllRewardRequests: function(callback) {
    let request = new dbconnect.sql.Request(dbconnect.pool);
    let queryString = `SELECT * FROM cyobDB.dbo.Tbl_RewardsRequest`;
    request
      .query(queryString)
      .then(data => {
        if (data.recordset > 0) {
          callback(data);
          return;
        }
        callback(null);
      })
      .catch(err => {
        console.log(err);
      });
  },

  addProjectPoint: function(project, callback) {
    //Add other fields to the project, rewards point, estimated period
    let request = new dbconnect.sql.Request(dbconnect.pool);
    let queryString = `UPDATE cyobDB.dbo.Tbl_Projects
               SET reward_points = ${project.point},
               estimated_duration = '${project.duration}' 
               WHERE projId = ${project.projId}`;
    request
      .query(queryString)
      .then(data => {
        if (data.rowsAffected.length == 1) {
          callback("points Added");
          return;
        }
        callback(null);
      })
      .catch(err => console.log(err));
  },

  removeUser: function(userid, callback) {
    let request = new dbconnect.sql.Request(dbconnect.pool);
    // two queries
    let queryStrings = `DELETE FROM cyobDB.dbo.Tbl_Users
                      WHERE userId = '${userid}';

                      DELETE FROM cyobDB.dbo.Tbl_Profiles
                      WHERE userId = '${userid}'`;
    request
      .query(queryStrings)
      .then(data => {
        if (data.rowsAffected.length > 1) {
          callback(true);
          return;
        }
        callback(null);
      })
      .catch(err => console.log(err));
  },

  removeProject: function(projid, callback) {
    let request = new dbconnect.sql.Request(dbconnect.pool);
    let queryString = `DELETE FROM cyobDB.dbo.Tbl_Projects
                      WHERE projId = ${projid}`;
    request
      .query(queryString)
      .then(data => {
        if (data.rowsAffected.length > 1) {
          callback(true);
          return;
        }
        callback(null);
      })
      .catch(err => console.log(err));
  }
};

module.exports = Control;
