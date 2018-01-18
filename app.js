const fs=require('fs');

const WebApp = require('./webapp.js');
let data=require('./data/data.json');

const User=require('./lib/user.js');
const Todo=require('./lib/todo.js');

const app=WebApp.create();

let registeredUsers=[
  {userName:'omkar',password:'omkar'},
  {userName:'ketan',password:'ketan'}
];

let loadUser = (req,res)=>{
  let sessionid = req.cookies.sessionid;
  let users = JSON.stringify(registeredUsers);
  let user = JSON.parse(users).find(u=>u.sessionid==sessionid);
  if(sessionid && user){
    req.user = user;
  }
};

let redirectNotLoggedInUserToLogin = (req,res)=>{
  if(req.urlIsOneOf([
    '/home','/createTodo','/','/viewTodo','/deleteTodo','/editTodo','/login'
  ]) && !req.user){
    res.redirect('/index');
  }
}

let redirectLoggedinUserToHome = (req,res)=>{
  if(req.urlIsOneOf(['/index','/','/login']) && req.user){
    res.redirect('/home');
  }
}

const getIndexPage=(req,res)=>{
  let loginPage=fs.readFileSync('./public/index.html');
  res.setHeader('Content-type','text/html');
  res.write(loginPage);
  res.end();
}

const postIndexPage=(req,res)=>{
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

const getHomePage=(req,res)=>{
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

const logoutUser=(req,res)=>{
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

const getCreateTodoPage=(req,res)=>{
  let createTodo=fs.readFileSync('./public/createTodo.html');
  res.write(createTodo);
  res.end();
}

const postCreateTodoPage=(req,res)=>{
  let user=data.find(u=>{
    return u.name==req.user.userName;
  });
  if(!user){
    let user=new User(req.user.userName);
    user.addTodo(req.body.title,req.body.description,{
      "item":req.body.item
    });
    data.push(user);
  } else{
    let todo=new Todo(
      req.body.title,req.body.description,{"item":req.body.item}
    );
    user.todos.push(todo);
  }
  writeData();
  res.redirect('/home');
  res.end();
}

const postViewTodo=(req,res)=>{
  let user=data.find(u=>u.name==req.user.userName);
  let title=user.todos.find(todo=>todo.title==req.body.todoTitle);
  let viewTodoPage=fs.readFileSync('./templates/viewTodo.html');
  viewTodoPage=showTodo(viewTodoPage,title);
  if(!title) return wrongTitleMessage(res);
  res.write(viewTodoPage);
  res.end();
}

const getViewTodo=(req,res)=>{
  displayTodoList(req,res);
  res.write(fs.readFileSync('./public/viewTodo.html'));
  res.end();
}

const showTodo=(file,title)=>{
  file=replace(file,'Title',`Title: ${title.title}`);
  file=replace(file,'description',`Description: ${title.description}`);
  file=replace(file,'items',`Items: ${title.todoItems.item}`);
  return file;
}

const getDeleteTodo=(req,res)=>{
  displayTodoList(req,res);
  res.write(fs.readFileSync('./public/deleteTodo.html'));
  res.end();
}

const postDeleteTodo=(req,res)=>{
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

const getEditTodo=(req,res)=>{
  displayTodoList(req,res);
  res.write(fs.readFileSync('./public/editTodo.html'));
  res.end();
}

const postEditTodo=(req,res)=>{
  let createTodo=fs.readFileSync('./public/createTodo.html');
  let user=data.find(u=>u.name==req.user.userName);
  let title=user.todos.find(todo=>todo.title==req.body.editTodo);
  if(req.body.description){
    let todo=new Todo(
      req.body.title,req.body.description,{"item":req.body.item}
    );
    user.todos.push(todo);
    writeData();
    res.redirect('/home');
    return;
  } else if(!title) return wrongTitleMessage(res);
  createTodo=showValuesInEditForm(createTodo,title);
  user.todos=user.todos.filter(todo=>todo.title!=req.body.editTodo);
  res.write(createTodo);
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
  file=replaceValueToEdit(title.todoItems.item,file,'item');
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

app.get('/index',getIndexPage);
app.get('/logout',logoutUser);
app.get('/home',getHomePage);
app.get('/createTodo',getCreateTodoPage);
app.get('/viewTodo',getViewTodo);
app.get('/deleteTodo',getDeleteTodo);
app.get('/editTodo',getEditTodo);
app.post('/viewTodo',postViewTodo);
app.post('/deleteTodo',postDeleteTodo);
app.post('/editTodo',postEditTodo);
app.post('/index',postIndexPage);
app.post('/createTodo',postCreateTodoPage);
app.use(loadUser);
app.use(redirectLoggedinUserToHome);
app.use(redirectNotLoggedInUserToLogin);

module.exports=app;
