const fs=require('fs');

const WebApp = require('./webapp.js');
let todoData=require('./data/todoData.json');

const app=WebApp.create();

const headers={
  ".jpg":"img/jpg",
  ".html":"text/html",
  ".css":"text/css",
  ".js":"text/javascript",
  ".gif":"img/gif",
  ".pdf":"text/pdf"
};

let registeredUsers=[
  {userName:'omkar',password:'omkar'},
  {userName:'ketan',password:'ketan'}
];

let redirectNotLoggedInUserToLogin = (req,res)=>{
  if(req.urlIsOneOf(['/index.html','/createTodo.html']) && !req.user){
    res.redirect('/login.html');
  }
}

const doesExist=req=>{
  return fs.existsSync('./public'+req.url);
}

const setHeader=function(req,res){
  let file=".."+req.url;
  let extensionOfFile=file.slice(file.lastIndexOf("."));
  res.setHeader("Content-type",headers[extensionOfFile]);
};

let loadUser = (req,res)=>{
  let sessionid = req.cookies.sessionid;
  let users = JSON.stringify(registeredUsers);
  let user = JSON.parse(users).find(u=>u.sessionid==sessionid);
  if(sessionid && user){
    req.user = user;
  }
};

const showTodo=(req,res)=>{
  res.setHeader('Content-type','text/html');
  todoData.forEach(data=>{
    if(req.url==`/${data.title}`){
      res.write(`<p>Title: ${data.title.replace(/\+/g,' ')}</p>`);
      res.write(`<p>Description: ${data.description.replace(/\+/g,' ')}</p>`);
      res.write(`<p>Todo Items: ${data.item.replace(/\+/g,' ')}</p>`);
      res.write(`<a href="/delete${data.title}"> Delete This Todo </a> <br/>`);
      res.write(`<a href="/logout"> Logout </a> <br/>`);
      res.write(`<a href="/index.html"> Home </a> <br/>`);
      res.end();
    }
  });
}

const deleteTodo=(req,res)=>{
  let todoToDelete=null;
  todoData.map(data=>{
    if(req.url==`/delete${data.title}`){
      todoToDelete=data;
    }
  });
  if(todoToDelete!=null){
    todoData=todoData.filter(data=>{
      return data!=todoToDelete;
    });
    fs.writeFile(`./data/todoData.json`,JSON.stringify(todoData,null,2),
    err=>{
      if(err)return;
    });
    res.redirect('/index.html');
  }
}

const serveFile=(req,res)=>{
  try {
    if(req.url=='/') res.redirect('/index.html');
    if(req.urlIsOneOf(['/login.html','/createTodo.html'])){
      return;
    }
    if(doesExist(req)){
      setHeader(req,res);
      res.write(fs.readFileSync('./public'+req.url));
      res.end();
    }
  } catch (e) {
    return e;
  }
}

app.get('/login.html',(req,res)=>{
  res.setHeader('Content-type','text/html');
  res.write(fs.readFileSync('./public/login.html'));
  res.end();
});

app.post('/login.html',(req,res)=>{
  let user = registeredUsers.find(u=>{
    return u.userName==req.body.userName && u.password==req.body.password;
  });
  if(!user){
    res.setHeader('Set-Cookie',`logInFailed=true`);
    res.redirect('/login.html');
    return;
  }
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
  user.sessionid = sessionid;
  res.redirect('/index.html');
});

app.get('/createTodo.html',(req,res)=>{
  res.setHeader('Content-type','text/html');
  res.write(fs.readFileSync('./public/createTodo.html'));
  res.end();
});

app.post('/createTodo.html',(req,res)=>{
  req.body.userName=req.user.userName;
  todoData.push(req.body);
  fs.writeFile(`./data/todoData.json`,JSON.stringify(todoData,null,2),
  err=>{
    if(err)return;
  });
  res.redirect('/index.html');
});

app.get('/index.html',(req,res)=>{
  let indexPage=fs.readFileSync('./templates/index.html').toString();
  let homePage=indexPage.replace('User',`User : ${req.user.userName}`);
  res.setHeader('Content-type','text/html');
  let user=todoData.find(u=>{
    return u.userName==req.user.userName;
  });
  if(user){
    res.write(`Your Todo Lists are :<br/>`);
    todoData.forEach(data=>{
      if(data.userName==req.user.userName){
        res.write(`<a href="/${data.title}">${data.title}</a><br/>`);
      };
    });
  }
  res.write(homePage);
  res.end();
});

app.get('/logout',(req,res)=>{
  if(req.user){
    res.setHeader('Set-Cookie',[`loginFailed=false,Expires=${new Date(1).toUTCString()}`,`sessionid=0,Expires=${new Date(1).toUTCString()}`]);
    delete req.user.sessionid;
  }
  res.redirect('/login.html');
});

app.use(deleteTodo);
app.use(showTodo);
app.use(loadUser);
app.use(redirectNotLoggedInUserToLogin);
app.use(serveFile);

module.exports=app;
