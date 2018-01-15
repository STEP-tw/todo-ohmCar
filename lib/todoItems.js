class TodoItem{
  constructor(item){
    this.item=item;
    this.status=false;
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
