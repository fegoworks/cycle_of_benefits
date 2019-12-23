const dbconnect = require("./connection");
const sql = require("mssql");

//Project Interface
function Project() {}

Project.prototype = {
  // generateId: function(callback) {
  //   let request = new dbconnect.sql.Request(dbconnect.pool);
  //   request
  //     .query("SELECT * FROM cyobDB.dbo.Tbl_Projects")
  //     .then(data => {
  //       if (data) {
  //         //get last Id
  //         const row = data.rowsAffected;
  //         const lastId = data.recordset[row - 1].projId;
  //         const newId = lastId + 1;
  //         console.log(newId);
  //         callback(newId);
  //         return;
  //       } else {
  //         callback(null);
  //       }
  //     })
  //     .catch(err => {
  //       console.log("Generate Id- Fetch error: " + err);
  //     });
  // },

  findProject: (projid, callback) => {
    if (projid) {
      let queryString = `SELECT * FROM cyobDB.dbo.Tbl_Projects
                        WHERE projId = ${projid}`;
      let request = new dbconnect.sql.Request(dbconnect.pool);
      request
        .query(queryString)
        .then(data => {
          if (data.recordset.length > 0) {
            let projRecord = data.recordset[0];
            callback(projRecord.projId);
            return;
          }
          console.log("Project does not exist");
          callback(null);
        })
        .catch(err => {
          console.log("FindError- Error running query: " + err);
        });
    }
  },

  addProject: function(proj, callback) {
    let queryString = `INSERT INTO cyobDB.dbo.Tbl_Projects (proj_type, proj_title, proj_details, proj_photo, proj_address, proj_city, proj_tools, max_no_workers, estimated_duration, posted_by) VALUES ('${proj.type}','${proj.title}', '${proj.details}', '${proj.image}', '${proj.address}' , '${proj.city}', '${proj.tools}', ${proj.maxworkers}, '${proj.duration}','${proj.postedby}')`;

    //make new request
    let request = new dbconnect.sql.Request(dbconnect.pool);
    request
      .query(queryString)
      .then(data => {
        if (data.rowsAffected == 1) {
          // return the record of project
          callback(proj);
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

  updateProject: function(projObj, callback) {
    this.findProject(projObj.id, foundId => {
      if (foundId) {
        let request = new dbconnect.sql.Request(dbconnect.pool);
        let queryString = `UPDATE cyobDB.dbo.Tbl_Projects 
        SET proj_type ='${projObj.type}', proj_title ='${projObj.title}', proj_details ='${projObj.details}', proj_address ='${projObj.address}', proj_city ='${projObj.city}', proj_tools ='${projObj.tools}', max_no_workers =${projObj.maxworkers}, estimated_duration ='${projObj.duration}', reward_points =${projObj.point}
        WHERE projId = ${foundId}`;

        request
          .query(queryString)
          .then(data => {
            if (data.rowsAffected.length == 1) {
              callback(true);
              return;
            }
            callback(null);
          })
          .catch(err => {
            console.log(err);
          });
      }
    });
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
          //1. Set project status to Assigned except for Completed status
          for (let i = 0; i < projectRecord.length; i++) {
            if (
              projectRecord[i].current_workers ==
              projectRecord[i].max_no_workers
            ) {
              let subqueryString = `UPDATE cyobDB.dbo.Tbl_Projects
               SET proj_status = 'Assigned'
               WHERE projId = ${projectRecord[i].projId}
               AND proj_status <> 'Completed'`;
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
    this.findProject(project.projid, exists => {
      if (exists) {
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
              }
            })
            .catch(err => {
              console.log("enlistWorker- Error running query: " + err);
            });
        }
      } else {
        console.log("could not insert into worklist");
        callback(null);
      }
    });
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

  checkWorklistForDuplicates: function(projid, userid, callback) {
    this.findProject(projid, id => {
      if (id) {
        let request = new dbconnect.sql.Request(dbconnect.pool);
        let queryString = `SELECT * FROM cyobDB.dbo.Tbl_Worklist
                        WHERE projId = ${projid} AND userId = '${userid}'`;
        request
          .query(queryString)
          .then(data => {
            // if no duplicate is found
            if (data.rowsAffected == 0) {
              callback(true);
            }
          })
          .catch(err => {
            console.log("checkDuplicate- Error running query: " + err);
          });
      } else {
        callback(null);
      }
    });
    /* check for duplicate user for a project in worklist table*/
  },

  distributePoints: function(callback) {
    //when project status = "assigned"
    let queryString = `SELECT * FROM cyobDB.dbo.Tbl_Projects 
                      WHERE proj_status = 'Assigned'`;
    let request = new dbconnect.sql.Request(dbconnect.pool);
    request
      .query(queryString)
      .then(data => {
        if (data.recordset.length > 0) {
          console.log(data.recordset.length + " assigned project(s) found");
          let projectRecord = data.recordset;
          for (let i = 0; i < projectRecord.length; i++) {
            let id = projectRecord[i].projId;
            //1. get all users in worklist table for the completed project
            let subqueryString = `SELECT * FROM cyobDB.dbo.Tbl_Worklist WHERE projId = ${id}`;
            request
              .query(subqueryString)
              .then(data => {
                if (data.recordset.length > 0) {
                  let worklistRecord = data.recordset;
                  let rewards = worklistRecord[0].reward_points;
                  let numWorkers = worklistRecord.length;
                  let point = Math.floor(rewards / numWorkers);
                  let count = 0;
                  //2. Distribute reward points to associated users
                  for (let i = 0; i < numWorkers; i++) {
                    let user = worklistRecord[i].userId;
                    let innerQuery = `UPDATE cyobDB.dbo.Tbl_Profiles SET user_reward_points = user_reward_points + ${point} WHERE userId = '${user}'`;
                    request
                      .query(innerQuery)
                      .then(data => {
                        count++;
                        if (count == numWorkers) {
                          console.log(
                            "points distributed to " + count + " workers"
                          );
                          //3 .Set Project status as completed after reward is distributed
                          this.projectCompleted(id, completed => {
                            if (completed) {
                              callback(id);
                            } else {
                              console.log(
                                "There was an error with updating " +
                                  id +
                                  " status to completed, update manually"
                              );
                            }
                          });
                        }
                      })
                      .catch(err => console.log(err));
                  }
                }
              })
              .catch(err => console.log(err));
          }
        } else {
          callback(null);
        }
      })
      .catch(err => {
        console.log(err);
      });
    //assign(update) the rewards point of each to equal shares of the total reward the project carries
    //add the reward points to each of the user's total rewards in the reward table
    //delete all record with the project id
  },

  projectCompleted: function(projid, callback) {
    this.findProject(projid, id => {
      if (id) {
        let request = new dbconnect.sql.Request(dbconnect.pool);
        let queryString = `UPDATE cyobDB.dbo.Tbl_Projects
                                    SET proj_status = 'Completed'
                                    WHERE projId = ${projid}`;
        request
          .query(queryString)
          .then(data => {
            console.log(data);
            if (data.rowsAffected.length == 1) {
              console.log(projid + " Project has been flagged as Completed");
              callback(true);
              return;
            }
            callback(null);
          })
          .catch(err => console.log(err));
      }
    });
  }
};

module.exports = Project;
