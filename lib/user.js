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
  getTodoTitles(){
    return this.todos.map(todo=>todo.title);
  }
  editTodoTitle(title,newTitle){
    return this.todos.find(todo=>{
      todo.title=newTitle;
    });
  }
  editTodoDescription(description,newDescription){
    return this.todos.find(todo=>{
      todo.description=newDescription;
    });
  }
}

module.exports=User;
