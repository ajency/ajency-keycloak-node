const utils = require("../utils")();
const keycloakapis = require("../keycloakapis");
global.INSTALLCONFIG = null;
global.ENDPOINTCONFIG = null;
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

            global.INSTALLCONFIG = config;
            this.getEndpointConfig();
            return true;
        }
        else{
            console.warn("invalid keycloak config");
            return false;
        }
    },
    getEndpointConfig(){
        let deferred = q.defer();
        if(global.endpointconfig === null){
            keycloakapis.configurationApi()
            .then(function(res){
                console.log("discover endpoints:",res.body);
                global.ENDPOINTCONFIG = res.body;
                deferred.resolve(res.body);
            })
            .catch(function(err){
                console.warn("endpoints error:",res.body);
                deferred.reject(err);
            });
        }
        else{
            deferred.resolve(global.endpointconfig);
        }
        return deferred.promise;
    },
    isUserAuthorised(usertoken, permissions){
        // TBD format the permissions passed in by user;
        let entitlements = {
            permissions: permissions
        }

        let deferred = q.defer();
        keycloakapis.entitlementsApi(usertoken, entitlements)
                    .then(function(result){
                        // console.log("isAuthorized: ", result);
                        deferred.resolve(true);
                    })
                    .catch(function(err){
                        console.warn("isUserAuthorised error");
                        deferred.reject(false);
                    });
        return deferred.promise;
    },
    protect(permissions){ // middleware for protecting resource
        return function(request, response, next){
            this.isUserAuthorised(token,permissions)
                .then(function(result){
                    next(result);
                })
                .catch(function(err){
                    response.status(401).response({error: err});
                });
        }
    }
}