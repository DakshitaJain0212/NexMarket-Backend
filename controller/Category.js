
const { Category } = require("../model/category");

exports.fetchCategory = async(req,res) =>{
   try{
     const categories = await Category.find({}).exec();
     res.status(200).json(categories);
}catch(err){
    console.log("error in finding categories.")
    res.status(500).json(err)
}
}

exports.createCategory = async (req, res) => {
    const Categories = new Category(req.body);
    try {
      const doc = await Categories.save();
      res.status(200).json(doc);
    } catch (err) {
      res.status(500).json(err);
    }
  };