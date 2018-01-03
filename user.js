/*globals require, module */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    uid: String,
    user_name: String,
    user_sur: String,
    psw: String

});

module.exports = mongoose.model('User', UserSchema);
