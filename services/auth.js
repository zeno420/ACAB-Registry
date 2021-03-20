const db = require('./db');
const config = require('../config');
const jwt = require('jsonwebtoken');
var bcrypt = require("bcryptjs");

function verifyToken(req){
  let token = req.headers["x-access-token"];

  let code = null;
  var decoded = null;

  if (!token) {
    code = '0';
    decoded = 'No token provided!';
  } else {

    try {
      decoded = jwt.verify(token, config.secret);
      code = '1';
    } catch(err) {
      decoded = err;
      code = '-1';
    }
  }

  return {
    code,
    decoded
  }

/*TODO better return: mit name exp undso*/
}


async function isAdmin(name){

  let code = null;
  const rows =  await db.query(`SELECT * FROM admins WHERE name=?`, [name]);

/*TODO prüfen ob if korrekt, kein fehlverhlten */

  if (rows[0]) {
    code = '1'; //admin
  } else {
    code = '-1'; //kein admin
  }

  return {
    code,
  }
}


async function signin(user){


  let message = '';
  let accesToken = null;

  const rows = await db.query(`SELECT * FROM members WHERE name=?`, [user.name]);

  if (!rows) {
    message = 'invalid login';
    return {
      message,
    }
  }

  const dbuser = rows[0];

  var passwordIsValid = bcrypt.compareSync(user.passwd, dbuser.passwd);

  if (!passwordIsValid) {
    message = 'invalid login';
    return {
      accesToken,
      message,
    }
  }

  const name = user.name;
  accesToken = jwt.sign({ name: user.name }, config.secret, {expiresIn: 86400});

  return {
    name,
    accesToken,
  }
}


module.exports = {
  verifyToken,
  isAdmin,
  signin,
}


