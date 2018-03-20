const request = require("request");
const q = require("q");

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

            console.log("options", options);
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

    var validConfig = function(){
        console.log(ENDPOINTCONFIG, INSTALLCONFIG)
        if(ENDPOINTCONFIG && INSTALLCONFIG){
            return true;
        }
        else{
            return false;
        }
    }
    
    var utils = {
        request: request,
        q: q,
        makeRequest: makeRequest,
        validConfig: validConfig
    };
    
    return utils;
}