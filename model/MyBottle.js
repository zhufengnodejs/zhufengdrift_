var mongoose = require('mongoose');
//mongoose.connect("mongodb://123.57.143.189:27017/blog");
mongoose.connect("mongodb://123.57.143.189/drift");
var util = require('util');
var bottleSchema = new mongoose.Schema({
    user:Array,
    message:Array
},{collection:'bottle'});

var bottleModel = mongoose.model('Bottle',bottleSchema);
function Bottle(bottle){
    this.user = bottle.user;
    this.message = bottle.message;
}

Bottle.prototype.response = function(callback){
    var newBottle = new bottleModel({
        user:this.user,
        message:this.message
    });
    newBottle.save(function(err,bottle){
        if(err)
            return callback(err);
        else
            callback(null,bottle);
    });
}
module.exports =Bottle;