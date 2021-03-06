Ajency keycloak auth utility
=========

A small node library that supports authentication for Keycloak which can be used with higher abstraction level frameworks like express.

## Installation

  `npm install --save ajency-keycloak-node`

## Basic Usage

```

  const ajauth = require('@ajency-keycloak/node')('keycloak.json'); // pass in your keycloak configuration file path (only paths relative to project root are valid)

  var permissions = [ // your resource and scope premissions
          {
              "resource_set_name" : "res:lead",
              "scopes":["scopes:view"]
          }
      ];

var authMiddleware = function(){
  return function(request, response, next){
        ajauth.isUserAuthorised(request.keycloak_access_token, permissions, 'post') // your keycloak access token & resource permissions
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

app.get("/user-data", authMiddleware(), function(request, response){
  response.render("user-data");
});

```

## Tests

  `npm run test`

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.
