var mkdirp = require('mkdirp');
var format = require('string-format');
var jsonQuery = require('json-query');
var jsonfile = require('jsonfile');
var request = require('request-json');

var main = function(config){
    var ctrl = this;
    this.client = request.createClient(config.host);
    if(config.auth.enabled){
        console.log("** authentication enabled");
        client.setBasicAuth(config.auth.credentials.login, config.auth.credentials.password);
    }
    this.dir = function(x){
        return config.sub + "/" + x;
    }

    this.file = function(x){
        return ctrl.dir(x)+"/GET.json";
    }

    this.jobs = function(context, node){
        var jobs = [];
        var p = ctrl.params(context, node.entry);
        for(var i in p){
            var url = format(node.url,p[i]);
            jobs.push({
                first : url,
                next : node.then
            });
        }
        return jobs;
    }
    
    this.handle = function(steps, context){
        if(!steps) return;

        for(var i in steps){
            var jb = ctrl.jobs(context, steps[i]);
            for(var j in jb){
                this.execute(jb[j]);
            }
        }
    }

    this.execute = function(job){
        mkdirp(dir(job.first), function (err) {
            if (!err) {
                client.get(job.first, function(err, res, body) {
                    if(!err){
                        jsonfile.writeFile(file(job.first), body, function (err) {
                            if(!err){
                                console.log("[DONE] "+job.first);
                                ctrl.handle(job.next, { previous : body });
                            }
                            else{
                                console.log("Failed to create file for : "+job.first);
                            }
                        });
                    }
                    else {
                        console.log("Failed to create response for : "+job.first);
                    }
                });
            }
            else {
                console.log("Failed to create directory : "+dir(job.first));
            }
        });
    }
    
    ctrl.params = function(context, entry){
        if(!entry){
            return [""];
        }
        if(entry.type === "STAT"){
            return entry.values;
        }
        else {
            var x = jsonQuery(entry.values, {
                data: context
            });
            //console.log(x);
            return x.value;
        }
    }

    ctrl.handle(config.steps, {});

}

module.exports = main;