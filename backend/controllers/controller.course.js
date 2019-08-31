
const _ = require('lodash');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var { CourseModel } = require('../model/model.course');
var { mongoose } = require('./../config/database')
var mailController = require('../config/user.mail.js')
let XLSX = require('xlsx')
var { CourseStudentModel } = require('../model/model.coursestudent');
const multer = require('multer')
const csv=require('csvtojson')


var uploadFile = multer(
    {
      storage: multer.memoryStorage(),
    })
    .single('file');

const saveCourseData=(students,req, res)=>{
    var body = _.pick(req.body, ['courseNameKey',
    'codeWordSetName', 'startDate', 'endDate', 'preSurveyURL', 'postSurveyURL']);
    //var body = req.
    console.log(body)
var courseModel = new CourseModel({
    courseNameKey: body.courseNameKey,
    students: students,
    codewordSet: body.codeWordSetName,
    Startdate: body.startDate,
    Startdate: body.startDate,
    isAssigned: false,
    createdBy: req.session.email,
    Enddate: body.endDate,
    PreSurveyURL: body.preSurveyURL,
    PostSurveyURL: body.postSurveyURL
});
courseModel.save().then((user) => {
    if (user)
        return res.status(200).json({ message: "Course created successfully." });
}).catch((error) => {
    console.log(error)
    console.log(error.name + ' '+error.code)
    if (error.name == 'MongoError' && error.code == 11000) {
        console.log('working')
        return res.status(403).json({ message: 'There was a duplicate course error' });
    }
    return res.status(403).json({ message: error.message });
})
}

let addCourse = (req, res) => {

     uploadFile(req, res, error =>{
        if (error instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
          } else if (error) {
            // An unknown error occurred when uploading.
          }
          
          var studentList =  req.file;
          console.log(studentList)
          if (studentList) {
            var data = studentList.buffer.toString();

            csv({
                noheader:true,
                output: "csv"
            })
            .fromString(data)
            .then((jsonObj)=>{ 
                console.log(jsonObj)
                
                var students = jsonObj.map((data)=>{
                    return {
                        email:data[0],
                        isRevealed: false,
                        codeword:''
                        }
                })
                console.log(students)
                   saveCourseData(students,req, res)
            })
           
          }else{
              console.log(req.body)
              saveCourseData([],req, res)
          }

    })

}
module.exports.addCourse = addCourse;

let getCourses = (req, res, next) => {
   // CourseModel.find({ emailKey: req.session.email }, function (err, courses) {
    CourseModel.find({ createdBy: req.session.email }, function (err, courses) {
        // if (courses)
        //     return res.json({ code: 200, data: courses });
        console.log(courses)
           // req.courses = courses;
     return res.json({ code: 200, data: courses });
      //  next();
    }).catch((e) => {
        return res.json({ code: 400, message: e });
    })
}
module.exports.getCourses = getCourses;

let getCoursesAckData = (req, res) => {
    let tCourses = _.map(req.courses,'courseNameKey')
    CourseStudentModel.find({ CourseNameKey: { $in: tCourses} }, function (err, result) {
        let cRes =  _.groupBy(result,'CourseNameKey');
        var result = [];
        _.forEach( req.courses , function(value) {
            let cData= value.toObject()
             let tempData = cRes[value.courseNameKey];
             if(tempData){
             cData.totalAck = tempData.length;
             cData.ackAval = _.filter(tempData,{Acknowledged : true}).length
             
             }
             result.push(cData)
          });
        if (err) { res.send(err) }
        return res.json({ code: 200, data: result });
    })
}
module.exports.getCoursesAckData = getCoursesAckData;

let updateCourseInfo = (req, res)=> {
   
    CourseModel.updateOne({_id: req.body.id}, { $set: { "courseNameKey" : req.body.courseNameKey ,
        "Startdate" : req.body.Startdate ,
        "Enddate" : req.body.Enddate ,
        "PreSurveyURL" : req.body.PreSurveyURL,
        "PostSurveyURL" : req.body.PostSurveyURL } }, function(err, updatecodeword){
        if(err){
            return res.json({ code:200, message:'Course info is updated'});
        }
        return res.json({ code: 400, message:true})
    })
}
module.exports.updateCourseInfo = updateCourseInfo;

