const { Router } = require('express');
const Auction = require('../models/Auction');
const { ensureAuth } = require('../middleware/ensureAuth');


module.exports = Router() 
  .post('/', ensureAuth, (req, res, next) => {
    Auction
      .create({
        user: req.user._id,
        text: req.body.test
      })
      .then(auction => res.send(auction))
      .catch(next);
  });
