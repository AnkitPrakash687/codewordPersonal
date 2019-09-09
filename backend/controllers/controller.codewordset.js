const _ = require('lodash');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var Codewordset = require('../model/model.codewordset');
var {UserModel} = require('../model/model.user')
var { mongoose } = require('./../config/database')
var mailController = require('../config/user.mail.js')
let xlsx2json = require('xlsx2json'); // added by Ujjawal Kumar
multer = require('multer')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './data')
    },
    filename: function (req, file, cb) {
        cb(null, 'test.xlsx')
    }
})

var upload = multer({ storage: storage }).single('file')

// Fetching data from uploaded xls file is added by Ujjawal Kumar
let getDataFromXLS = (req, res) => {

    upload(req, res, function (err) {
        if (req && (!req.file || req.file.size == 0)) {
            return res.status(500).json({ message: "Please provide proper file." });
        }
        xlsx2json("./data/test.xlsx",
            {
                // dataStartingRow: 2, (This would be required if header would be required in the cordword sheet which would be uploaded by the Instructor)
                //A, B , C , E is from the input sheet row numbers
                mapping: {
                    'codeword': 'A',
                }
            }).then(jsonArray => {
                console.log(_.map(jsonArray[0],'codeword'))
                let xlsData = _.map(jsonArray[0],'codeword');
                if(!xlsData.length){
                    return res.status(200).json({ code:301, message: "Invalid data with empty or NULL values!"})
                }

                if(_.filter(xlsData, (v)=> v == "").length){
                    return res.status(200).json({ code:302, message: "Invalid data with empty or NULL values! "})
                }

                if(_.filter(xlsData, (v)=> v.length < 5).length){
                    return res.status(200).json({ code:303, message: "Invalid data with length less than 5! "})
                }
                return res.status(200).json({ code : 200, data: _.map(jsonArray[0],'codeword'), count: jsonArray[0].length })
            })
    })

}
module.exports.getDataFromXLS = getDataFromXLS;


let addcodewordset = (req, res) => {
    
    var body = _.pick(req.body,['codewordSetName', 'codewords']);
    console.log(req.body)
    var codewordset = new Codewordset({
        codewordSetName: body.codewordSetName,
        createdBy: req.session.email,
        codewords: body.codewords
    });
    codewordset.save().then((codes) => {
        return res.json({ code: 200, data: codes });
    }).catch((e) => {
        console.log(e);
        return res.json({ code: 400, message: e });
    })
}
module.exports.addcodewordset = addcodewordset;

let deletecodewordset = (req, res,next) => {
    Codewordset.deleteOne({ CodeWordSetName : req.body.id} ).then((codes) => {
        next()
    }).catch((e) => {
        console.log(e);
        return res.json({ code: 400, message: e });
    })
}
module.exports.deletecodewordset = deletecodewordset;

let getcodewordset = (req, res) => {
    //console.log('get codewords')

    UserModel.find({role: 'admin'}, (error,users)=>{
        if(!error){
          let usersEmail = users.map((item)=>{
               return item.email_id 
            })
           
            usersEmail.push(req.session.email)
            Codewordset.find({ createdBy: {$in: usersEmail}} )
            .then((codewordSet) => {
        
                if (codewordSet.length > 0){
                    var data = []
                    for(var i in codewordSet){
                    console.log(codewordSet[i])
                    data.push({
                        id: codewordSet[i]._id,
                        codewordSetName: codewordSet[i].codewordSetName,
                        count: codewordSet[i].codewords.length,
                        codewords: codewordSet[i].codewords
                    })
                }
                return res.json({ code: 200, data:data });
                }
                return res.json({ code: 404, message: 'not found' });
            }).catch((e) => {
                console.log(e);
                return res.json({ code: 400, message: e });
            })
        }
    })

}
module.exports.getcodewordset = getcodewordset;

let getacodewordset = (req, res) => {
    console.log('get codewords')

   
            Codewordset.findOne({ _id: req.params.id} )
            .then((codewordSet) => {
        
                if (codewordSet){
                    var data = []
                   
                    var data = {
                        codewordSetName: codewordSet.codewordSetName,
                        count: codewordSet.codewords.length,
                        codewords: codewordSet.codewords
                    }
                
                return res.json({ code: 200, data:data });
                }
                return res.json({ code: 404, message: 'not found' });
            }).catch((e) => {
               // console.log(e);
                return res.json({ code: 400, message: e });
            })
     

}
module.exports.getacodewordset = getacodewordset;


let addcodeword = (req, res) => {
   console.log('************add code word**************')
    var body = _.pick(req.body,['id','codeword']);
    console.log(body)

    Codewordset.findOne({_id: body.id}, (error, codewordset)=>{
        if(!error){
           var newCodeword = codewordset.codewords
           newCodeword.push(body.codeword)
           Codewordset.updateOne({_id: body.id}, {
               $set:{
                   codewords: newCodeword
               }
              
           }, (error, updatedCodewordSet) => {
                  if(!error){
                      console.log(updatedCodewordSet)
                      return res.json({ code: 200, message: 'Codeword added' });
                  } 

                  return res.json({ code: 400, message: error });
        })
        }
    })
 
 }
 module.exports.addcodeword = addcodeword;



