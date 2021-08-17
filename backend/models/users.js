const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectID,
  username: String,
  email: String,
  password: String
})

module.exports = mongoose.model('User', userSchema)
