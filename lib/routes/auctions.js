const { Router } = require('express');
const Auction = require('../models/Auction');
const { verify } = require('../middleware/ensureAuth');


module.exports = Router()
  .post('/', verify, (req, res, next) => {
    Auction
      .create({
        user: req.user._id,
        description: req.body.description,
        title: req.body.title,
        quantity: req.body.quantity,
        end: req.body.end
      })
      .then(auction => res.send(auction))
      .catch(next);
  })
  .get('/:id', verify, (req, res, next) => {
    Auction
      .findById(req.params.id)
      .then(auction => res.send(auction))
      .catch(next);
  })
  .get('/', verify, (req, res, next) => {
    Auction
      .find()
      .then(auction => res.send(auction))
      .catch(next);
  });
