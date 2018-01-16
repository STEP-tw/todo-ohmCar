let chai = require('chai');
let assert = chai.assert;
let request = require('./requestSimulator.js');
process.env.COMMENT_STORE = "./testStore.json";
let app = require('../app.js');
let th = require('./testHelper.js');

describe('app',()=>{
  describe('#GET /bad',()=>{
    it('responds with 404',done=>{
      request(app,{method:'GET',url:'/bad'},(res)=>{
        assert.equal(res.statusCode,404);
        done();
      })
    })
  })
  describe('#GET /index',()=>{
    it('serves the login page',done=>{
      request(app,{method:'GET',url:'/index'},res=>{
        th.status_is_ok(res);
        th.body_contains(res,'Username:');
        th.body_does_not_contain(res,'Wrong');
        th.should_not_have_cookie(res,'message');
        done();
      })
    })
    it('serves the login page with logInFailed message for invalid user',done=>{
      request(app,{method:'POST',url:'/index',body:'userName=xyz&password=xyz'},res=>{
        th.status_is_ok(res);
        th.body_contains(res,'Wrong');
        done();
      })
    })
    it('serves the home page for loggedin user',done=>{
      request(app,{method:'POST',url:'/index',body:'userName=omkar&password=omkar'},res=>{
        th.should_be_redirected_to(res,'/home');
        done();
      })
    })
  })

  describe('#POST /login',()=>{
    it('gives homePage for valid user',done=>{
      request(app,{method:'POST',url:'/index',body:'userName=omkar&password=omkar'},res=>{
        th.should_be_redirected_to(res,'/home');
        th.should_not_have_cookie(res,'message');
        done();
      })
    })
    it('gives login page for invalid user with message',done=>{
      request(app,{method:'POST',url:'/index',body:'userName=xyz&password=xyz'},res=>{
        th.status_is_ok(res);
        th.should_not_have_cookie(res,'message');
        th.body_contains(res,'Wrong');
        done();
      })
    })
  })
  describe('#/',()=>{
    it('redirects to index page when the url is /',done=>{
      request(app,{method:'GET',url:'/'},res=>{
        th.should_be_redirected_to(res,'/index');
        th.should_not_have_cookie(res,'message');
        done();
      })
    })
  })
  describe('#/home',()=>{
    it('redirects to index page when the url is /home for invalid user',done=>{
      request(app,{method:'GET',url:'/home',body:'userName=xyz&password=xyz'},res=>{
        th.should_be_redirected_to(res,'/index');
        th.should_not_have_cookie(res,'message');
        done();
      })
    });
  })
  describe('#/logout',()=>{
    it('redirects to index page when user was loggedin',done=>{
      request(app,{method:'GET',url:'/logout'},res=>{
        th.should_be_redirected_to(res,'/index');
        done();
      })
    })
    it('redirects to index page even if cookies are not there',done=>{
      request(app,{method:'GET',url:'/logout'},res=>{
        th.should_be_redirected_to(res,'/index');
        th.should_not_have_cookie(res,'message');
        done();
      })
    })
  })
  describe('#/createTodo',()=>{
    it('redirects to index page when user is not loggedin',done=>{
      request(app,{method:'GET',url:'/createTodo'},res=>{
        th.should_be_redirected_to(res,'/index');
        done();
      })
    })
    it('gives createTodo page when user is logged in',done=>{
      request(app,{method:'GET',url:'/createTodo',body:'userName=omkar&password=omkar'},res=>{
        done();
      })
    })
  })

  describe('#/viewTodo',()=>{
    it('redirects to index page when user is not loggedin',done=>{
      request(app,{method:'GET',url:'/viewTodo'},res=>{
        th.should_be_redirected_to(res,'/index');
        th.body_does_not_contain(res,'Title');
        done();
      })
    })
  })

})
