const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function(req, res, next) {
  //@get the token from header
  const token = req.header('x-auth-token')

  //@check if not token
  if(!token){
    return res.status(401).json({ msg: 'no token, authorization denied'})
  }

  try {
    const decode = jwt.verify(token, config.get('jwtSecret'))

    req.user = decode.user
    next()
  } catch (error) {
    res.status(401).json({ msg: 'token is not valid'})
  }
}

//@to check this middleware auth pass this function on the second argument