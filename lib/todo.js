class Todo {
  constructor (title,description,todoItems={}){
    this.title=title;
    this.description=description;
    this.todoItems=todoItems;
    this.count=1;
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
    this.count++;
    this.todoItems[this.count]=item;
    return this.getAllTodoItems();
  }
  deleteTodoItem(itemCount){
    delete this.todoItems[itemCount];
    return this.getAllTodoItems();
  }
}

module.exports=Todo;
