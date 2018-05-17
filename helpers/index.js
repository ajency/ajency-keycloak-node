"use strict";

const utils = require("../utils")();
const keycloakapis = require("../keycloakapis");
global.INSTALLCONFIG = null;
global.ENDPOINTCONFIG = null;
const q = utils.q;

module.exports = function(config){
    var _decoded_rpt = null;

    function userBelongsToRoles(request, req_roles){
        if(request && req_roles){
            var roles = getUserRoles(request);

            if(roles){
                if(typeof req_roles === 'string'){
                    var present = roles.some(function(role){
                        return role === req_roles;
                    });

                    return present;
                }
                else if(typeof req_roles === 'object' && req_roles.length){
                    var roleresponse = {};

                    req_roles.map(function(req_role){
                        var rolefound = roles.find(function(role){
                            return role === req_role;
                        });

                        if(rolefound){
                            roleresponse[req_role] = true;
                        }
                        else{
                            roleresponse[req_role] = false;
                        }
                    });

                    return roleresponse;
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

    function userBelongsToGroups(request, req_groups){
        if(request && req_groups){
            var groups = getUserGroupMembership(request);

            if(groups){
                if(typeof req_groups === 'string'){
                    var present = groups.some(function(group){
                        return group === req_groups;
                    });

                    return present;
                }
                else if(typeof req_groups === 'object' && req_groups.length){
                    var group_present = {};

                    req_groups.map(function(req_group){
                        var groupfound = groups.find(function(group){
                            return group === req_group;
                        });

                        if(groupfound){
                            group_present[req_group] = true;
                        }
                        else{
                            group_present[req_group] = false;
                        }
                    });

                    return group_present;
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

    function getUserRoles(request){
        if(request){
            var userinfo = getUserInfo(request);
            if(userinfo.resource_access){
                return JSON.parse(JSON.stringify(userinfo.resource_access));
            }
            else{
                return null;
            }

        }
        else{ // get from saved instance of last rpt
            if(_decoded_rpt && _decoded_rpt.resource_access && typeof _decoded_rpt.resource_access === 'object'){
                return JSON.parse(JSON.stringify(_decoded_rpt.resource_access));
            }
            else{
                return null;
            }
        }


    }

    function getUserGroupMembership(request){
        if(request){
            var userinfo = getUserInfo(request);
            if(userinfo["group-membership"]){
                return JSON.parse(JSON.stringify(userinfo["group-membership"]));
            }
            else{
                return null;
            }

        }
        else{ // get from saved instance of last rpt
            if(_decoded_rpt && _decoded_rpt["group-membership"] && typeof _decoded_rpt["group-membership"] === 'object'){
                return JSON.parse(JSON.stringify(_decoded_rpt["group-membership"]));
            }
            else{
                return null;
            }
        }
    }

    function init(config){

        config = getConfig(config);

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

    function getUserInfo(request){
        try{
            var accesstoken = getTokenFromRequest(request);
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
                if(permissions && permissions.length){
                    keycloakapis.entitlementsApi(usertoken, entitlements, method)
                    .then(function(result){
                        deferred.resolve(result);
                    })
                    .catch(function(err){
                        console.warn("isUserAuthorised error");
                        deferred.reject(false);
                    });
                }
                else{
                    // validate the access token
                    keycloakapis.introspectionApi(usertoken, 'access_token')
                        .then(function(result){
                            let body = JSON.parse(result.body);
                            if(body && body.active === false){
                                console.log("introspect invalid")
                                deferred.reject(false);
                            }
                            else{
                                console.log("introspect success");
                                deferred.resolve(result);
                            }
                        })
                        .catch(function(err){
                            console.warn("introspection error");
                            deferred.reject(false);
                        })
                }
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
                        _decoded_rpt = response.locals.userpermissions = getUserPermissions(result.body);
                        // var util = require("util");
                        // console.log("_decoded_rpt",util.inspect(_decoded_rpt, {showHidden: false, depth: null}));
                        next();
                    })
                    .catch(function(err){
                        response.status(401).json({message: "Unauthorized request <a href='#/logout'>Login with another account</a>"});
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

    function getConfig(config){

        if(typeof config === 'object'){
            return config;
        }
        else if(typeof config === 'string'){

            var httpprotocolindex = config.search(/^http[s]?:\/\//);
            if(httpprotocolindex === 0){
                // do ajax call to get json

                // return utils.makeRequest(config)
                //     .then(function(data){
                //         var json = JSON.parse(data.body);
                //         callback(json);
                //     })
                //     .catch(function(err){
                //         callback(null);
                //     });

                return null;
            }
            else if(httpprotocolindex === -1){
                // perform a relative require here
                try{
                    var parsedconfig = JSON.parse(config);
                    return parsedconfig;
                }
                catch(e){
                    var path = process.cwd() + '/' + config;
                    var kcjson = require(path);
                    return kcjson;
                }
            }
            else{
                console.warn("invalid keycloak json file url format");
                return null;
            }
           
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
        hasAccess: hasAccess,
        getConfig: getConfig,
        getUserRoles: getUserRoles,
        getUserGroupMembership: getUserGroupMembership,
        userBelongsToRoles: userBelongsToRoles,
        userBelongsToGroups: userBelongsToGroups
    }
}