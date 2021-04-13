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

const express = require('express');
const router = express.Router();
const registry = require('../services/registry');


/* GET route */
router.get('/', async function(req, res, next) {
  try {
    res.json(await registry.getRoute(req));
  } catch (err) {
    console.error('Error while getting route!', err.message);
    next(err);
  }
});


/* POST user */
router.post('/', async function(req, res, next) {
  try {
    res.json(await registry.createUser(req));
  } catch (err) {
    console.error('Error while creating new member!', err.message);
    next(err);
  }
});


/* PUT route */
router.put('/', async function(req, res, next) {
  try {
    res.json(await registry.updateRoute(req));
  } catch (err) {
    console.error(`Error while updating route!`, err.message);
    next(err);
  }
});


module.exports = router;
