const express = require('express')
const router = express.Router()
const config = require('config')
const bcrypt = require('bcrypt')
const jwt    = require('jsonwebtoken')

const User = require('../models/User')

const {check, validationResult} = require('express-validator')

//@route  POST api/user
//@desc   Register a user
//@access Public

//@check validation using check from express-validator
router.post('/', [
  check('name', 'name is required')
    .not()
    .isEmpty(),
  check('email', 'please make a valid email').isEmail(),
  check('password', 'please enter password at least 6 words').isLength({min: 6})
], async (req, res) => {

  //@get the error from validation express-validator and pass the request
  //@check res.send('passed)
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return res.status(422).json({errors: errors.array() })
  }

  //@destruct from requues
  const {name, email, password} = req.body

  try {

    //@check whether the user exist or not ...
    //@if yes return error, if no create new model
    let user = await User.findOne({email})
    if(user){
      return res.status(400).json({msg: 'email already exist'})
    }

    user = new User({
      name,
      email,
      password
    })

    //@hash the password using bcrypt
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)
    
    await user.save()

    //@create respond with JWT
    const payload = {
      user: {
        id: user.id
      }
    }

    jwt.sign(payload, config.get('jwtSecret'), {
      expiresIn: 360000
    }, (err, token) => {
      if(err) throw err;
      res.json({token})
    })


    // res.send('User Saved')

    

  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error')
    

    
  }
})

module.exports = router