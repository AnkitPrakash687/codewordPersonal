const _ = require('lodash');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var Codewordset = require('../model/model.codewordset');
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
    // Upper code was not working so I(Ujjawal) added the below code
    // Removed emailkey it is not in requirement - updated by Srimai
    var body = _.pick(req.body,['CodeWordSetName']);
    var codewordset = new Codewordset({
        CodeWordSetName: body.CodeWordSetName,
        CodeWordCreator: req.session.email
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
    console.log('get codewords')
    Codewordset.find({ $or: [{"createdBy.email": req.session.email}, {"createdBy.role": 'admin'} ] } )
    .then((codewordSet) => {

        if (codewordSet.length > 0){
            var data = []
            for(var i in codewordSet){
            console.log(codewordSet[i])
            data.push({
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
module.exports.getcodewordset = getcodewordset;

