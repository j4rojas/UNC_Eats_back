"use strict";

const mongoose = require("mongoose");

// schema to represent user
const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: {type:String, required:true},
  userName: {
      type:'string',
      unique: true
  }
});   

//schema to represent a resturant 
const resturantSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    title: {type:String, required:true},
    CafeImage: {type:String},
    address: {type: String, required: true },
    comment: {type: String, required: true}
});

userSchema.methods.serialize = function() {
  return {
    id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    userName: this.userName,
    email: this.email,
    password: this.password
  };
};

resturantSchema.pre('find',function(next){
    this.populate('user');
    next();
});

resturantSchema.pre('findOne', function(next) {
    this.populate('user');
});

resturantSchema.virtual('userName').get(function(){
    return `${this.user.firstName} ${this.user.lastName}`.trim();
});

resturantSchema.methods.serialize = function() {
    return {
      id: this._id,
      title: this.title,
      CafeImage: this.CafeImage,
      address: this.address,
      comment: this.comment,
    };
  };

var User = mongoose.model('User', userSchema);
const Resturant = mongoose.model('Resturant', resturantSchema);  

module.exports = {User, Resturant};
