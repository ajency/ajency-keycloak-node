const utils = require("../utils")();
const keycloakapis = require("../keycloakapis");
global.INSTALLCONFIG = null;
global.ENDPOINTCONFIG = null;
const q = utils.q;

module.exports = {
    init(config){
        if(config && Object.keys(config).length > 0){
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
        if(global.ENDPOINTCONFIG === null){
            keycloakapis.openidConfigurationApi()
            .then(function(res){
                console.log("discover endpoints:",res.body);
                global.ENDPOINTCONFIG = JSON.parse(res.body);
                deferred.resolve(global.ENDPOINTCONFIG);
            })
            .catch(function(err){
                console.warn("endpoints error:",res.body);
                deferred.reject(err);
            });
        }
        else{
            deferred.resolve(global.ENDPOINTCONFIG);
        }
        return deferred.promise;
    },
    login(user, pass){
        let deferred = q.defer();
        this.getEndpointConfig()
            .then(function(){
                keycloakapis.loginApi(user, pass)
                .then(function(res){
                    console.log("test login success");
                    deferred.resolve(res);
                })
                .catch(function(err){
                    console.log("test login error");
                    deferred.reject(err);
                });
            })
            .catch(function(er){
                deferred.reject(err);
            })
        return deferred.promise;
    },
    getUserInfo(accesstoken){
        let deferred = q.defer();
        this.getEndpointConfig()
            .then(function(){
                keycloakapis.userinfoApi(accesstoken)
                            .then(function(result){
                                deferred.resolve(result.body);
                            })
                            .catch(function(err){
                                deferred.reject(err);
                            });
            })
            .catch(function(err){
                deferred.reject(err);
            });
        deferred.promise;
    },
    isUserAuthorised(usertoken, permissions, method){
        // TBD format the permissions passed in by user;
        let entitlements = {
            permissions: permissions
        }
        console.log("entitlements:", entitlements);
        let deferred = q.defer();
        this.getEndpointConfig()
            .then(function(res){
                keycloakapis.entitlementsApi(usertoken, entitlements, method)
                .then(function(result){
                    // console.log("isAuthorized: ", result);
                    deferred.resolve(true);
                })
                .catch(function(err){
                    console.warn("isUserAuthorised error");
                    deferred.reject(false);
                });
            })
            .catch(function(err){
                deferred.reject(err);
            })
        return deferred.promise;
    },
    protect(permissions){ // middleware for protecting resource
        let self = this;
        return function(request, response, next){ // get token from auth header
            let tokenpayload = request.get("Authorization");

            let token = tokenpayload && tokenpayload.indexOf("Bearer ") !== -1 ? tokenpayload.split("Bearer ")[1] : null;

            console.log("Authorization header token", token);

            if(token){
                self.isUserAuthorised( token, permissions, permissions && permissions.length ? 'post' : 'get')
                .then(function(result){
                    next();
                })
                .catch(function(err){
                    response.status(401).json({message: "Unauthorized request"});
                });
            }
            else{
                response.status(400).json({message: "Bad request"});
            }


        }
    }
}