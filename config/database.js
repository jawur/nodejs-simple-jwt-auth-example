const mysql = require('mysql')

const schemas = []
schemas.push(require('../schemas/users.js').schema)

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env

const connection = mysql.createConnection({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME
})

exports.connect = () => {
  connection.connect((err) => {
    if (err) throw err

    console.log('Successfully connected to database')
  })

  for (const schema of schemas) {
    console.log('Creating tables if not created')

    connection.query(schema, function (err) {
      if (err) throw err
    })
  }
}

exports.connection = connection
