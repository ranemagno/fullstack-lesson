"use strict";
// const http =  require('http');
const express = require('express');
const app = express(); //calls the express method
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const product = require('./Products.json');
const mongoose = require('mongoose');
const config = require('./config.json');
const Product = require('./models/products.js');
const User = require('./models/users.js');
//require() brings in/makes a requirement to use framework or file

const port = 3000;

// .use calls the framework - similar to a function
// req == "request" - is an object containing information about the HTTP request that raised the event
// res == "response" - to send back the deried HTTP response.
app.use((req,res,next) => {
  console.log(`${req.method} request ${req.url}`);
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());

// get method - read, view, see the data it's an endpoint
app.get('/',(req,res) => {
  res.send('Hello, I am from the backend'); //shows on the dom
});

// our own connection stream
// replace '<password>' with own password
// replace 'myFirstDatabase' with own database name
// mongoose.connect('mongodb+srv://ranemagno:<password>@cluster0.kuinm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true});
mongoose.connect(`mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASSWORD}@cluster0.${config.MONGO_CLUSTER_NAME}.mongodb.net/sample?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('DB Connected'))
.catch(err => {
  console.log(`DBConnectionError:${err.message}`);
})


//routing to the endpoint '/allProducts' is what the endpoint will be called and what you are accessing in your req???
// /allProducts in web url to access
app.get('/allProducts',(req,res) => {
  res.json(product);
});


// makes an endpoint, runs through the json data
app.get('/products/p=:id',(req,res) => {
  const idParam = req.params.id;
  for (let i = 0; i < product.length; i++) {
    if (idParam.toString() === product[i].id.toString()){
      res.json(product[i]);
    }
  }
});


// posting new data to the database
app.post('/addProduct', (req,res) => {
  // object layout that has to be followed in Postman. _id not necessary as mongoose creates it for you
  const dbProduct = new Product({
    _id: new mongoose.Types.ObjectId,
    name: req.body.name,
    price: req.body.price,
    image_url: req.body.imageUrl
  });
  // save this to the database and notify the users if it has saved
  dbProduct.save()
  .then(result => {
    res.send(result);
    // sends result to mongodb and shows up in the database
    // product should be written in postman inside Body
  })
  .catch(err => res.send(err)); //err msg
});
// If postman is set up correctly. It will then push to the relevant MongoDB cluster/collection


// Register a new user to the database
app.post('/registerUser', (req,res) => {
  // finds one user
  User.findOne({username:req.body.username}, (err,userResult) => {
    if (userResult){
      res.send('Username is already taken. Please try another name');
    } else {
      const hash = bcrypt.hashSync(req.body.password); //Encrypts password - security
      const user = new User({
        _id: new mongoose.Types.ObjectId,
        username: req.body.username,
        email: req.body.email,
        password: hash
      });
      user.save()
      .then(result => {
        res.send(result)
      })
      .catch(err => res.send(err));
    }
  })
});

// view all users
app.get('/allUsers', (req,res) => {
  User.find()
  .then(result => {
    res.send(result);
  })
});

// login
app.post('/loginUser', (req,res) => {
  User.findOne({username:req.body.username}, (err,userResult) =>{
    if (userResult){
      // .compareSync - if password matches
      if (bycrypt.compareSync(req.body.password, userResult.password)) {
        res.send(userResult)
      } else {
        res.send('not authorized')
      }
    } else {
      res.send('User not found. Please register')
    }
  })
})

app.delete('/deleteProduct/:id', (req, res) => {
  const idParam = req.params.id;
  Product.findOne({_id: idParam}, (err, product) => {
    if (product) {
      Product.deleteOne({_id: idParam}, err => {
        res.send('deleted')
      });
    } else {
      res.send('not found');
    }
  })
  .catch(err => res.send(err));
});

app.patch('/updateProduct/:id', (req, res) => {
  const idParam = req.params.id;
  // comes from the user when they request
  Product.findById(idParam,(err, product) => {
    if (product['user_id'] == req.body.userId) {
      const updatedProduct = {
        name: req.body.name,
        price: req.body.price,
        image_url: req.body.imageUrl
        // so the body in question here is pulling from the postman body when you type in there to update, it makes sense
      }
      Product.updateOne({_id: idParam}, updatedProduct)
        .then(result => {res.send(result)})
        .catch(err => res.send(err))
        // if this is updated, THEN,
    } else {
      res.send('Error: Product not found');
    }
  })
})


// listening to port
app.listen(port, () => {
  console.log(`Fullstack app is listening on: ${port}`);
});
