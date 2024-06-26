const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    email: {type: String, required: true,
    unique: true},
    password: {type: String, required: true},
    role: { type: String, required: true, default: 'user'},
    addresses: {type: [Schema.Types.Mixed] },
    // TODO: we can make a seperate schema for this
    name: {type: String},
    orders:{type: [Schema.Types.Mixed]},
    phone: {type: Number},
    // salt: { type: Buffer }, 
    resetPasswordToken: {type: String, default:''}
});

const virtual = userSchema.virtual('id');
virtual.get(function() {
    return this._id;
});

userSchema.set('toJSON',{
    virtual:true,
    versionKey: false,
    transform: function(doc,ret) {
        delete ret._id;
    },
})


exports.User = mongoose.model("User", userSchema);
