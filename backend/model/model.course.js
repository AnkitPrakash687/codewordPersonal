
var mongoose = require('mongoose');
var validator = require('validator');

var CourseModel = mongoose.model('courseModel', {
    courseNameKey: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    index:true
   },
   students:[
      {
      email:{type:String},
      isRevealed:{type: Boolean},
      codeword:{type: String}
      }
   ],
   codewordSet:{
      type:String
   },
   isAssigned:{
      type:Boolean
   },
   Startdate: {
    type: Date
   },
   Enddate: {
    type: Date
   },
   PreSurveyURL: {
    type: String
   },
   PostSurveyURL: {
    type: String
   }
});
module.exports.CourseModel = CourseModel
