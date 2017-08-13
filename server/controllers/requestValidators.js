export default {
  signUpRequest: (req, res, next) => {
    req.checkBody('username', 'username can only be 6 to 15 alphanumeric characters').notEmpty().len(6, 15).isAlphaNum();
    req.checkBody('password', 'password can\'t be less than 6 characters').notEmpty().len(6, 20);
    req.checkBody('email', 'invalid email address').notEmpty().isEmail();
    req.checkBody('membershipLevel',
      'membership level can only be in [regular, silver, gold, platinum]').inMembershipLevels();
    
    req.getValidationResult().then((errors) => {
      if (!errors.isEmpty()) {
        let errorArray = errors.useFirstErrorOnly().array();

        res.status(400).send({
          message: 'invalid parameters supplied',
          description: errorArray
        });
      } else {
        // res.send('valid input');
        next();
      }
    });
  },

  signInRequest: (req, res, next) => {
    req.checkBody('username', 'username can only be 6 to 15 alphanumeric characters').notEmpty().len(6, 15).isAlphaNum();
    req.checkBody('password', 'password can\'t be less than 6 characters').notEmpty().len(6, 20);
    
    req.getValidationResult().then((errors) => {
      if (!errors.isEmpty()) {
        let errorArray = errors.useFirstErrorOnly().array();

        res.status(400).send({
          message: 'invalid parameters supplied',
          description: errorArray
        });
      } else {
        // res.send('valid input');
        next();
      }
    });
  },
};
