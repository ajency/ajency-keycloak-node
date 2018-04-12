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

    it('should accept a config as an object', function(){
        var result = ajencykeycloak.getConfig({"url": "test"});
        expect(result).to.have.property('url');
    });

    it('should accept a config as a json string', function(){
        var result = ajencykeycloak.getConfig('{"url": "test"}');
        expect(result).to.have.property('url');
    });

    it('should accept a config as a relative url', function(){
        var result = ajencykeycloak.getConfig('dummykeykloak.json');
        expect(result).to.have.property('auth-server-url');
    });

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

    it('should allow for user login', function(done){
        ajencykeycloak.login("cyrus@ajency.in","Ajency#123")
            .then(function(res){

            })
            .finally(done);
    });

    it('should get user info for token', function(){
        var result = ajencykeycloak.getUserInfo("eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJvUXFyWWZITmNJejFabDlxbzVCdWUyMzYwdnI4eFQybjdTeWdFelFRZVFjIn0.eyJqdGkiOiJlY2RhMjc3NC0xYTM2LTQzOTEtOTljMi0wYTZkYWYwMWE4OWIiLCJleHAiOjE1MjIyMzUzNDIsIm5iZiI6MCwiaWF0IjoxNTIyMjM1MDQyLCJpc3MiOiJodHRwOi8va2V5Y2xvYWsuZ29vbW8udGVhbS9hdXRoL3JlYWxtcy9Hb29tb0xvY2FsIiwiYXVkIjoibG1zLXdlYmFwcCIsInN1YiI6Ijk2MmFiYzFkLTc1ZDAtNDIxYy1hZmYwLTlhMDQ3YjMyOTk5ZCIsInR5cCI6IkJlYXJlciIsImF6cCI6Imxtcy13ZWJhcHAiLCJub25jZSI6IjA4OWY1NzExLWFlODUtNDdjMi1hZmVjLWExNjY3M2Y4ODJkYSIsImF1dGhfdGltZSI6MTUyMjIzNTA0MCwic2Vzc2lvbl9zdGF0ZSI6ImUyMzM5Y2JjLTQzZDgtNDhiMy1iNTcwLTdlMDcwZDhkMWFiNyIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo5MDAwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7Imxtcy13ZWJhcHAiOnsicm9sZXMiOlsiQWRtaW4iXX0sImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sIm5hbWUiOiJTcmlkYXJhIEFkbWluIEFkbWluIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiYmNfc3JpZGhhckB5YWhvby5jb20iLCJnaXZlbl9uYW1lIjoiU3JpZGFyYSBBZG1pbiIsImZhbWlseV9uYW1lIjoiQWRtaW4iLCJlbWFpbCI6ImJjX3NyaWRoYXJAeWFob28uY29tIn0.aK6OmFDlv3auuTXNUA-Xoc6-fPDnNvf_1aUArWgPDqm0qphueF9cmjw4_jaXUzZepBvhoya6RwnetchvsATqoNEFs2ElefuMW_S3v3edr8RhbbV_WlJnQAeNs4Lj9NjH14O1WN4T6oX7lSlibwvu5yCPcKUsxgOJreMJNQs2494pE9gBEQU6HmMKyXqYD6sLG4OpiaWGCZHZVEHZFs3C3uf1hStFsEQLZuNCtNpB0LYapb7iwP_JcxGt3uqQyNRFg9CBojD6b-BDMpYYbPhIURv1L0iT2jIMf84pZiRDPLXpeEcszUOFYSO1lkvT0rA0_Xe18IbS1tiKqKDh30KykA")
        expect(typeof result).to.equal(typeof {});
    });

    it('should check if user is authorized to access a resource', function(done){
        // var permissions = [
        //     {
        //         "resource_set_name" : "res:lead",
        //         // "scopes":["scopes:view"]
        //     }
        // ]

        var permissions = null;

        ajencykeycloak.isUserAuthorised("eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJKT3lwQ3A5OEIxWlI5SFhtS2Via2ZTWTZqeDVFM3VqWHhfWmloNGRUX3AwIn0.eyJqdGkiOiI0ZmRiZTlkYi1kNDg5LTQ5OTctYTRkMi01M2E4M2IyY2I5M2UiLCJleHAiOjE1MjM1MzgxMDcsIm5iZiI6MCwiaWF0IjoxNTIzNTM3ODA3LCJpc3MiOiJodHRwOi8va2V5Y2xvYWtzZXJ2ZXIuYWplbmN5LmluL2F1dGgvcmVhbG1zL0dvb21vTG9jYWwiLCJhdWQiOiJsbXMtd2ViYXBwIiwic3ViIjoiYzI3YTYxN2QtZjg5ZS00NjI2LTkxMTUtYzdiOWMxM2U2MDU0IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoibG1zLXdlYmFwcCIsIm5vbmNlIjoiYzZkY2ZjZjYtZDdhMy00NmFhLTg1NWItMDZiZjYyMTU4MmNjIiwiYXV0aF90aW1lIjoxNTIzNTM3ODA1LCJzZXNzaW9uX3N0YXRlIjoiMzllODUxNjEtODVkZS00ZGY3LWExMGItMjA2ZTBkYzczNWMzIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwOi8vbG9jYWxob3N0OjkwMDAiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsibG1zLXdlYmFwcCI6eyJyb2xlcyI6WyJBZG1pbiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwibmFtZSI6IlNyaWRhcmEgQWRtaW4gQWRtaW4iLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJiY19zcmlkaGFyQHlhaG9vLmNvbSIsImdpdmVuX25hbWUiOiJTcmlkYXJhIEFkbWluIiwiZmFtaWx5X25hbWUiOiJBZG1pbiIsImVtYWlsIjoiYmNfc3JpZGhhckB5YWhvby5jb20iLCJncm91cC1tZW1iZXJzaGlwIjpbIi9Hb29tbyBPcGVyYXRpb25zIiwiL0ZpbmFuY2UiLCIvQjJCIiwiL1JldGFpbCBicmFuY2giLCIvQ2FsbCBDZW50ZXIiXX0.FuhefJOqQ0ucl58sNHVa469amQFlb1SkuV5r91NvelNlRSwmFvzW18LQ-3AjjS6QvSQWqDII2IieRqQpVsNmg7v9GYOA4qK-wrMh7fPyyv-JsvX8BWTZmbqgTasrSlDObOltQuLjNs___vUwEoYT7NuWmXlvdyfisVrd7z5YAp7v8dWk1MRZ9VTWAJ5ULt9k3ah4NT91h9tO6AWWlcFE-_z25yjxWFY-lA3GPUE9VXYdLKI47-Rodji2r7wJMrTx9lYuwPAImQgvAA015nUg6_RZLVwNmlRtosJpBFQmxGVZGUKg0l9lT3eCsENxkEkrKHVgOh9Z5zT_1mo3v3rTgQ", permissions, 'post')
                    .then(function(result){
                        expect(result).to.equal(true);
                    })
                    .finally(done);
    });
});