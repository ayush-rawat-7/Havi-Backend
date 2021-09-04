const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  confirmPass: {
    type: String,
    required: true
  },
  sex: {
    type: String,
    required: true
  },
  list: [
    {
      item: {
        type: String,
        required: true
      },
      date: {
        type: String,
        default: new Date()
      }
    }
  ],
  date: {
    type: String,
    default: new Date()
  }
})

// password encryption
userSchema.pre('save',async function(next) {
  if(this.isModified('password')){
    this.password = await bcrypt.hash(this.password,10);
    this.confirmPass = await bcrypt.hash(this.confirmPass,10);
  }
  next();
})

// items
userSchema.methods.addItem = async function (item) {
  try {
    this.list = await this.list.concat({ item: item })
    await this.save()
    return this.list;
  } catch (error) {
    console.log(error)
  }
}

const User = mongoose.model('USER', userSchema)
module.exports = User
