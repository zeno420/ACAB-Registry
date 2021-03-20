const db = require('./db');
const config = require('../config');
const helper = require('../helper');
const auth = require("../services/auth");
const bcrypt = require('bcryptjs');


async function getRoute(req){

  const result = auth.verifyToken(req);
  let message = null;

  if(result.code === '0'){
    message = 'Missing Token!';
  } else if(result.code === '-1'){
    message = 'Unauthorized!';
  } else if(result.code === '1'){
    const rows = await db.query(`SELECT route, timestamp FROM routes WHERE name=?`, [req.query.name]);
    message = helper.emptyOrRows(rows);
  }

  return {
    message,
  }
}

/*
async function createUser(user){

TODO forbidden names: jwt.verify error anmes, 0,  

TODO make initial timestamp one minute ago/

  */

async function createUser(req){

  const result = auth.verifyToken(req);
  let message = null;
  let is_admin = null;

  if(result.code === '0'){
    message = 'Missing Token!';
  } else if(result.code === '-1'){
    message = 'Unauthorized!';
  } else if(result.code === '1'){
    is_admin = await auth.isAdmin(result.decoded.name);
    if(is_admin.code === '-1'){
      message = 'Piss off!';
    } else if(is_admin.code === '1') {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.passwd, salt);
      let db_result = await db.query(`INSERT INTO members (name, passwd) VALUES (?, ?)`, [req.body.name, hash]);
  
      if (db_result.affectedRows) {
        message = 'User created successfully.';
      } else {
        message = 'Error in creating User!';
      }

      db_result = await db.query(`INSERT INTO routes (route, name, timestamp) VALUES ('-1', ?, CURRENT_TIMESTAMP)`, [req.body.name]);

      if (db_result.affectedRows) {
        message = message + ' Route created successfully.';
      } else {
        message = message + ' Error in creating Route!';
      }
    }
  } else {
    message = 'unidentified error';
  }

  return {
    message,
  }
}


async function updateRoute(req){
/*TODO update always, also if entry is same, because of timestamp */

  const result = auth.verifyToken(req);
  let message = null;

  if(result.code === '0'){
    message = 'Missing Token!';
  } else if(result.code === '-1'){
    message = 'Unauthorized!';
  } else if(result.code === '1'){

    const db_result = await db.query(`UPDATE routes SET route=? WHERE name=?`, [req.body.route, result.decoded.name]);

    message = 'Error in updating route!';

    if (db_result.affectedRows) {
      message = 'Route updated successfully.';
    }
  } else {
    message = 'unidentified error';
  }

  return {message};
}


module.exports = {
  getRoute,
  createUser,
  updateRoute
}
