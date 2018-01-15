const chai=require('chai');
const assert=chai.assert;
const User=require('../lib/user.js');

describe('User',()=>{
  describe('#getAllTodos',()=>{
    it('should return all the todos',done=>{
      let user=new User('omkar');
      assert.deepEqual(user.getTodos(),[]);
      user.addTodo('Washing Clothes','need to wash clothes on every sunday',{
        "washing white shirt":"washing white shirt"
      });
      assert.deepEqual(user.getTodos(),[{
        "title":"Washing Clothes",
        "description":"need to wash clothes on every sunday",
        "todoItems":{
          "washing white shirt":"washing white shirt"
        }
      }]);
      done();
    });
  });
  describe('#getUser',()=>{
    it('should return a name of user',done=>{
      let user=new User('omkar');
      assert.equal(user.getUser(),'omkar');
      done();
    })
  })
});
