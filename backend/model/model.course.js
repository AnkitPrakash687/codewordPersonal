
var mongoose = require('mongoose');
var validator = require('validator');

var CourseModel = mongoose.model('courseModel', {
    courseNameKey: {
    type: String,
    required: true,
    trim: true,
    unique: true
   },
   status:{
    isAssigned:{type: Boolean},
    codewordSetName:{type: String}
   },
   students:[
      {
         type:String,
         unique: true
      }
   ],
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
