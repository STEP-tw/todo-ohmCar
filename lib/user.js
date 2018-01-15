const Todo=require('./todo.js');
class User {
  constructor(name){
    this.name=name;
    this.todos=[];
  }
  addTodo(title,description,todoItems={}){
    let todo=new Todo(title,description,todoItems);
    this.todos.unshift(todo);
  }
  getTodos(){
    return this.todos;
  }
  getUser(){
    return this.name;
  }
}

module.exports=User;
