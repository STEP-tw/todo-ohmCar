const chai=require('chai');
const assert=chai.assert;
const Todo=require('../lib/todo.js');

describe('todo',()=>{
  describe('#getAllTodoItems',()=>{
    it('should return all the todo items user having',done=>{
      let todo=new Todo(
        'Washing Clothes','need to wash clothes on every sunday',{1:"washing white shirt"}
      );
      assert.deepEqual(todo.getAllTodoItems(),["washing white shirt"]);
      done();
    });
  });
  describe('#getTitle',()=>{
    it('should return the todo title',done=>{
      let todo=new Todo(
        'Washing Clothes','need to wash clothes on every sunday',{1:"washing white shirt"}
      );
      assert.equal(todo.getTitle(),'Washing Clothes');
      done();
    });
  });
  describe('#getAllTodoItems',()=>{
    it('should return the description of the todo',done=>{
      let todo=new Todo(
        'Washing Clothes','need to wash clothes on every sunday',{1:"washing white shirt"}
      );
      assert.equal(todo.getDescription(),'need to wash clothes on every sunday');
      done();
    });
  });
});