require('dotenv').config()
require('./config/database').connect()

const dbConnection = require('./config/database').connection
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('./middleware/auth')

const app = express()

app.use(express.json())

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body

  if (!(email && password && name)) {
    return res.status(422).send('All input is required')
  }

  dbConnection.query('SELECT email from users WHERE email = ?', [email], async (err, results) => {
    if (err) throw err

    if (results.length) {
      return res.status(422).send('User already exists')
    }

    const insertData = {
      name,
      email,
      password: await bcrypt.hash(password, 10)
    }

    dbConnection.query('INSERT INTO users SET ?', insertData, (err, user) => {
      if (err) throw err

      dbConnection.query('UPDATE users SET token = ?', [getToken(user.insertId, email)], (err) => { if (err) throw err })

      dbConnection.query('SELECT name, email, token FROM users WHERE email = ?', [email], (err, user) => {
        if (err) throw err

        res.status(201).json({
          data: user
        })
      })
    })
  })
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!(email && password)) {
    return res.status(422).send('All input is required')
  }

  dbConnection.query('SELECT password from users WHERE email = ?', [email], async (err, results) => {
    if (err) throw err

    if (!results.length) {
      return res.status(401).send('Invalid Credentials')
    }

    if (await bcrypt.compare(password, results[0].password)) {
      dbConnection.query('UPDATE users SET token = ? WHERE email = ?', [getToken(results[0].id, email), email], (err) => { if (err) throw err })

      dbConnection.query('SELECT token FROM users WHERE email = ?', [email], (err, token) => {
        if (err) throw err

        res.status(201).json({
          data: token
        })
      })

      return
    }

    res.status(401).send('Invalid Credentials')
  })
})

app.get('/me', [auth], (req, res) => {
  dbConnection.query('SELECT name, email from users WHERE email = ?', [req.user.email], async (err, user) => {
    if (err) throw err

    if (!user.length) {
      return res.status(401).send()
    }

    res.status(200).json({
      data: user
    })
  })
})

module.exports = app

function getToken (userId, email) {
  return jwt.sign(
    { user_id: userId, email },
    process.env.TOKEN_KEY,
    { expiresIn: '2h' }
  )
}
