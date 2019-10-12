const express = require('express')
const router = express.Router()

router.post('/', (req, res) => {
  res.send('register user')
})

module.exports = router