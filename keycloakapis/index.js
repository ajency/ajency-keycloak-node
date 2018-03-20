const utils = require("../utils")();
const q = utils.q;

module.exports = {
    loginApi(username, password){
        let deferred = q.defer();

        if(utils.validConfig()){
            let endpoint = JSON.parse(ENDPOINTCONFIG);
           
            let url = endpoint["token_endpoint"];
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
        }
        else{
            deferred.reject("Missing config for login");
        }

        return deferred.promise;
    },
    refreshtokenApi(refresh_token){
        let deferred = q.defer();

        if(utils.validConfig()){
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
        }
        else{
            deferred.reject("Missing config fro refresh token");
        }

        return deferred.promise;
    },
    entitlementsApi(token, entitlement){
        let deferred = q.defer();
        // console.log("configoptions", global.config );
        let url = INSTALLCONFIG['auth-server-url'] + '/realms/' + INSTALLCONFIG['realm'] + '/authz/entitlement/' + INSTALLCONFIG.resource;
        let headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
        
        utils.makeRequest(url, "POST", entitlement, headers, "json")
            .then(function(res){
                deferred.resolve(res);
            })
            .catch(function(err){
                deferred.reject(err);
            });

        return deferred.promise;
    },
    openidConfigurationApi(){
        let deferred = q.defer();

        let url = INSTALLCONFIG['auth-server-url'] + '/realms/' + INSTALLCONFIG['realm'] + '/.well-known/openid-configuration';

        utils.makeRequest(url)
            .then(function(result){
                deferred.resolve(result);
            })
            .catch(function(err){
                deferred.reject(err);
            });

        return deferred.promise;
    }
}