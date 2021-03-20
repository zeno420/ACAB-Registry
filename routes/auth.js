const express = require('express');
const router = express.Router();
const auth = require('../services/auth');

/* POST auth */
router.post('/signin', async function(req, res, next) {
  try {
    res.json(await auth.signin(req.body));
  } catch (err) {
    console.error('Error while auth!', err.message);
    next(err);
  }
});

module.exports = router;
