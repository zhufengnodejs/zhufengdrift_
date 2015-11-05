var express = require('express');
var router = express.Router();
var Bottle = require('../model/Bottle');
var MyBottle = require('../model/MyBottle');
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

router.post('/pick', function(req, res, next) {
    if(req.body.bottleId){
        MyBottle.show(req.body.bottleId,function(err,bottle){
            if(err){
                return res.json({code:0,msg:"查看瓶子出错!"});
            }else{
                return res.json({code:1,msg:bottle});
            }
        });
    }else{
        Bottle.pick(req.session.user.username,function(result){
            return res.json(result);
        });
    }
});



router.post('/response',function(req,res,next){
    var bottle = {user:[],message:[]};
    bottle.user.push(req.session.user.username);
    bottle.user.push(req.body.owner);
    if(req.body.content){
        bottle.message.push({
            user:req.body.owner,
            content:req.body.content,
            time:req.body.time
        });
    }else{
        return res.json({code:0,msg:"内容不能为空!"});
    }
    if(req.body.response){
        bottle.message.push({
            user:req.session.user.username,
            content:req.body.response,
            time:Date.now()
        });
    }else{
        return res.json({code:0,msg:"内容不能为空!"});
    }
    var newMyBottle = new MyBottle(bottle);
    newMyBottle.response(function(err,result){
        if(err){
            return res.json({code:0,msg:"回应出错!"});
        }else{
            return res.json({code:1,msg:bottle});
        }
    });
})

router.post('/myBottle',function(req,res){
    MyBottle.myBottle(req.session.user.username,function(err,bottles){
        return res.json({code:1,msg:bottles});
    });
});

module.exports = router;