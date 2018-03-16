const utils = require("../utils")();
const keycloakapis = require("../keycloakapis");
global.config = require("../config.js");
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

            global.config = config;
            return true;
        }
        else{
            console.warn("invalid keycloak config");
            return false;
        }
    },
    isUserAuthorised(usertoken, permissions){
        // TBD format the permissions passed in by user;
        let deferred = q.defer();
        keycloakapis.entitlementsApi(usertoken, permissions)
                    .then(function(result){
                        // console.log("isAuthorized: ", result);
                        deferred.resolve(true);
                    })
                    .catch(function(err){
                        console.warn("error: ", err);
                        deferred.reject(false);
                    });
        return deferred.promise;
    }
}