let addStudent = (req, res)=> {
   
    var body = _.pick(req.body, ['id','email']);
    CourseModel.findOne({_id:body.id}, (err, course)=>{

        if(!course){
            return res.json({ code: 400, message: 'Course does not exist' });
        }else{
           var duplicate = false 
        for(var i in course.students){
            if(course.students[i].email == body.email){
                console.log(course.students[i].email +'=='+body.email)
                duplicate = true
            }
        }
          if(duplicate){
            return res.json({ code: 400, message: 'Student already added' });
          }
        var newStudents = course.students
        
        newStudents.push({
            email:body.email,
            isRevealed:false,
            codeword:""
        })
       
            CourseModel.updateOne({ _id: body.id, createdBy: req.session.email },
                { $set: 
                    { students: newStudents } }, function (err, updatecoursestudent) {
                        console.log(updatecoursestudent)
                if (err) {
                    return res.json({ code: 400, message: err });
                }
                return res.json({ code: 200, message: 'Student added successfully' })
            })
        }
    })
}
module.exports.addStudent = addStudent;

let addStudent = (req, res)=> {
   
    var body = _.pick(req.body, ['id','email']);
    CourseModel.findOne({_id:body.id}, (err, course)=>{

        if(!course){
            return res.json({ code: 400, message: 'Course does not exist' });
        }else{
           var duplicate = false 
        for(var i in course.students){
            if(course.students[i].email == body.email){
                console.log(course.students[i].email +'=='+body.email)
                duplicate = true
            }
        }
          if(duplicate){
            return res.json({ code: 400, message: 'Student already added' });
          }
        var newStudents = course.students
        
        newStudents.push({
            email:body.email,
            isRevealed:false,
            codeword:""
        })
       
            CourseModel.updateOne({ _id: body.id, createdBy: req.session.email },
                { $set: 
                    { students: newStudents } }, function (err, updatecoursestudent) {
                        console.log(updatecoursestudent)
                if (err) {
                    return res.json({ code: 400, message: err });
                }
                return res.json({ code: 200, message: 'Student added successfully' })
            })
        }
    })
}
module.exports.addStudent = addStudent;

let deleteStudent = (req, res)=> {
    var body = _.pick(req.body, ['id','email']);
    CourseModel.findOne({_id:body.id}, (err, course)=>{

        if(!course){
            return res.json({ code: 400, message: 'Course does not exist' });
        }else{
         
        var newStudents = course.students.filter((value, index, arr)=>{
            return value.email != body.email
        })
       
        console.log(newStudents)
            CourseModel.updateOne({ _id: body.id, createdBy: req.session.email },
                { $set: 
                    { students: newStudents } }, function (err, updatecoursestudent) {
                        console.log(updatecoursestudent)
                if (err) {
                    return res.json({ code: 400, message: err });
                }
                return res.json({ code: 200, message: 'Student deleted successfully' })
            })
        }
    })
}

module.exports.deleteStudent = deleteStudent;

let deleteCourse = (req, res)=> {
    var body = _.pick(req.body, ['id']);
    console.log(req.session.email)
    CourseModel.deleteOne({ _id: body.id, createdBy: req.session.email }, function (err, deletecourse) {
        console.log(deletecourse.deletedCount)
        if (err) {
            return res.json({ code: 400, message: err });    
        }
        if(deletecourse.deletedCount > 0){
      return res.json({ code: 200, message: true })
        }else{
            return res.json({ code: 404, message: 'No course or unauthorized' })
        }
    })
}

module.exports.deleteCourse = deleteCourse;

let updateCourse = (req, res) => {
    var body = _.pick(req.body, ['courseName','id', 'startDate', 'endDate', 'startSurvey', 'endSurvey']);
    CourseModel.find({courseNameKey:body.courseName}, (err, course)=>{
        console.log('err'+err)
        console.log(course)
        if(course.length > 0){
            return res.json({ code: 404, message: 'Course already exist' });
        }else{
            CourseModel.updateOne({ _id: body.id },
                { $set: 
                    { "courseNameKey" : body.courseName,
                    "Startdate": body.startdate, 
                    "Enddate": body.endDate, 
                    "PreSurveyURL": body.startSurvey, 
                    "PostSurveyURL": body.endSurvey } }, function (err, updatecoursestudent) {
                if (err) {
                    return res.json({ code: 400, message: err });
                }
                return res.json({ code: 200, message: true })
            })
        }
    })

}
module.exports.updateCourse = updateCourse;