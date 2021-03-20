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
