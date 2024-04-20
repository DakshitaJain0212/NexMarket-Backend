require('dotenv').config();
const express = require('express');
const server = express();
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser');

// Use bodyParser middleware to parse request bodies
server.use(express.json());
// server.use(bodyParser.json());
// server.use(bodyParser.urlencoded({ extended: true }));

const { createProduct } = require('./controller/Product');
const productsRouter = require('./routes/product')
const categoriesRouter = require('./routes/category');
const brandsRouter = require('./routes/brands');
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const cartRouter = require('./routes/cart');
const orderRouter = require('./routes/order');
const { User } = require('./model/user');
const { isAuth, sanitizeUser,cookieExtractor } = require('./services/common');
const path = require('path');
const { Order } = require('./model/order');
const { env } = require('process');

server.use(cookieParser());

server.use(
  cors({
    exposedHeaders: ['X-Total-Count'],
  })
);

server.use(express.static(path.resolve(__dirname, 'build')))
server.use('/products', productsRouter.router);
server.use('/categories', categoriesRouter.router);
server.use('/brands', brandsRouter.router);
server.use('/users', userRouter.router);
server.use('/auth', authRouter.router);
server.use('/cart', cartRouter.router);
server.use('/orders', orderRouter.router);



// Payments

// This is your test secret API key.
const stripe = require('stripe')("sk_test_51P0nLwSDzx7bLwKxMLVqIt5PPVd3DeB2e5yjGp6RBfyr3Hve864FsIZajrkDhGVxnGzWk46DKBFenlnAG90hXsrt00Eiaw1ODr");

server.post('/create-payment-intent', async (req, res) => {
  const { totalAmount, orderId } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 100, // for decimal compensation
    currency: 'inr',
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      orderId,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
console.log("database Connected")
}

server.get('/', async (req,res) => {
  res.send('Hello from Dall E !')
  console.log("cookies : ", req.signedCookies);
})


server.listen(8000, () =>{
  console.log('Server has started on port');
}) 