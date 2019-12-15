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

  findProject: (projid, userid, callback) => {
    if (projid) {
      let queryString = `SELECT * FROM cyobDB.dbo.Tbl_Projects
                        WHERE projId = ${projid} AND posted_by = '${userid}'`;
      let request = new dbconnect.sql.Request(dbconnect.pool);
      request
        .query(queryString)
        .then(data => {
          let projRecord = data.recordset[0];
          if (projRecord) {
            callback(projRecord.projId);
            return;
          }
          callback(null);
        })
        .catch(err => {
          console.log("FindError- Error running query: " + err);
        });
    }
  },

  addProject: function(projObj, callback) {
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
        console.log("AddProject- Error running query: " + err);
      });
    //   .catch(err => {
    //     console.log("Projects Check Fetch Error: " + err);
    //   });
  },

  getProject: function(projectId, callback) {
    let queryString = `SELECT * FROM cyobDB.dbo.Tbl_Projects WHERE projId = ${projectId}`;
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
        console.log("GetProject- Error running query: " + err);
      });
  },

  allProjects: function(callback) {
    let queryString = `SELECT * FROM cyobDB.dbo.Tbl_Projects`;
    let request = new dbconnect.sql.Request(dbconnect.pool);
    request
      .query(queryString)
      .then(data => {
        if (data.recordset.length > 0) {
          /* Check and update status columns */
          let projectRecord = data.recordset;
          for (let i = 0; i < data.recordset.length; i++) {
            if (
              projectRecord[i].current_workers ==
              projectRecord[i].max_no_workers
            ) {
              let subqueryString = `UPDATE cyobDB.dbo.Tbl_Projects
               SET proj_status = 'Assigned'
               WHERE projId = ${projectRecord[i].projId}`;
              request
                .query(subqueryString)
                .then(data => {
                  if (data.rowsAffected > 1) {
                    console.log(data.rowsAffected + " rows affected");
                  }
                })
                .catch(err => {
                  console.log("allprojects- subquery error: " + err);
                });
            } else {
              let subqueryString = `UPDATE cyobDB.dbo.Tbl_Projects
               SET proj_status = 'Open'
               WHERE projId = ${projectRecord[i].projId}`;
              request
                .query(subqueryString)
                .then(data => {
                  if (data.rowsAffected > 1) {
                    console.log(data.rowsAffected + " rows affected");
                  }
                })
                .catch(err => {
                  console.log("allprojects- subquery error: " + err);
                });
            }
          }
          callback(data);
          return;
        }
        callback(null);
      })
      .catch(err => {
        console.log("allprojects- Error running query:" + err);
      });
  },

  enlistWorker: function(project, userid, callback) {
    if (project.current_workers < project.max_no_workers) {
      let queryString = `INSERT INTO cyobDB.dbo.Tbl_Worklist (projId, proj_status, reward_points, userId)
      SELECT t2.projId, t2.proj_status, t2.reward_points, t1.userId 
      FROM Tbl_Profiles as t1
      CROSS JOIN Tbl_Projects as t2
      WHERE t1.userId = '${userid}' AND t2.projId = ${project.projId}`;
      let request = new dbconnect.sql.Request(dbconnect.pool);
      request
        .query(queryString)
        .then(data => {
          if (data.rowsAffected == 1) {
            callback(data.rowsAffected);
            return;
          }
          console.log("could not insert into worklist");
          callback(null);
        })
        .catch(err => {
          console.log("enlistWorker- Error running query: " + err);
        });
    }
  },

  updateCurrentWorker: function(project, callback) {
    let request = new dbconnect.sql.Request(dbconnect.pool);
    if (project.current_workers < project.max_no_workers) {
      let queryString = `UPDATE cyobDB.dbo.Tbl_Projects
               SET current_workers = ${project.current_workers + 1}
               WHERE projId = ${project.projId}`;
      request
        .query(queryString)
        .then(data => {
          if (data.rowsAffected == 1) {
            callback(data.rowsAffected);
            return;
          }
        })
        .catch(err => {
          //query failed
          console.log("Update query error" + err);
        });
    } else {
      //Project Assigned
      callback(null);
    }
  },

  checkWorklist: function(projid, userid, callback) {
    /* check for duplicate user for a project in worklist table*/
    let request = new dbconnect.sql.Request(dbconnect.pool);
    let queryString = `SELECT * FROM cyobDB.dbo.Tbl_Worklist
                        WHERE projId = ${projid} AND userId = '${userid}'`;
    request
      .query(queryString)
      .then(data => {
        // if no duplicate is found
        if (data.rowsAffected == 0) {
          callback(true);
          return;
        }
        callback(null);
      })
      .catch(err => {
        console.log("checkDuplicate- Error running query: " + err);
      });
  }
};

module.exports = Project;
