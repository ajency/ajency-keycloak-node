'use strict';
var chai = require('chai');
var should = require('should');
var expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var ajencykeycloak = require('../index')();
const keycloakconfig = require("../dummykeykloak.json");

describe('#ajencykeycloak', function() {
    this.timeout(10000);
    it('should accept keycloak configuration from user', function() {
        var result = ajencykeycloak.init(keycloakconfig);
        expect(result).to.equal(true);
    });

    // it('should accept a config as an object', function(){
    //     var result = ajencykeycloak.getConfig({"url": "test"});
    //     expect(result).to.have.property('url');
    // });

    // it('should accept a config as a json string', function(){
    //     var result = ajencykeycloak.getConfig('{"url": "test"}');
    //     expect(result).to.have.property('url');
    // });

    // it('should accept a config as a relative url', function(){
    //     var result = ajencykeycloak.getConfig('dummykeykloak.json');
    //     expect(result).to.have.property('auth-server-url');
    // });

    // it('should accept a config as a remote url', function(){
    //     var result = ajencykeycloak.getConfig('http://localhost:5000/keycloak.json');
    //     expect(result).to.have.property('url');
    // });
    
    it('should discovery keycloak specify endpoints', function(done){
            ajencykeycloak.getEndpointConfig()
            .then(function(res){
                // expect(res).to.rejected();
            })
            .finally(done);
    });

    // it('should allow for user login', function(done){
    //     ajencykeycloak.login("cyrus@ajency.in","Ajency#123")
    //         .then(function(res){

    //         })
    //         .finally(done);
    // });

    // it('should get user info for token', function(){
    //     var result = ajencykeycloak.getUserInfo("eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJvUXFyWWZITmNJejFabDlxbzVCdWUyMzYwdnI4eFQybjdTeWdFelFRZVFjIn0.eyJqdGkiOiJlY2RhMjc3NC0xYTM2LTQzOTEtOTljMi0wYTZkYWYwMWE4OWIiLCJleHAiOjE1MjIyMzUzNDIsIm5iZiI6MCwiaWF0IjoxNTIyMjM1MDQyLCJpc3MiOiJodHRwOi8va2V5Y2xvYWsuZ29vbW8udGVhbS9hdXRoL3JlYWxtcy9Hb29tb0xvY2FsIiwiYXVkIjoibG1zLXdlYmFwcCIsInN1YiI6Ijk2MmFiYzFkLTc1ZDAtNDIxYy1hZmYwLTlhMDQ3YjMyOTk5ZCIsInR5cCI6IkJlYXJlciIsImF6cCI6Imxtcy13ZWJhcHAiLCJub25jZSI6IjA4OWY1NzExLWFlODUtNDdjMi1hZmVjLWExNjY3M2Y4ODJkYSIsImF1dGhfdGltZSI6MTUyMjIzNTA0MCwic2Vzc2lvbl9zdGF0ZSI6ImUyMzM5Y2JjLTQzZDgtNDhiMy1iNTcwLTdlMDcwZDhkMWFiNyIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo5MDAwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7Imxtcy13ZWJhcHAiOnsicm9sZXMiOlsiQWRtaW4iXX0sImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sIm5hbWUiOiJTcmlkYXJhIEFkbWluIEFkbWluIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiYmNfc3JpZGhhckB5YWhvby5jb20iLCJnaXZlbl9uYW1lIjoiU3JpZGFyYSBBZG1pbiIsImZhbWlseV9uYW1lIjoiQWRtaW4iLCJlbWFpbCI6ImJjX3NyaWRoYXJAeWFob28uY29tIn0.aK6OmFDlv3auuTXNUA-Xoc6-fPDnNvf_1aUArWgPDqm0qphueF9cmjw4_jaXUzZepBvhoya6RwnetchvsATqoNEFs2ElefuMW_S3v3edr8RhbbV_WlJnQAeNs4Lj9NjH14O1WN4T6oX7lSlibwvu5yCPcKUsxgOJreMJNQs2494pE9gBEQU6HmMKyXqYD6sLG4OpiaWGCZHZVEHZFs3C3uf1hStFsEQLZuNCtNpB0LYapb7iwP_JcxGt3uqQyNRFg9CBojD6b-BDMpYYbPhIURv1L0iT2jIMf84pZiRDPLXpeEcszUOFYSO1lkvT0rA0_Xe18IbS1tiKqKDh30KykA")
    //     expect(typeof result).to.equal(typeof {});

    it('should check if user is authorized to access a resource', function(done){
        var permissions = [
            {
              "resource_set_name" : "res:leads",
              "scopes":["scopes:leads-data-all","scopes:leads-data-assignedto-same-group","scopes:leads-data-assignedto-same-company","scopes:leads-data-assignedto-self"]
            }
          ]


        ajencykeycloak.isUserAuthorised("eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJkMzVURlhRTHdCWmVJOHNKX0JNZks1aXA4Vm15RG5VcHpYNHkwWjgxbnpJIn0.eyJqdGkiOiJlNjQ1YzcxNC0zMDgwLTQ3ODktYjQ2Ni02NDQzMjA4MTFkMGUiLCJleHAiOjE1MjY1NTcxNDQsIm5iZiI6MCwiaWF0IjoxNTI2NTU2ODQ0LCJpc3MiOiJodHRwczovL2tleWNsb2FrLmdvb21vLnRlYW0vYXV0aC9yZWFsbXMvR29vbW9TdGFnaW5nIiwiYXVkIjoibG1zLXdlYmFwcCIsInN1YiI6IjIyYjFjZjEzLTA4YTYtNDViMS04ZWRkLTZhMmIzODI2M2I4MyIsInR5cCI6IkJlYXJlciIsImF6cCI6Imxtcy13ZWJhcHAiLCJub25jZSI6ImE1Mjc5NTExLTNhMGQtNGM5My1hOGQ4LTg3NDcxOTZiM2I1OCIsImF1dGhfdGltZSI6MTUyNjU1MzIxNSwic2Vzc2lvbl9zdGF0ZSI6IjYwZTgzMzYyLTkxOTUtNDNlMC1hNGQ3LTQ5NTg3MzRjMTcxMyIsImFjciI6IjAiLCJhbGxvd2VkLW9yaWdpbnMiOlsiKiIsImh0dHA6Ly9sb2NhbGhvc3Q6OTAwMCJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJsbXMtd2ViYXBwIjp7InJvbGVzIjpbIkFkbWluIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJuYW1lIjoiU3JpZGFyYSBBZG1pbiBBZG1pbiIsInByZWZlcnJlZF91c2VybmFtZSI6ImJjX3NyaWRoYXJAeWFob28uY29tIiwiZ2l2ZW5fbmFtZSI6IlNyaWRhcmEgQWRtaW4iLCJmYW1pbHlfbmFtZSI6IkFkbWluIiwiZW1haWwiOiJiY19zcmlkaGFyQHlhaG9vLmNvbSIsImdyb3VwLW1lbWJlcnNoaXAiOlsiL0NhbGwgQ2VudGVyIiwiL0dvb21vIE9wZXJhdGlvbnMiLCIvRmluYW5jZSIsIi9SZXRhaWwgYnJhbmNoIiwiL0IyQiJdfQ.gyrEG2WC0pAGRz9Sk-bFVxq53aa1dFly-5xI_gvNcRCfx_KS-x_FhcdVjTfQW8hoerdYG7K8LjMvlPkRtBdXoc-K9kCg1CxomGm3ZMotkW-niXLbcqGD55ol-TMUmhwCfOo25lUsEuSTBqajutyOnzr_UPeN4uoFkF9WQoC8ABv11k56PoWQc_GhfNia0P4LK67tqp-CBIrpog2ABBpQh7eGnAqB4JPCYwo1lVrar8HASc_gw96wJ--t4Qik9ZvEGcl3aZwesKTXfWMY8NDxcWthbeSdsXVwuhx8zrhC7dWrLyg_eRtok78de_Xcp5RC0gM4jP4z5reWFz1KQCwIVQ", permissions, 'post')
                    .then(function(result){
                        expect(result).to.equal(true);
                    })
                    .finally(done);
    });


    it("should get user roles", function(){
        var result = ajencykeycloak.getUserRoles();
        console.log("user roles", result)
        expect(result).to.not.equal(null);
    });
});