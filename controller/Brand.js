const { Brand } = require("../model/brand");

exports.fetchBrands = async (req, res) => {
  try {
    const brands = await Brand.find({}).exec();
    res.status(200).json(brands);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.createBrands = async (req, res) => {
    const brands = new Brand(req.body);
    try {
      const doc = await brands.save();
      res.status(200).json(brands);
    } catch (err) {
      res.status(500).json(err);
    }
  };
