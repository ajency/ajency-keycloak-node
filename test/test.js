'use strict';
var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var ajencykeycloak = require('../index');
const keycloakconfig = require("../dummykeykloak.json");

describe('#ajencykeycloak', function() {
    it('should accept keycloak configuration from user', function() {
        var result = ajencykeycloak.init(keycloakconfig);
        expect(result).to.equal(true);
    });

    it('should make a get request', function(done){
        ajencykeycloak.makeGETRequest("https://www.google.co.in")
                    .then(function(result){
                        expect(result).to.have("response");
                    })
                    .catch(function(err){
                        expect(err).to.equal({});
                    })
                    .finally(done);

    });
});