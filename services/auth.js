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
const jwt = require('jsonwebtoken');
var bcrypt = require("bcryptjs");

function verifyToken(req){
  let token = req.headers["x-access-token"];

  let code = null;
  var decoded = null;
  let message = null;

  if (!token) {
    code = '401';
    //decoded = 'No token provided!';
    message = 'Unauthorized';
  } else {

    try {
      decoded = jwt.verify(token, config.secret);
      code = '200';
      message = 'OK';
    } catch(err) {
      //decoded = err;
      code = '401';
      message = 'Unauthorized';
    }
  }

  return {
    code,
    decoded,
    message
  }

/*TODO better return: mit name exp undso*/
}


async function isAdmin(name){

  let code = null;
  let message = null;
  const rows =  await db.query(`SELECT * FROM admins WHERE name=?`, [name]);

/*TODO prüfen ob if korrekt, kein fehlverhlten */

  if (rows[0]) {
    code = '200';
    message = 'OK';
  } else {
    code = '403';
    message = 'Forbidden';
  }

  return {
    code,
    message
  }
}


async function signin(user){


  let code = null;
  let message = null;
  let name = null;
  let accessToken = null;

  const rows = await db.query(`SELECT * FROM members WHERE name=?`, [user.name]);

  if (!rows[0]) {
    code = '401';
    message = 'Unauthorized';
  } else {
    const dbuser = rows[0];

    var passwordIsValid = bcrypt.compareSync(user.passwd, dbuser.passwd);

    if (!passwordIsValid) {
      code = '401';
      message = 'Unauthorized';
    } else {

      name = user.name;
      accessToken = jwt.sign({ name: user.name }, config.secret, {expiresIn: 86400});
      
      code = '200';
      message = 'OK';
    }
  }

  return {
    code,
    message,
    name,
    accessToken
  }
}


module.exports = {
  verifyToken,
  isAdmin,
  signin,
}
