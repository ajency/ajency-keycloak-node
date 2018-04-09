"use strict";

const utils = require("../utils")();
const keycloakapis = require("../keycloakapis");
global.INSTALLCONFIG = null;
global.ENDPOINTCONFIG = null;
const q = utils.q;

module.exports = function(config){
    function init(config){
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
                console.warn("'resource' key missing");
                return false;
            }

            global.INSTALLCONFIG = config;
            getEndpointConfig();
            return true;
        }
        else{
            console.warn("invalid keycloak config");
            return false;
        }
    }

    function getEndpointConfig(){
        let deferred = q.defer();
        if(global.ENDPOINTCONFIG === null){
            keycloakapis.openidConfigurationApi()
            .then(function(res){
                global.ENDPOINTCONFIG = JSON.parse(res.body);
                deferred.resolve(global.ENDPOINTCONFIG);
            })
            .catch(function(err){
                console.warn("kc endpoints error:",res.body);
                deferred.reject(err);
            });
        }
        else{
            deferred.resolve(global.ENDPOINTCONFIG);
        }
        return deferred.promise;
    }

    function login(user, pass){
        let deferred = q.defer();
        getEndpointConfig()
            .then(function(){
                keycloakapis.loginApi(user, pass)
                .then(function(res){
                    deferred.resolve(res);
                })
                .catch(function(err){
                    deferred.reject(err);
                });
            })
            .catch(function(er){
                deferred.reject(err);
            })
        return deferred.promise;
    }

    function getUserInfo(accesstoken){
        try{
            return utils.jwt.decode(accesstoken);
        }
        catch(e){
            return "Invalid token";
        }

    }

    function isUserAuthorised(usertoken, permissions, method){
        // TBD format the permissions passed in by user;
        let entitlements = {
            permissions: permissions
        }

        let deferred = q.defer();
        getEndpointConfig()
            .then(function(res){
                keycloakapis.entitlementsApi(usertoken, entitlements, method)
                .then(function(result){
                    deferred.resolve(result);
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
    }

    function getTokenFromRequest(request){
        let tokenpayload = request.get("Authorization");
        let token = tokenpayload && tokenpayload.indexOf("Bearer ") !== -1 ? tokenpayload.split("Bearer ")[1] : null;
        return token;
    }

    function protect(permissions){ // middleware for protecting resource

        return function(request, response, next){ // get token from auth header

                let token  = getTokenFromRequest(request);

                if(token){
                    isUserAuthorised( token, permissions, permissions && permissions.length ? 'post' : 'get')
                    .then(function(result){
                        response.locals.userpermissions = getUserPermissions(result.body);
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

    function getUserPermissions(jsonbody){
        try{
            if(jsonbody){
                var resultjson = typeof jsonbody === 'string' ? JSON.parse(jsonbody) : jsonbody;
   
                if(resultjson.rpt){
                    var decodedrpt = utils.jwt.decode(resultjson.rpt);

                    if(typeof decodedrpt === 'object'){
                        return decodedrpt;
                    }
                    else{
                        return null;
                    }
                }
                else{
                    return null;
                }
            }
            else{
                return null;
            }
        }
        catch(e){
            console.warn("rpt fetch error: ", e);
            return null;
        }
    }

    function hasAccess(permissions, response){ // to be used within controller

        if(response.locals && response.locals.userpermissions){
            var decoded_rpt = response.locals.userpermissions;
            if(permissions && permissions.length){
                if(decoded_rpt && decoded_rpt.authorization && decoded_rpt.authorization.permissions && decoded_rpt.authorization.permissions.length){
                    // check for permissions here
                    var rpt_permissions = decoded_rpt.authorization.permissions;
    
                    var permission_status = true;
                    rpt_permissions.map(function(rpt_perm){
                        var req_perm = permissions.find(function(perm){
                            return perm.resource_set_name === rpt_perm.resource_set_name;
                        });
    
                        if(req_perm){
    
                            if(req_perm.scopes && rpt_perm.scopes){
                                var scopematch = true;
                                req_perm.scopes.map(function(reqscope){
                                    var found = rpt_perm.scopes.some(function(resscope){
                                        return reqscope === resscope;
                                    });
    
                                    if(!found)
                                        scopematch = false;
    
                                });
        
                                if(!scopematch){
                                    console.warn("missing scope match for ", rpt_perm.resource_set_name);
                                    permission_status = scopematch;
                                    return permission_status;
                                }
    
                            }
                            else{
                                if(!req_perm.scopes && !rpt_perm.scopes){
                                    console.warn("no scopes present");
                                    return true;
                                }
                                else{
                                    console.warn("scopes mismatch");
                                    permission_status = false;
                                    return permission_status;
                                }
    
                            }
        
                        }
                        else{
                            console.warn(rpt_perm.resource_set_name + " not present");
                            permission_status = false;
                            return permission_status;
                        }
                    }); // end rpt_permissions map 
    
                    console.log("permissions status: ", permission_status);
                    return permission_status;
                }
                else{
                    console.warn("no permissions in rpt");
                    return false;
                }
            }
            else{
                return true;
            }
        }
        else{
            console.warn("no locals present")
            return false;
        }
    }

    if(config)
        init(config);

    return {
        init: init,
        getEndpointConfig: getEndpointConfig,
        login: login,
        getUserInfo: getUserInfo,
        isUserAuthorised: isUserAuthorised,
        getTokenFromRequest: getTokenFromRequest,
        protect: protect,
        getUserPermissions: getUserPermissions,
        hasAccess: hasAccess
    }
}