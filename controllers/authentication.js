const User = require('../models/user');
const config = require('../config');
const jwt = require('jwt-simple');

function tokenForUser(user) {
  //sub - subject, who is token belong to
  //iat - issued at time data wa
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
  //User has already had their email and password authentication
  //We just need to give them a tokenForUser
  res.send({ token: tokenForUser(req.user)})
}

exports.signup = function(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  if(!email || !password) {
    return res.status(422).send({error: 'Please enter the pass and email'})
  }

  //See if a user with the given email exists
  User.findOne({ email: email }, function(err, existingUser) {
    if(err) { return next(err); }

    //If user with email does exists, return Error
    if( existingUser ) {
      return res.status(422).send({error: 'Email is in use' });
    }

    //if a user with email does NOT exist, create and save record
    const user = new User({
      email: email,
      password: password
    });

    user.save(function(err) {
      if(err) { return next(err); }

      //Respond to request indicating the user was created
      res.json({ token: tokenForUser(user)});
    });
  });
}
