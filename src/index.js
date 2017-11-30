#!/usr/bin/env node
var path = require('path');
var prompt = require('prompt');
const creator = require("./creator");
var schema = {
    properties: {
      login : {
        message: 'Login ',
        required: true
      },
      password: {
        message: 'Password ',
        required: true,
        hidden: true
      }
    }
};

var args = require('process.args')();
var params = {};
for(var p in args){
    if(p.includes("create-mock")){
        params = args[p];
    }
}


var file = params.f ? path.resolve(params.f) : path.resolve(process.cwd() , 'mock.js');
console.log("** using file : "+file);
var config = require(file);

if(params.auth){
    prompt.start();
    prompt.get(schema, function (err, result) {
        config.auth = {
            enabled : true,
            credentials : result
        };
        creator(config);
    });

    
}
else {
    config.auth = {
        enabled : false
    };
    creator(config);
};


