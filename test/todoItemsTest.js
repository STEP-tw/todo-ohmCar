const chai=require('chai');
const assert=chai.assert;
const TodoItem=require('../lib/todoItems.js');

describe('TodoItem',()=>{
  describe('#getStatus',()=>{
    it('should return true if the item is marked as done',done=>{
      let todoItem=new TodoItem('Watching horror movie');
      todoItem.markAsDone();
      assert.isOk(todoItem.getStatus());
      done();
    });
    it('should return false if the item is marked as not done',done=>{
      let todoItem=new TodoItem('Watching horror movie');
      todoItem.markAsNotDone();
      assert.isNotOk(todoItem.getStatus());
      done();
    });
  });
});
