Ajency keycloak auth utility
=========

A small library that supports authentication for Keycloak.

## Installation

  `npm install --save git+https://github.com/ajency/ajency-keycloak-node.git`

## Basic Usage

```
  const keycloakConfig = require('./keycloak.json'); // your keycloak configuration file
  const ajauth = require('@ajency-keycloak/node');

  ajauth.init(keycloakConfig);

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

## Method reference
1. [init](#init)
2. [getEndpointConfig](#getendpointconfig)
3. [login](#login)
4. [isUserAuthorised](#isuserauthorised)
5. [protect](#protect)


***
## init

**Syntax**

```
init(<keycloak-config-file>)
```

Arguments: `keycloak-config-file`

**Returned value**

```
Boolean
```

**Description**
Initialize the plugin with the clients installation configuration json downloaded from the keycloak dashboard.

**Possible success response: `status`**
* `true` : "If initialization fails"

**Possible failure response: `error`**
* `false` : "If invalid format of keycloak json file"


***
## getEndpointConfig

**Syntax**

```
getEndpointConfig()
```

Arguments: `none`

**Returned value**

```
Promise<config>
```

**Description**
Gets the well known openid connect endpoints (Note: This method called before invoking any other method).

**Possible success response: `status`**
* `config` : "Endpoint configuration object containing relevant urls"

**Possible failure response: `error`**
* `error` : "If http error"


***
## login

**Syntax**

```
login(<username>,<password>)
```

Arguments: 
* `username` : "Keycloak valid username or email"
* `password` : "Password for username"

**Returned value**

```
Promise<result>
```

**Description**
Logs in the keycloak user using the openid connect token endpoint.

**Possible success response: `status`**
* `response: <response>, body: <json-body>` : "body contains access token & refresh token"

**Possible failure response: `error`**
* `error: <error-status>, error_description: <error-desc>` : "If http error"


***
## isUserAuthorised

**Syntax**

```
isUserAuthorised(<access-token>,<permissions>, <method>)
```

Arguments: 
* `access-token` : "valid keycloak access token"
* `permissions` : "permissions array with required resource name & scopes if needed"
* `method` : "'get' / 'post'"

**Returned value**

```
Promise<any>
```

**Description**
Based on the `access-token` & `permissions` passed in checks for authorization of the requested resource. (Note: If request method is get then checks for `permissions` array are skippped)

**Possible success response: `status`**
* `true` : "If success"

**Possible failure response: `error`**
* `false` : "If failure"


***
## getUserInfo

**Syntax**

```
getUserInfo(<access-token>)
```

Arguments: 
* `access-token` : "valid keycloak access token"

**Returned value**

```
Promise<any>
```

**Description**
Based on the `access-token` passed in retrives basic user info.


***
## protect

**Syntax**

```
protect(<permissions>)
```

Arguments: 
* `permissions` : "Permissions array containing the resource-set-name & scopes required"

**Returned value**

```
Express-middleware
```

**Description**
Middleware wrapper for the `isUserAuthorised` method which takes in a permissions array as argument & checks the `<access-token>` from the Authorization header from the request.



## Tests

  `npm run test`

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.