const TodoItem=require('./todoItems.js');
class Todo {
  constructor (title,description,todoItems={}){
    this.title=title;
    this.description=description;
    this.todoItems=todoItems;
  }
  getAllTodoItems(){
    return Object.values(this.todoItems);
  }
  getTitle(){
    return this.title;
  }
  editTitle(newTitle){
    return this.title=newTitle;
  }
  getDescription(){
    return this.description;
  }
  editDescription(newDescription){
    return this.description=newDescription;
  }
  addTodoItems(item){
    this.todoItems[item]=item;
    return this.getAllTodoItems();
  }
  deleteTodoItem(item){
    delete this.todoItems[item];
    return this.getAllTodoItems();
  }
  editTodoItem(itemToEdit,itemToEditWith){
    this.todoItems[itemToEdit]=itemToEditWith;
    return this.getAllTodoItems();
  }
}

module.exports=Todo;
