class TodoItem{
  constructor(item){
    this.item=item;
    this.status=false;
  }
  getItem(){
    return this.item;
  }
  editItem(newName){
    return this.item=newName;
  }
  markAsDone(){
    this.status=true;
  }
  markAsNotDone(){
    this.status=false;
  }
  getStatus(){
    return this.status;
  }
}

module.exports=TodoItem;
