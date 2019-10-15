const express = require('express')
const router  = express.Router()
const config  = require('config')
const bcrypt  = require('bcrypt')
const jwt     = require('jsonwebtoken')
const auth    = require('../middleware/auth')

const User    = require('../models/User')

const {check, validationResult} = require('express-validator')

//@route  GET api/auth
//@desc   Get logged in user
//@access Private
router.get('/', auth, async(req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (error) {
    console.log(error.message);
    res.status(500).json({msg: 'server error'})
    
  }
})



//@route  POST api/auth
//@desc   auth user & get token
//@access Public
router.post('/', [
  check('email', 'please include valid emai').isEmail(),
  check('password', 'password is required').exists()
],
async (req, res) => {
  //@get the error from validation express-validator and pass the request
  //@check res.send('passed)
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return res.status(422).json({errors: errors.array() })
  }

  //@destruct from requues
  const {email, password} = req.body;

  try {
    //@check whether the user exist or not ...
    //@if return no exist 
    let user = await User.findOne({email})
    if(!user){
      return res.status(400).json({msg: 'invalid credintials'})
    }

    //@if yes match get the password using bcrypt compoare
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
      return res.status(400).json({msg: 'invalid credintials'})
    }

    //@send the payload that includes token
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

  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error')
    
  }
})

module.exports = router