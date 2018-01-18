const fs=require('fs');


let data=require('./data/data.json');

const User=require('./lib/user.js');
const Todo=require('./lib/todo.js');

const timeStamp = require('./time.js').timeStamp;
let toS = o=>JSON.stringify(o,null,2);

exports.logRequest = (req,res)=>{
  let text = ['------------------------------',
  `${timeStamp()}`,
  `${req.method} ${req.url}`,
  `HEADERS=> ${toS(req.headers)}`,
  `COOKIES=> ${toS(req.cookies)}`,
  `BODY=> ${toS(req.body)}`,''].join('\n');
  fs.appendFile('request.log',text,()=>{});

  console.log(`${req.method} ${req.url}`);
}

let registeredUsers=[
  {userName:'omkar',password:'omkar'},
  {userName:'ketan',password:'ketan'},
  {userName:'viraj',password:'viraj'},
  {userName:'harshad',password:'harshad'},
];

exports.loadUser = (req,res)=>{
  let sessionid = req.cookies.sessionid;
  let users = JSON.stringify(registeredUsers);
  let user = JSON.parse(users).find(u=>u.sessionid==sessionid);
  if(sessionid && user){
    req.user = user;
  }
};

exports.redirectNotLoggedInUserToLogin = (req,res)=>{
  if(req.urlIsOneOf([
    '/home','/createTodo','/','/viewTodo','/editItem',
    '/deleteTodo','/editTodo','/login','/addItem'
  ]) && !req.user){
    res.redirect('/index');
  }
}

exports.redirectLoggedinUserToHome = (req,res)=>{
  if(req.urlIsOneOf(['/index','/','/login']) && req.user){
    res.redirect('/home');
  }
}

exports.getIndexPage=(req,res)=>{
  let loginPage=fs.readFileSync('./public/index.html');
  res.setHeader('Content-type','text/html');
  res.write(loginPage);
  res.end();
}

exports.postIndexPage=(req,res)=>{
  let loginPage=fs.readFileSync('./public/index.html');
  res.setHeader('Content-Type','text/html');
  let user = registeredUsers.find(u=>{
    return u.userName==req.body.userName && u.password==req.body.password;
  });
  if(!user){
    res.setHeader('Set-Cookie',`logInFailed=true`);
    res.write(`Wrong Username or Password! <br/>`);
    res.write(loginPage);
    res.end();
    return;
  }
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
  user.sessionid = sessionid;
  res.redirect('/home');
}

exports.getHomePage=(req,res)=>{
  let homePage=fs.readFileSync('./templates/home.html');
  let count=1;
  let user=data.find(u=>u.name==req.user.userName);
  let todos='';
  homePage=homePage.toString().replace(
    'User',`User: ${req.user.userName}`
  );
  if(!user){
    res.write(homePage);
    res.end()
    return;
  }
  user.todos.map(u=>{
    todos+=`<br/> ${count++}. ${u.title}`;
  });
  homePage=homePage.toString().replace(
    'TodoLists',`Your Todos are: ${todos}`
  );
  res.write(homePage);
  res.end();
}

exports.logoutUser=(req,res)=>{
  if(req.user){
    res.setHeader('Set-Cookie',[
      `loginFailed=false,Expires=${
        new Date(1).toUTCString()
      }`,`sessionid=0,Expires=${
        new Date(1).toUTCString()
      }`
    ]);
    delete req.user.sessionid;
  }
  res.redirect('/index');
};

exports.getCreateTodoPage=(req,res)=>{
  let createTodo=fs.readFileSync('./public/createTodo.html');
  res.write(createTodo);
  res.end();
}

exports.postCreateTodoPage=(req,res)=>{
  let user=data.find(u=>{
    return u.name==req.user.userName;
  });
  let id=1;
  let obj={};
  obj[id++]=req.body.item;
  obj["status"]=false;
  if(!user){
    let user=new User(req.user.userName);
    user.addTodo(req.body.title,req.body.description,[obj]);
    data.push(user);
  } else{
    let todo=new Todo(req.body.title,req.body.description,[obj]);
    user.todos.push(todo);
  }
  writeData();
  res.redirect('/home');
  res.end();
}

exports.postViewTodo=(req,res)=>{
  let user=data.find(u=>u.name==req.user.userName);
  let title=user.todos.find(todo=>todo.title==req.body.todoTitle);
  if(!title) return wrongTitleMessage(res);
  let viewTodoPage=fs.readFileSync('./templates/viewTodo.html');
  viewTodoPage=showTodo(viewTodoPage,title);
  res.write(viewTodoPage);
  res.end();
}

exports.getViewTodo=(req,res)=>{
  displayTodoList(req,res);
  res.write(fs.readFileSync('./public/viewTodo.html'));
  res.end();
}

