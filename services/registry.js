/*
    ACAB (All Chats Are Beautiful)
    Copyright (C) 2021  Zeno Berkhan

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const db = require('./db');
const config = require('../config');
const helper = require('../helper');
const auth = require("../services/auth");
const bcrypt = require('bcryptjs');


async function getRoute(req){

  const result = auth.verifyToken(req);
  const message = result.message;
  let code = result.code;

  let data = null;

  if(result.code === '200'){
    const rows = await db.query(`SELECT route, timestamp FROM routes WHERE name=?`, [req.query.name]);
    data = helper.emptyOrRows(rows);
    if(rows[0]){
      code = '200';
    } else {
      code = '404';
    }
  }

  return {
    code,
    message,
    data
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
  let code = null;
  let is_admin = null;
  let info = null;

  message = result.message;
  code = result.code;

  if(result.code === '200'){

    is_admin = await auth.isAdmin(result.decoded.name);

    message = is_admin.message;
    code = is_admin.code;

    if(is_admin.code === '200'){
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.passwd, salt);
      let db_result = await db.query(`INSERT INTO members (name, passwd) VALUES (?, ?)`, [req.body.name, hash]);
  
      if (db_result.affectedRows) {
        info = 'User created successfully.';
      } else {
        info = 'Error in creating User!';
      }

      db_result = await db.query(`INSERT INTO routes (route, name, timestamp) VALUES ('-1', ?, CURRENT_TIMESTAMP)`, [req.body.name]);

      if (db_result.affectedRows) {
        info += ' Route created successfully.';
      } else {
        info += ' Error in creating Route!';
      }
    }  
  }

  return {
    code,
    message,
    info
  }
}


async function updateRoute(req){
/*TODO update always, also if entry is same, because of timestamp */

  const result = auth.verifyToken(req);
  const code = result.code;
  const message = result.message;
  let info = null;

  if(result.code === '200'){

    const db_result = await db.query(`UPDATE routes SET route=?, timestamp=CURRENT_TIMESTAMP() WHERE name=?`, [req.body.route, result.decoded.name]);

    info = 'Error in updating route!';

    if (db_result.affectedRows) {
      info = 'Route updated successfully.';
    }
  }


  return {
    code,
    message,
    info
  }
}


module.exports = {
  getRoute,
  createUser,
  updateRoute
}
