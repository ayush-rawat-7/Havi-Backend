const express = require('express')
const dotenv = require('dotenv')
const bcrypt = require('bcryptjs')
const cors = require('cors')
dotenv.config({ path: './config.env' })
require('./db/conn')
const app = express()
const PORT = process.env.PORT || 5000

// middlewares
app.use(express.json())
app.use(cors())

// model
const User = require('./model/userSchema')

// routes
app.get('/', (req, res) => {
  res.send('NHioscioasm')
})
// register
app.post('/register', async (req, res) => {
  const { name, password, confirmPass, email, sex } = req.body
  if ((!name, !password, !email, !confirmPass)) {
    return res.status(422).json({ error: 'Please fill the details correctly' })
  }
  try {
    const response = await User.findOne({ email: email })
    if (response) {
      return res.status(422).json({ error: 'Email already registered' })
    }
    const user = new User({ name, password, email, confirmPass, sex })
    const userRegistered = await user.save()
    if (userRegistered) {
      res.status(201).json({ message: 'Added Successfully' })
    }
  } catch (error) {
    console.error(error)
  }
})

// login
app.post('/login', async (req, res) => {
  const { email, password } = req.body
  // console.log(password)
  if (!email || !password) {
    return res.status(422).json({ error: 'Fill the details correctly' })
  }
  try {
    const user = await User.findOne({ email: email })
    // console.log(user);
    if (!user) {
      return res.status(422).json({ error: 'Email not found' })
    } else {
      const isMatch = await bcrypt.compare(password, user.password)
      console.log(isMatch)
      if (isMatch) {
        return res.status(200).send(user)
      } else {
        return res.status(422).json({ error: 'Invalid Credentials' })
      }
    }
  } catch (error) {
    console.log(error)
  }
})

// list
app.post('/user/list-items', async (req, res) => {
  try {
    const { item, email } = req.body
    const user = await User.findOne({ email })
    if (user) {
      const userItem = await user.addItem(item)
      await user.save()
      return res.status(201).json({ message: 'Item added' })
    } else {
      return res.status(422).json({ error: 'Invalid user' })
    }
  } catch (error) {
    console.log(error)
  }
})

// admin req
app.get('/users', async (req, res) => {
  try {
    const data = await User.find()
    if (!data) {
      return res.status(422).json({ error: 'Invalid Request' })
    } else {
      return res.status(200).send(data)
    }
  } catch (error) {
    console.log(error)
  }
})

// listen
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})