const showTodo=(file,title)=>{
  let id=1;
  let items='';
  file=replace(file,'Title',`Title: ${title.title}`);
  file=replace(file,'description',`Description: ${title.description}`);
  title.todoItems.forEach(item=>{
    items+=`${id}. ${item[id++]} <br/> `
  });
  file=replace(file,'items',`Items: <br/>${items}`);
  return file;
}

exports.getDeleteTodo=(req,res)=>{
  displayTodoList(req,res);
  res.write(fs.readFileSync('./public/deleteTodo.html'));
  res.end();
}

exports.postDeleteTodo=(req,res)=>{
  let user=data.find(u=>u.name==req.user.userName);
  let title=user.todos.find(todo=>todo.title==req.body.deleteTodo);
  if(!title) return wrongTitleMessage(res);
  user.todos=user.todos.filter(todo=>todo.title!=req.body.deleteTodo);
  writeData();
  res.redirect('/home');
}

const replaceValueToEdit=(valueToReplace,file,name)=>{
  file=file.toString().replace(
    `<input type="text" name="${name}" value="" required/>`,
    `<input type="text" name="${name}" value="${valueToReplace}" required/>`
  );
  return file;
}

exports.getEditTodo=(req,res)=>{
  displayTodoList(req,res);
  res.write(fs.readFileSync('./public/editTodo.html'));
  res.end();
}

let allItems;
exports.postEditTodo=(req,res)=>{
  let createTodo=fs.readFileSync('./public/createTodo.html');
  let user=data.find(u=>u.name==req.user.userName);
  let title=user.todos.find(todo=>todo.title==req.body.editTodo);
  if(req.body.description){
    let todo=new Todo(req.body.title,req.body.description,allItems);
    user.todos.push(todo);
    writeData();
    res.redirect('/home');
    return;
  } else if(!title) return wrongTitleMessage(res);
  allItems=title.todoItems;
  createTodo=showValuesInEditForm(createTodo,title);
  user.todos=user.todos.filter(todo=>todo.title!=req.body.editTodo);
  res.write(createTodo);
  res.end();
}

exports.getAddItem=(req,res)=>{
  displayTodoList(req,res);
  res.write(fs.readFileSync('./public/addItem.html'));
  res.end();
}

exports.postAddItem=(req,res)=>{
  let user=data.find(u=>u.name==req.user.userName);
  let title=user.todos.find(todo=>todo.title==req.body.title);
  if(!title) return wrongTitleMessage(res);
  let id=1;
  let arrayOfItems=[];
  let obj={};
  title.todoItems.forEach(item=>{
    obj[id]=item[id++];
    obj['status']=false;
    arrayOfItems.push(obj);
    obj={};
  });
  obj[id++]=req.body.item;
  obj["status"]=false;
  arrayOfItems.push(obj);
  user.todos=user.todos.filter(todo=>todo.title!=req.body.title);
  let todo=new Todo(title.title,title.description,arrayOfItems);
  user.todos.push(todo);
  writeData(res);
  res.redirect('/home');
  res.end();
}

exports.getEditItem=(req,res)=>{
  displayTodoList(req,res);
  res.write(fs.readFileSync('./public/editItem.html'));
  res.end();
}

exports.postEditItem=(req,res)=>{
  let user=data.find(u=>u.name==req.user.userName);
  let title=user.todos.find(todo=>todo.title==req.body.title);
  if(req.body["1"]){
    res.end();
    return;
  }
  if(!title) return wrongTitleMessage(res);
  let id=1;
  res.setHeader('Content-type','text/html');
  let itemValues='';
  title.todoItems.forEach(item=>{
    itemValues+=`<input type="text" value="${item[id]}" name="${id++}" required/><br/><br/>`;
  });
  res.write(
    `<p>Edit Items:</p>
    <form method="POST"> ${itemValues}
    <input type="submit" value="Save"/>`
  );
  res.end();
}


const writeData=()=>{
  fs.writeFile('./data/data.json',JSON.stringify(data,null,2),err=>{
    if(err) return;
  });
}

const displayTodoList=(req,res)=>{
  let count=1;
  let todos='';
  let todoList=fs.readFileSync('./templates/todoList.html').toString();
  let user=data.find(u=>u.name==req.user.userName);
  user.todos.map(u=>{
    todos+=`<br/> ${count++}. ${u.title}`;
  });
  todoList=todoList.toString().replace(
    'TodoLists',`Your Todos are: ${todos}`
  );
  res.write(todoList);
}

const showValuesInEditForm=(file,title)=>{
  file=replaceValueToEdit(title.title,file,'title');
  file=replaceValueToEdit(title.description,file,'description');
  file=replace(file,'TODO Item:<input type="text" name="item" value="" required/>','');
  return file;
}

const replace=(replaceFrom,textToReplace,replaceWith)=>{
  return replaceFrom.toString().replace(textToReplace,replaceWith);
}

const wrongTitleMessage=(res)=>{
  res.write('Enter a valid todo title');
  res.end();
  return;
}
