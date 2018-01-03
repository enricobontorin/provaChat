/*globals require, module */

var mongoose = require('mongoose');
var RSchema = mongoose.Schema;

var RoomSchema = new RSchema({
    rid: String,
    room_name: String,
});

module.exports = mongoose.model('Room', RoomSchema);
