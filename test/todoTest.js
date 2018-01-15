const chai=require('chai');
const assert=chai.assert;
const Todo=require('../lib/todo.js');

describe('todo',()=>{
  describe('#getAllTodoItems',()=>{
    it('should get all the todo items user having',done=>{
      let todo=new Todo(
        'Washing Clothes','need to wash clothes on every sunday',{1:"washing white shirt"}
      );
      assert.deepEqual(todo.getAllTodoItems(),["washing white shirt"]);
      done();
    });
  });
});
