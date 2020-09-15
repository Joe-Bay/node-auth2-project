const router = require("express").Router();
const jwt = require('jsonwebtoken')
const Users = require("./users-model.js");
const restricted = require("../auth/restricted-middleware.js");


router.get("/", restricted, (req, res) => {
  Users.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => res.send(err.message));
});



module.exports = router;