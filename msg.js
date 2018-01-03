/*globals require, module */

var mongoose = require('mongoose');
var MSchema = mongoose.Schema;

var MsgSchema = new MSchema({
    content: String,
    uid: String,
    rid: String,
    date: String

});

module.exports = mongoose.model('Msg', MsgSchema);
