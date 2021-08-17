const mongoose = require('mongoose');


// Everything in Mongoose starts with a Schema. Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
// Simply - schema defines the object layout
const productSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectID,
  name: String,
  price: Number,
  image_url: String,
  // user_id - for each product only the user who has posted it will be able to access it
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

// .exports - exports the objects/primitive values from the module so that they can be used by other programs with the import statement
module.exports = mongoose.model('Product', productSchema)
// Whatever you put in the 'Product' will be how you call it later
// how it's called in index.js -
// const Product = require('./models.product.js')
