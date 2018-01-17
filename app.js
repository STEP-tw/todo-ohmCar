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
    '/home','/createTodo','/','/viewTodo','/deleteTodo','/editTodo'
  ]) && !req.user){
    res.redirect('/index');
  }
}

let redirectLoggedinUserToHome = (req,res)=>{
  if(req.urlIsOneOf(['/index','/']) && req.user){
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
    res.setHeader('Set-Cookie',[`loginFailed=false,Expires=${new Date(1).toUTCString()}`,`sessionid=0,Expires=${new Date(1).toUTCString()}`]);
    delete req.user.sessionid;
  }
  res.redirect('/index');
};

const getCreateTodoPage=(req,res)=>{
  let createTodoPage=fs.readFileSync('./public/createTodo.html');
  res.write(createTodoPage);
  res.end();
}

const postCreateTodoPage=(req,res)=>{
  let user=data.find(u=>{
    return u.name==req.user.userName;
  });
  if(!user){
    let user=new User(req.user.userName);
    user.addTodo(req.body.title,req.body.description,{"item":req.body.item});
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
  if(!title){
    res.write('Enter a valid todo title');
    res.end();
    return;
  }
  let viewTodoPage=fs.readFileSync('./templates/viewTodo.html');
  viewTodoPage=replace(viewTodoPage,'Title',`Title: ${title.title}`);
  viewTodoPage=replace(viewTodoPage,'description',`Description: ${title.description}`);
  viewTodoPage=replace(viewTodoPage,'items',`Items: ${title.todoItems.item}`);
  res.write(viewTodoPage);
  res.end();
}

const getViewTodo=(req,res)=>{
  res.write(fs.readFileSync('./public/viewTodo.html'));
  res.end();
}

const getDeleteTodo=(req,res)=>{
  res.write(fs.readFileSync('./public/deleteTodo.html'));
  res.end();
}

const postDeleteTodo=(req,res)=>{
  let user=data.find(u=>u.name==req.user.userName);
  let title=user.todos.find(todo=>todo.title==req.body.deleteTodo);
  if(!title){
    res.write('Enter a valid todo title');
    res.end();
    return;
  }
  user.todos=user.todos.filter(todo=>todo.title!=req.body.deleteTodo);
  writeData();
  res.redirect('/home');
}

const getEditTodo=(req,res)=>{
  res.write(fs.readFileSync('./public/editTodo.html'));
  res.end();
}

const postEditTodo=(req,res)=>{
  let user=data.find(u=>u.name==req.user.userName);
  let title=user.todos.find(todo=>todo.title==req.body.editTodo);
  if(!title){
    res.write('Enter a valid todo title');
    res.end();
    return;
  }
  res.end();
}

const writeData=()=>{
  fs.writeFile('./data/data.json',JSON.stringify(data,null,2),err=>{
    if(err) return;
  });
}

const replace=(replaceFrom,textToReplace,replaceWith)=>{
  return replaceFrom.toString().replace(textToReplace,replaceWith);
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
