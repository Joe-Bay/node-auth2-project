const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = require('../users/users-router')
const Users = require('../users/users-model')


router.post("/register", (req, res) => {
    const credentials = req.body;
  
    if (credentials) {
      const rounds = process.env.BCRYPT_ROUNDS || 8;
  
      // hash the password
      const hash = bcrypt.hashSync(credentials.password, rounds);
  
      credentials.password = hash;
  
      // save the user to the database
      Users.add(credentials)
        .then(user => {
          res.status(201).json({ data: user });
        })
        .catch(error => {
          res.status(500).json({ message: error.message });
        });
    } else {
      res.status(400).json({
        message: "please provide username and password and the password shoud be alphanumeric",
      });
    }
  });

  router.post("/login", (req, res) => {
    const { name, password } = req.body;
  
    if (req.body) {
      Users.findBy({ name: name })
        .then(([user]) => {
          // compare the password the hash stored in the database
          if (user && bcrypt.compareSync(password, user.password)) {
            const token = makeJwt(user)
  
            res.status(200).json({ token });
          } else {
            res.status(401).json({ message: "Invalid credentials" });
          }
        })
        .catch(error => {
          res.status(500).json({ message: error.message });
        });
    } else {
      res.status(400).json({
        message: "please provide name and password and the password shoud be alphanumeric",
      });
    }
  });

  function makeJwt({ username, department, id}) {
    const payload = {
      username,
      department,
      subject: id
    }
    const config = {
      jwtSecret: process.env.JWT_SECRET || 'is it a good secret'
    }
    const options = {
      expiresIn: '8 hours',
    }
  
    return jwt.sign(payload, config.jwtSecret, options)
  }
  
  
  module.exports = router;