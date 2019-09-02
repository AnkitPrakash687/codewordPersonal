
var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var codeWordSetSchema = new Schema({
        codewordSetName: {
                type: String,
                require: true,
                unique:true
        },
        createdBy: {
             email:{
                     type: String, 
                     require: true
                },
             role:{
                     type: String, 
                     require: true
                }  
        },
        codewords:[
                {type: String,
                 unique: true,
                 min: 5       
                }
        ]
});

// create the model for users and expose it to our app
module.exports = mongoose.model('CodeWordSet', codeWordSetSchema);

