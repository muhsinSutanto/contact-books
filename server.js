const express = require('express')

const app = express()

const connectDB = require('./config/db')

app.use(express.json({extended: false}))

connectDB()

//test route
app.get('/', (req, res) => res.json({message: 'hello world'}))

//get routing api
app.use('/api/auth', require('./routes/auth'))
app.use('/api/contacts', require('./routes/contacts'))
app.use('/api/users', require('./routes/users'))


const port = process.env.PORT || 4100
app.listen(port, ()=> console.log(`running on port ${port}`))