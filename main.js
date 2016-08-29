var express = require('express');
var app = express();
var uuid = require('node-uuid');

// inventory and cart are attached to the global
// scope specifically for testing
global.inventory = require('./inventory');
global.carts = [];

app.use(require('body-parser').json());

// do not log with morgan when in test mode
if ( process.env.NODE_ENV !== 'test' ) {
  app.use(require('morgan')('dev'));
}

app.get('/carts', (req, res, next) => {
  res.send(global.carts)
})

app.get('/carts/:id', (req, res, next) => {
  let cartID = req.params.id
  let filteredCart = carts.filter((cart) => {
    return cartID === cart.id
  })
    if(filteredCart.length){
      res.status(200).send(filteredCart[0])
    } else {
      res.status(404).send({
        message: 'Cart not found.'
      })
    }
})

app.post('/carts', (req, res, next) => {
  let carts = {
    id: uuid.v1(),
    products: []
  }
  global.carts.push(carts)
  res.status(201).send(carts)
})

// app.post('/carts/:id/products/:productId', (req, res, next) => {
//   let cartID = req.params.id;
//   let prodId = req.params.productId;
//   let selectedCart = carts.filter((newCart) => {
//     return newCart.id === cartID
//   })
//   // for (var i = 0; i < 4; i++) {
//   //   for (var i = 0; i < .length; i++) {
//   //     [i]
//   //   }
//   // }
//
//   console.log(Object.keys(inventory));
//   // filter through each object in the inventory object
//   // for (var i = 0; i < inventory.length; i++) {
//   //   inventory[i]
//   // }
//   res.status(201).send(selectedCart[0])
// })

app.get('GET /carts/:id/total', function (req, res, next) {
  res.status(201).send()
})

app.post('/carts/:id/products/:productId', (req, res, next) => {
  let cartID = req.params.id;
  let prodID = req.params.productId;
  let selectedItem
  let selectedCart
  carts.forEach((newCart) => {
    if (newCart.id === cartID) {
      selectedCart = newCart
    }
  })
  if(!selectedCart) {
      res.status(404).send({
        message: 'Cart Not Found'
    })
  }
  // for each key in Inventory "IE: snowboard etc"
  for (itemArr in inventory) {
    // for every item in each array(which is the key)
    inventory[itemArr].forEach((item) => {
      // if the Item id is the same as the what we're passing in
      if (item.id === prodID) {
        // selectedItem is the same as the item we're passing in
        selectedItem = item
      }
    })
  }
  if(!selectedItem){
    res.status(404).send({
      message: 'Product Not Found'
    })
  }
  if(selectedItem.available === 0){
    res.status(422).send({
      message: 'Product Out of Stock'
    })
  }
  if (selectedCart.products[0]) {
    selectedCart.products[0].quantity++
  } else {
    selectedCart.products = [{
      id: selectedItem.id,
      name: selectedItem.name,
      price: selectedItem.price,
      quantity: 1
    }]
  }

  selectedItem.available--
  res.status(201).send(selectedCart)
})

app.listen(3000);

module.exports = app;
