var redis = require('redis');
var uuid = require('uuid');
var async = require('async');
var util = require('util');
var pool = require('generic-pool').Pool({
    name:'redisPool',
    create:function(callback){
        callback(null,redis.createClient());
    },
    destroy:function(client){
        client.quit();
    },
    max:100,
    min:5,
    idleTimeoutMills:30*1000,
    log:false
});

module.exports.getTimes = function(owner,callback){
    var result = {};
    pool.acquire(function(err,client){
        client.SELECT(1,function(){
            client.GET(owner,function(err,throwTimes){
                result['throwTimes'] = throwTimes?throwTimes:0;
                client.SELECT(2,function(){
                    client.GET(owner,function(err,pickTimes){
                        result['pickTimes'] = pickTimes?pickTimes:0;
                        callback(null,result);
                    })
                });
            })
        });
    })
}


module.exports.throw = function(bottle,callback){
    var bottleId = uuid.v4();
    var expTime = (3600*24*1000 -(Date.now()-bottle.time))/1000;
    pool.acquire(function(err,client){
        client.SELECT(1,function(){
            client.GET(bottle.username,function(err,result){
                if(result && result>=6){
                    return callback({code:0,msg:"今天扔瓶子的机会已经用完啦"});
                }else{
                    client.INCR(bottle.username,function(){
                        client.SELECT(0,function(){
                            client.HMSET(bottleId,bottle,function(err,result){
                                if(err)
                                    callback({code:0,msg:"请一会再试"});
                                client.EXPIRE(bottle,expTime,function(){
                                    pool.release(client);
                                    return callback({code:1,msg:"瓶子已经飘向远方了"});
                                });

                            });
                        });
                    });
                }
            })
        });

    });
}

