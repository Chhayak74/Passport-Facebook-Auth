var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');

var userSchema = new Schema({

	local            : {
        email        : {type : String},
        password     : {type : String}
    },
    facebook         : {
        id           : {type : String},
        token        : {type : String},
        email        : {type : String},
        name         : {type : String}
    },
    google           : {
        id           : {type : String},
        token        : {type : String},
        email        : {type : String},
        name         : {type : String}
    }

});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null); };

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password); };

 mongoose.model('User' , userSchema);