const utils = require("../utils")();
const keycloakapis = require("../keycloakapis");
var config = require("../config.js");
const q = utils.q;

module.exports = {
    init(config){
        if(Object.keys(config).length > 0){
            if(!config["auth-server-url"]){
                console.warn("'auth-server-url' key missing");
                return false;
            }

            if(!config["realm"]){
                console.warn("'realm' key missing");
                return false;
            }

            if(!config["resource"]){
                console.log("'resource' key missing");
                return false;
            }

            config = config;
            return true;
        }
        else{
            console.warn("invalid keycloak config");
            return false;
        }
    },
    isUserAuthorised(usertoken, permissions){
        // TBD format the permissions passed in by user;
        keycloakapis.entitlementsApi(usertoken, permissions);
        console.log("authentication successful!");
    },
    makeGETRequest(url){
        let deferred = q.defer();
        utils.makeRequest(url)
                .then(function(res){
                    console.log("suuceesss load");
                    deferred.resolve(res);
                })
                .catch(function(err){
                    console.warn("failure",err);
                    deferred.reject(err);
                });
        
        return deferred.promise;
    }
}