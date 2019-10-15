const express = require('express')
const router = express.Router()
const auth    = require('../middleware/auth')

const User      = require('../models/User')
const Contact   = require('../models/Contact')

const {check, validationResult} = require('express-validator')


//@route  GET api/contacts
//@desc   Get all users contacts
//@access Private
router.get('/', auth, async (req, res) => {
  try {
    const contacts = await Contact.find({user : req.user.id}).sort({date : -1})
    res.json(contacts)
  } catch (error) {
    console.log(error.message);
    res.status(500).json({msg: 'server error'})
    
  }
})

router.post('/', (req, res) => {
  res.send('post new contact')
})

router.put('/:id', (req, res) =>{
  res.send('edit contact')
})

router.delete('/:id', (req, res) => {
  res.send('delete contact')
})

module.exports = router