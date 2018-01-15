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

  describe('#getTodoTitles',()=>{
    it('should return a titles of all the todos',done=>{
      let user=new User('omkar');
      user.addTodo('Washing Clothes','need to wash clothes on every sunday',{
        "washing white shirt":"washing white shirt"
      });
      assert.deepEqual(user.getTodoTitles(),['Washing Clothes']);
      user.addTodo('Watching a movie','Wanna watch movie tonight',{
        "horror movie":"horror movie"
      });
      assert.deepEqual(user.getTodoTitles(),['Watching a movie','Washing Clothes']);
      done();
    })
  })

  describe('#editTodoTitle',()=>{
    it('should edit the todo title',done=>{
      let user=new User('omkar');
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
      user.editTodoTitle('Washing Clothes','Clothe Washing');
      assert.deepEqual(user.getTodos(),[{
        "title":"Clothe Washing",
        "description":"need to wash clothes on every sunday",
        "todoItems":{
          "washing white shirt":"washing white shirt"
        }
      }]);
      done();
    })
  })

  describe('#editTodoDescription',()=>{
    it('should edit the todo description',done=>{
      let user=new User('omkar');
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
      user.editTodoDescription(
        'need to wash clothes on every sunday','need to wash clothes tonight'
      );
      assert.deepEqual(user.getTodos(),[{
        "title":"Washing Clothes",
        "description":"need to wash clothes tonight",
        "todoItems":{
          "washing white shirt":"washing white shirt"
        }
      }]);
      done();
    })
  })
});
