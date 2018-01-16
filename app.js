const fs=require('fs');

const WebApp = require('./webapp.js');
let data=require('./data/data.json');

const loginPage=fs.readFileSync('./public/index.html');
const homePage=fs.readFileSync('./templates/home.html');
const createTodoPage=fs.readFileSync('./public/createTodo.html');

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
  if(req.urlIsOneOf(['/home','/createTodo','/']) && !req.user){
    res.redirect('/index');
  }
}

let redirectLoggedinUserToHome = (req,res)=>{
  if(req.urlIsOneOf(['/index','/']) && req.user){
    res.redirect('/home');
  }
}

const getIndexPage=(req,res)=>{
  res.setHeader('Content-type','text/html');
  res.write(loginPage);
  res.end();
}

const postIndexPage=(req,res)=>{
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
  res.write(homePage.toString().replace('User',`User: ${req.user.userName}`));
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
  res.write(createTodoPage);
  res.end();
}

const postCreateTodoPage=(req,res)=>{
  req.body.userName=req.user.userName;
  let item=req.body.item;
  req.body.item={};
  req.body.item[item]=item;
  data.push(req.body);
  fs.writeFile('./data/data.json',JSON.stringify(data,null,2),err=>{
    if(err) return;
  });
  res.redirect('/home');
  res.end();
}

app.get('/index',getIndexPage);
app.get('/logout',logoutUser);
app.get('/home',getHomePage);
app.get('/createTodo',getCreateTodoPage);
app.post('/index',postIndexPage);
app.post('/createTodo',postCreateTodoPage);
app.use(loadUser);
app.use(redirectLoggedinUserToHome);
app.use(redirectNotLoggedInUserToLogin);

module.exports=app;
