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
  getDescription(){
    return this.description;
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
