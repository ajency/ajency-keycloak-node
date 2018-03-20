'use strict';
var chai = require('chai');
var should = require('should');
var expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var ajencykeycloak = require('../index');
const keycloakconfig = require("../dummykeykloak.json");

describe('#ajencykeycloak', function() {
    this.timeout(10000);
    it('should accept keycloak configuration from user', function() {
        var result = ajencykeycloak.init(keycloakconfig);
        expect(result).to.equal(true);
    });

    it('should discovery keycloak specify endpoints', function(done){
        setTimeout(function(){
            ajencykeycloak.getEndpointConfig()
            .then(function(res){
                // expect(res).to.rejected();
            })
            .finally(done);
        },5000);
    });

    // it('should discovery keycloak specify endpoints on second pass', function(done){
    //     ajencykeycloak.getEndpointConfig()
    //                 .then(function(res){
    //                     // expect(res).to.rejected();
    //                 })
    //                 .finally(done);
    // });

    // it('should discovery keycloak specify endpoints on third pass', function(done){
    //     ajencykeycloak.getEndpointConfig()
    //                 .then(function(res){
    //                     // expect(res).to.rejected();
    //                 })
    //                 .finally(done);
    // });

    it('should allow for user login', function(done){
        ajencykeycloak.login("cyrus@ajency.in","Ajency#123")
            .then(function(res){

            })
            .finally(done);
    });

    // it('should check if user is authorized to access a resource', function(done){
    //     var permissions = [
    //         {
    //             "resource_set_name" : "res:lead",
    //             // "scopes":["scopes:view"]
    //         }
    //     ]

    //     ajencykeycloak.isUserAuthorised("eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI1clY3czA5QTBrcmxVWldBTU5SSnNHWVVFUm5EbW5lU1M4WjJGSk43ZHE4In0.eyJqdGkiOiI5OGE0MWRhOS01Mjg1LTQyYzQtYjhlMC1hZTZkOWE0NDU3Y2EiLCJleHAiOjE1MjExODYzNzIsIm5iZiI6MCwiaWF0IjoxNTIxMTg2MDcyLCJpc3MiOiJodHRwOi8va2V5Y2xvYWtzZXJ2ZXIuYWplbmN5LmluL2F1dGgvcmVhbG1zL0dvb21vVGVzdCIsImF1ZCI6IkxNUy1iYWNrZW5kLU5vZGUiLCJzdWIiOiI1NWZmOWM4My0xZjM2LTRlZmItODFlNS02MjBlMTRhN2JlNTAiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJMTVMtYmFja2VuZC1Ob2RlIiwiYXV0aF90aW1lIjoxNTIxMTg1Njk3LCJzZXNzaW9uX3N0YXRlIjoiMmZkMThmMzMtNTUwNC00YzZkLTlkMDYtMmRlMzc1NDYxZjg4IiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwOi8vbG9jYWxob3N0OjMxMDAiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiTE1TLWJhY2tlbmQtTm9kZSI6eyJyb2xlcyI6WyJBZG1pbiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwibmFtZSI6IkN5cnVzIEYuIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiY3lydXMiLCJnaXZlbl9uYW1lIjoiQ3lydXMiLCJmYW1pbHlfbmFtZSI6IkYuIiwiZW1haWwiOiJjeXJ1c0BhamVuY3kuaW4ifQ.T4wepkJ7VV1taD6kcY67M6a-pEIdO4s4ETGPSs2fyBSmsv_WvNB8bvl_ZvBeXERQGMrh0m_AW9WR5DLtdM_St3WZtecxfiQfCRfLzRVGbwhMiN3qZjsc4vpoeKoOXW6UcODmiI08PssBnQmK9QIiELUeFZEYCvhgXm7TEyMgCtzivbHjUAkbVctD6F7t5I9GlxmbVleblD2UJUon3Ru43Di1oCdF-_3CKVzbAq_qWqMYFi0BDEC8Pm29NfPHm3oIjI2AA82h3kN4n6ofWr7cZnLl3BtLYcxO1H65U5A95iQyJGDgsbhFvTmpAidWt_2raDHLN9Nk2JJcnEFYqw10oQ", permissions)
    //                 .then(function(result){
    //                     expect(result).to.equal(true);
    //                 })
    //                 .finally(done);
    // });
});