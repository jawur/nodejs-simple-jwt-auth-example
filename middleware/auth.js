const jwt = require('jsonwebtoken')

const config = process.env

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token']

  if (!token) {
    return res.status(401).send()
  }

  try {
    req.user = jwt.verify(token, config.TOKEN_KEY)
  } catch (err) {
    return res.status(401).send()
  }

  return next()
}

module.exports = verifyToken
