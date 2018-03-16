Ajency keycloak auth utility
=========

A small library that supports authentication for Keycloak.

## Installation

  `npm install --save git+https://github.com/ajency/ajency-keycloak-node.git`

## Usage

```
  const keycloakConfig = require('./keycloak.json'); // your keycloak configuration file
  const ajauth = require('@ajency-keycloak/node');

  ajauth.init(keycloakConfig);

  var dashboard_perm = { // your resource and scope premissions
      "permissions" : [
              {
                  "resource_set_name" : "res:lead",
                  "scopes":["scopes:view"]
              }
          ]
      };

var authMiddleware = function(){
  return function(request, response, next){
        ajauth.isUserAuthorised(request.keycloak_access_token, dashboard_perm) // your keycloak access token & resource permissions
                    .then(function(result){
                        console.log("user authorized");
                        next();
                    })
                    .catch(function(err){
                      console.warn("user not authorized");
                      response.redirect("/not-authorized");
                    })
  }    
}

app.get("/user-data",authMiddleware(),function(request, response){
  response.render("user-data");
});

```

## Tests

  `npm run test`

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.