const _ = require('lodash');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var Codewordset = require('../model/model.codewordset');
var {UserModel} = require('../model/model.user')
var { mongoose } = require('./../config/database')
var mailController = require('../config/user.mail.js')
let xlsx2json = require('xlsx2json'); // added by Ujjawal Kumar
multer = require('multer')
const stringSimilarity = require('string-similarity')
const anagramFinder = require('anagram-finder')

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
                        codewords: codewordSet[i].codewords,
                        isPublished: codewordSet[i].isPublished
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
                        codewords: codewordSet.codewords,
                        isPublished: codewordSet.isPublished
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

 let updatecodeword = (req, res) => {
    console.log('************update code word**************')
     var body = _.pick(req.body,['id','newCodeword', 'oldCodeword']);
     console.log(body)
 
     Codewordset.findOne({_id: body.id}, (error, codewordset)=>{
         if(!error){
            var newCodewords = codewordset.codewords.filter((item)=>{
                if(item != body.oldCodeword){
                    return item
                }
            })
            newCodewords.push(body.newCodeword)
            Codewordset.updateOne({_id: body.id}, {
                $set:{
                    codewords: newCodewords
                }
               
            }, (error, updatedCodewordSet) => {
                   if(!error){
                       console.log(updatedCodewordSet)
                       return res.json({ code: 200, message: 'Codeword updated' });
                   } 
 
                   return res.json({ code: 400, message: error });
         })
         }
     })
  
  }
  module.exports.updatecodeword = updatecodeword;


  let deletecodeword = (req, res) => {
    console.log('************delete code word**************')
     var body = _.pick(req.body,['id','codeword']);
     console.log(body)
 
     Codewordset.findOne({_id: body.id}, (error, codewordset)=>{
         if(!error){
            // var newCodeword = codewordset.codewords
            // newCodeword.push(body.codeword)
            Codewordset.updateOne({_id: body.id}, {
                $pull:{
                    codewords: body.codeword
                }
               
            }, (error, updatedCodewordSet) => {
                   if(!error){
                       console.log(updatedCodewordSet)
                       return res.json({ code: 200, message: 'Codeword deleted' });
                   } 
 
                   return res.json({ code: 400, message: error });
         })
         }
     })
  
  }
  module.exports.deletecodeword = deletecodeword;

  let generateReport = (req, res) =>{

    var body = _.pick(req.body,['id','level']);
    console.log('********LEVEL**********')
    console.log(body.level)
    var similarityLevel
    switch(body.level){
        case 0:
            similarityLevel = 0.3
            break;
        case 1:
            similarityLevel = 0.5
            break;
        case 2:
            similarityLevel = 0.7
            break;
        case 3:
            similarityLevel = 0.8
            break;
        case 4:
            similarityLevel = 0.9
            break;
        default:
            similarityLevel = 0.5
    }
    console.log(similarityLevel)
    Codewordset.findOne({_id: body.id}, (error, codewordset)=>{
        if(error){
            return res.json({ code: 400, message: error });
        }

        var codewords = codewordset.codewords
        var result = []
        //console.log(codewords)
        for(var i in codewords){
            var targetCodewords = codewords.filter((item, index)=>{
                if(index != i){
                    return item
                }
            })

            result.push({word: codewords[i], similarity: stringSimilarity.findBestMatch(codewords[i], targetCodewords)})
        }

        var similars = []
        var checkerArray = []
       for(var i in result){

        if(!checker(checkerArray, result[i].word)){
          // console.log(result[i])
           var ratings = result[i].similarity.ratings
           var output = []
           output.push(result[i].word)
           for(var i in ratings){
                if(ratings[i].rating > similarityLevel){
                    output.push(ratings[i].target)
                    checkerArray.push(ratings[i].target)
                    }
                }
           }
           
           similars.push(output)
        
       }
       let final = similars.filter((item)=>{
           if(item.length > 1){
               return item
           }
       })
      // console.log(Array.from(new Set(final.map(JSON.stringify)), JSON.parse))
     
      
     var anagrams = anagramFinder.find(codewords).filter((item)=>{
         if(item.length > 1){
             return item
         }
     })

     var data ={similars: Array.from(new Set(final.map(JSON.stringify)), JSON.parse),
                anagrams: anagrams}
    // console.log('************ANAGRAMS******************')
     //console.log(anagrams)
      return res.json({ code: 200, data: data });
    })
  }

  module.exports.generateReport = generateReport


const publishCodeworset = (req, res) =>{
    var body = _.pick(req.body,['id'])
    //console.log(body.id)
    Codewordset.updateOne({_id:body.id}, 
       { 
           $set:{
                    "isPublished": true

                }
        },
        (error, updatedCodewordSet)=>{
        if(error){

            return res.json({ code: 400, message: error });
        }

        return res.json({ code: 200, message: 'Codeword set finalized' });
    }
    )
}
module.exports.publishCodeworset = publishCodeworset

const deleteCodeworset = (req, res) =>{
    var body = _.pick(req.body,['id'])
    //console.log(body.id)
    Codewordset.deleteOne({_id:body.id}, 
        (error, deletedCodewordSet)=>{
        if(error){

            return res.json({ code: 400, message: error });
        }

        return res.json({ code: 200, message: 'Codeword set finalized' });
    }
    )
}
module.exports.deleteCodeworset = deleteCodeworset

const checker = (checkerArray, str) =>{
    for(var i in checkerArray){
        if(checkerArray[i] == str){
            return true
        }
    }
    return false
}
