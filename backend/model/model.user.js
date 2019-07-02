

var mongoose = require('mongoose');
var validator = require('validator');

var UserModel = mongoose.model('UserModel', {
   email_id: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minlength: 5,
    validate:{
        validator: (value) =>{
            return validator.isEmail(value);
        }
    }
   },
   first_name: {
    type: String
   }, 
   last_name: {
    type: String
   },
   password:{
    type: String,
    require: true,
    minlength: 6
   },
   role: {
       type:String,
       enum:['admin','student','instructor'],
       require:true
   },
   is_active:{
       type:Boolean,
       require:true,
       default:false
   },
   last_login:{
        type: Date,
   },
   created_at:{
       type:Date
   },
   updated_at:{
       type: Date,   
   }
   
          
   
});
module.exports.UserModel = UserModel