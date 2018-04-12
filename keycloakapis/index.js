const utils = require("../utils")();
const q = utils.q;

module.exports = {
    loginApi(username, password){
        let deferred = q.defer();

        utils.validateConfig(function(){
                let url = ENDPOINTCONFIG["token_endpoint"];
                let headers={
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
        
                let body="client_id=" + INSTALLCONFIG["resource"]
                        + "&client_secret=" + INSTALLCONFIG["credentials"]["secret"]
                        + "&username=" + username
                        + "&password=" + password
                        + "&grant_type=password";;
        
                utils.makeRequest(url,'POST',body,headers,'http-params')
                    .then(function(result){
                        deferred.resolve(result);
                    })
                    .catch(function(err){
                        deferred.reject(err);
                    });
            }, deferred, "Missing config for login");

        return deferred.promise;
    },
    userinfoApi(accesstoken){
        let deferred = q.defer();

        utils.validateConfig(function(){
                let url = ENDPOINTCONFIG["userinfo_endpoint"];
                let headers={
                    "Authorization" : "Bearer " + accesstoken
                }
        

                utils.makeRequest(url ,'GET', null , headers,'http-params')
                    .then(function(result){
                        deferred.resolve(result);
                    })
                    .catch(function(err){
                        deferred.reject(err);
                    });
            }, deferred, "Missing config for userinfo");

        return deferred.promise;
    },
    refreshtokenApi(refresh_token){
        let deferred = q.defer();

        utils.validateConfig(function(){
                let url = ENDPOINTCONFIG["token_endpoint"];
                let headers={
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
        
                let body="client_id=" + INSTALLCONFIG["resource"]
                        + "&client_secret=" + INSTALLCONFIG["credentials"]["secret"]
                        + "refresh_token=" + refresh_token
                        + "&grant_type=refresh_token";
        
                utils.makeRequest(url,'POST',body,headers,'http-params')
                    .then(function(result){
                        deferred.resolve(result);
                    })
                    .catch(function(err){
                        deferred.reject(err);
                    });
            }, deferred, "Missing config for refresh token");

        return deferred.promise;
    },
    entitlementsApi(token, entitlement, method){
        let deferred = q.defer();
   
        utils.validateConfig(function(){
            let url = INSTALLCONFIG['auth-server-url'] + '/realms/' + INSTALLCONFIG['realm'] + '/authz/entitlement/' + INSTALLCONFIG.resource;

            let headers, requestpromise;
            if(method === 'post'){
                headers = {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                };
                requestpromise = utils.makeRequest(url, "POST", entitlement, headers, "json");
            }
            else{
                headers = {
                    'Authorization': 'Bearer ' + token
                };
    
                requestpromise = utils.makeRequest(url, "GET", null, headers, "url-params");
            }
    
    
            requestpromise
                .then(function(res){
                    deferred.resolve(res);
                })
                .catch(function(err){
                    deferred.reject(err);
                });
        }, deferred, "Missing config for entitlement");

        return deferred.promise;
    },
    openidConfigurationApi(){
        let deferred = q.defer();

        // utils.validateConfig(function(){
            let url = INSTALLCONFIG['auth-server-url'] + '/realms/' + INSTALLCONFIG['realm'] + '/.well-known/openid-configuration';

            utils.makeRequest(url)
                .then(function(result){
                    deferred.resolve(result);
                })
                .catch(function(err){
                    deferred.reject(err);
                });

        // }, deferred)


        return deferred.promise;
    },
    introspectionApi(token, type){
        let deferred = q.defer();

        utils.validateConfig(function(){

            let url = ENDPOINTCONFIG['token_introspection_endpoint'];

            let base64clientcredentials = Buffer.from(INSTALLCONFIG['resource'] + ":" + INSTALLCONFIG['credentials']['secret']).toString('base64'); // added credentials here
            
            // console.log("base64clientcredentials:",base64clientcredentials);
            headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + base64clientcredentials
            };

            let body = "token_type_hint=" + type
                        + "&token=" + token;

            utils.makeRequest(url, "POST", body, headers)
                .then(function(data){
                    deferred.resolve(data);
                })
                .catch(function(err){
                    deferred.reject(err);
                });

        }, deferred, "Missing config for entitlement");



        return deferred.promise;
    }
}