const request = require("request");
const q = require("q");
const jwt = require("jsonwebtoken");

module.exports = function(){
    var makeRequest = function(url, method, body, headers, bodytype){
            var deferred = q.defer();

            var options = {
                url: url,
                method: method || "GET",
                json: bodytype === "json" ? true : false,
                body: body || null,
                headers: headers || null
            };

            // console.log("options", options);
            request(options,function(err, response, body){
                if(err){
                    deferred.reject(err);
                    return;
                }

                if(response.statusCode == 200){
                    deferred.resolve({
                        reponse: response,
                        body: body
                    });
                }
                else{
                    deferred.reject(response);                
                }
            });
            return deferred.promise;
        };

    var validateConfig = function(callback, deferred, message){
        if(ENDPOINTCONFIG && INSTALLCONFIG){
            if(typeof callback === 'function'){
                callback();
            }
            else{
                deferred.reject("invalid callback");
            }
        }
        else{
            deferred.reject(message || "invalid config");
        }
    }
    
    var utils = {
        request: request,
        q: q,
        jwt: jwt,
        makeRequest: makeRequest,
        validateConfig: validateConfig
    };
    
    return utils;
}