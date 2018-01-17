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
  describe('#getItem',()=>{
    it('should return item name',done=>{
      let todoItem=new TodoItem('Watching horror movie');
      assert.equal(todoItem.getItem(),'Watching horror movie');
      done();
    })
  })
  describe('#editItem',()=>{
    it('should return item name',done=>{
      let todoItem=new TodoItem('Watching horror movie');
      assert.equal(todoItem.editItem('having dinner'),'having dinner');
      done();
    })
  })
  describe('#markAsDone',()=>{
    it('should return status as true after marking item as done',done=>{
      let todoItem=new TodoItem('Watching horror movie');
      todoItem.markAsDone();
      assert.isOk(todoItem.status);
      done();
    })
  });
  describe('#markAsNotDone',()=>{
    it('should return status as false after marking item as not done',done=>{
      let todoItem=new TodoItem('Watching horror movie');
      todoItem.markAsNotDone();
      assert.isNotOk(todoItem.status);
      done();
    })
  })
});
