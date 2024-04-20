const { Product } = require('../model/Product');

exports.createProduct = async(req,res) => {
    const product = new Product(req.body);
     try{ 
      const response = await product.save();
      res.status(201).json({status: "success", product: response});
   }catch(err){
      res.status(201).json({status: "error", error: err});
   }
};

exports.fetchProductsByFilters = async(req,res) => {
   // filter = {"category":["smartphone","laptops"]}
  // sort = {_sort:"price",_order="desc"}
  // pagination = {_page:1,_limit=10}
  let condition = {}
  if(!req.query.admin){
      condition.deleted = {$ne:true}
  }
  
  let query = Product.find(condition);
  let totalProductsQuery = Product.find(condition);

  console.log(req.query.category);

  if (req.query.category) {
    query = query.find({ category: {$in:req.query.category.split(',')} });
    totalProductsQuery = totalProductsQuery.find({
      category: {$in:req.query.category.split(',')},
    });
  }
  if (req.query.brand) {
    query = query.find({ brand: {$in:req.query.brand.split(',')} });
    totalProductsQuery = totalProductsQuery.find({ brand: {$in:req.query.brand.split(',') }});
  }
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  const totalDocs = await totalProductsQuery.count().exec();
  console.log({ totalDocs });

  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const docs = await query.exec();
    res.set('X-Total-Count', totalDocs);
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};


exports.fetchProductById = async(req,res) => {
   const {id} = req.params;
    try{ 
     const response = await Product.findById(id);
     res.status(201).json(response);

  }catch(err){
     res.status(201).json({status: "error", error: err});
  }
};

exports.updateProduct = async(req,res) => {
   const {id} = req.params;
    try{ 
     const response = await Product.findByIdAndUpdate(id, req.body, {new: true});
     res.status(201).json(response);
  }catch(err){
     res.status(201).json({status: "error", error: err});
  }
};



exports.fetchProduct = async(req,res) => {
    try{ 
      const response = Product.find({deleted: {$ne: true}});
     res.status(201).json(response);
  }catch(err){
     res.status(201).json({status: "error", error: err});
  }
};