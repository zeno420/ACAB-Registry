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
