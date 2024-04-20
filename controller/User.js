
const { Category } = require("../model/category");
const { User } = require("../model/user");


exports.fetchUserById = async(req,res) =>{   
   try{
    const {id} = req.params;
     const user = await User.findById(id)
    //   const { _id, ...userWithoutId } = user.toObject();
    //  // Add _id as id in the userWithoutId object
    //  console.log(userWithoutId);
     
     res.status(200).json({addresses: user.addresses, email: user.email, role: user.role, id : user._id, name: user.name, orders : user.orders});
}catch(err){
    console.log("something went wrong.")
    res.status(500).json(err)
}
}

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  try{ 
   const order = await User.findByIdAndUpdate(id, req.body, {new: true});
   res.status(200).json(order);

 }catch(err){
   res.status(500).json(err)
  };
}