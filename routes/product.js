const express = require('express');
const { createProduct, fetchProductsByFilters, fetchProductById, updateProduct, fetchProduct } = require('../controller/Product');

const router = express.Router();

router.post('/' , createProduct)
      .get('/',fetchProductsByFilters)
       .get('/:id',fetchProductById)
       .patch('/:id',updateProduct)
       .get('/',fetchProduct)
exports.router = router;
