
var mongoose = require('mongoose');
var validator = require('validator');

var CourseModel = mongoose.model('courseModel', {
    courseNameKey: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minlength: 5
   },
   status:{
    isAssigned:{type: Boolean},
    codewordSetName:{type: String}
   },
   Startdate: {
    type: String,
    required: true,
    minlength: 5
   },
   Enddate: {
    type: String,
    required: true,
    minlength: 5
   },
   PreSurveyURL: {
    type: String
   },
   PostSurveyURL: {
    type: String
   }
});
module.exports.CourseModel = CourseModel
