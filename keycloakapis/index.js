const utils = require("../utils")();
const q = utils.q;

module.exports = {
    entitlementsApi(token, entitlement){
        let deferred = q.defer();
        // console.log("configoptions", global.config );
        let url = config['auth-server-url'] + '/realms/' + config['realm'] + '/authz/entitlement/' + config.resource;
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
    }
}