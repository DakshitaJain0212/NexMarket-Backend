const { Brand } = require("../model/brand");
const { Cart } = require("../model/cart");

exports.addToCart = async (req, res) => {
  try {
    const cart = new Cart(req.body);
    console.log(cart);
    const doc = await cart.save();
  //  const result = await cart.populate('product');
  //  const doc = await result.save();
    res.status(200).json(doc);
    console.log(doc);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.fetchCartByUser = async (req, res) => {
    
    try {
      const {id } = req.params;
        const cartItems = await Cart.find({user:id}).populate('user').populate('product');
      res.status(200).json(cartItems);
    } catch (err) {
      res.status(500).json(err);
    }
  };


  exports.deleteFromCart = async (req, res) => {
    const {id } = req.params;
    try {
        const cartItems = await Cart.findByIdAndDelete(id);
      res.status(200).json(cartItems);
    } catch (err) {
      res.status(500).json(err);
    }
  };

  exports.updateCart = async (req,res) => {
    const { id } = req.params;
   try{ 
    console.log("cart");
    const cart = await Cart.findByIdAndUpdate(id, req.body, {new: true});
    const result = await cart.populate('product');
    res.status(200).json(result);

  }catch(err){
    res.status(500).json(err)
  }
}
