var express = require('express');
var router = express.Router();
var Bottle = require('../model/Bottle');
var util = require('util');

router.post('/throw', function(req, res, next) {
    var bottle = {};
    if(req.body.content){
        bottle.content = req.body.content;
    }else{
        return res.json({code:0,msg:"内容不能为空!"});
    }

    if(req.body.owner){//表示是扔回大海的
        bottle.username = req.body.owner;
    }else{//自己扔瓶子
        bottle.username = req.session.user.username;
    }

    if(req.body.time){
        bottle.time = req.body.time;
    }else{
        bottle.time = Date.now();
    }

    Bottle.throw(bottle,function(result){
        return res.json(result);
    });
});
module.exports = router;