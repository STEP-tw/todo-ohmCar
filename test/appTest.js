let chai = require('chai');
let assert = chai.assert;
let request = require('./requestSimulator.js');
process.env.COMMENT_STORE = "./testStore.json";
let app = require('../app.js');
let th = require('./testHelper.js');

describe('app',()=>{
  describe('GET /bad',()=>{
    it('responds with 404',done=>{
      request(app,{method:'GET',url:'/bad'},(res)=>{
        assert.equal(res.statusCode,404);
        done();
      })
    })
  })
  describe('GET /index.html',()=>{
    it('serves the login page',done=>{
      request(app,{method:'GET',url:'/index.html'},res=>{
        th.status_is_ok(res);
        th.body_contains(res,'Username:');
        th.body_does_not_contain(res,'login failed');
        th.should_not_have_cookie(res,'message');
        done();
      })
    })
  })

  describe('POST /login',()=>{
    it('gives to homePage for valid user',done=>{
      request(app,{method:'POST',url:'/index.html',body:'userName=omkar&password=omkar'},res=>{
        th.status_is_ok(res);
        th.should_not_have_cookie(res,'message');
        done();
      })
    })
    it('gives login page for invalid user with message',done=>{
      request(app,{method:'POST',url:'/index.html',body:'userName=xyz&password=xyz'},res=>{
        th.status_is_ok(res);
        th.should_not_have_cookie(res,'message');
        th.body_contains(res,'Wrong');
        done();
      })
    })
  })
})
