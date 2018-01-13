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
  {userName:'ketan',password:'ketan'},
];

let redirectNotLoggedInUserToLogin = (req,res)=>{
  if(req.urlIsOneOf(['/index.html','/createTodo.html','/']) && !req.user){
    res.redirect('/login.html');
  }
}

let redirectLoggedinUserToHome = (req,res)=>{
  if(req.urlIsOneOf(['/login.html','/']) && req.user){
    res.redirect('/index.html');
  }
}

const writeData=function(){
  fs.writeFile(`./data/todoData.json`,JSON.stringify(todoData,null,2),
  err=>{
    if(err)return;
  });
}

const checkingIfUserIsLoggedin=(data)=>{
  return registeredUsers.find(u=>{
    return u.sessionid&&u.userName==data.userName;
  });
}

const replaceValueToEdit=(valueToReplace,file,name)=>{
  file=file.replace(
    `<input type="text" name="${name}" value="" required/>`,
    `<input type="text" name="${name}" value="${valueToReplace}" required/>`
  );
  return file;
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

const checkIfDoneOrNot=(req,res)=>{
  todoData.forEach(data=>{
    if(checkingIfUserIsLoggedin(data)){
      if(req.url==`/done${data.title}`){
        data.done="true";
        writeData();
        res.redirect(`/${data.title}`);
      } else if(req.url==`/notDone${data.title}`){
        data.done="false";
        writeData();
        res.redirect(`/${data.title}`);
      }
    }
  })
}

const viewTodo=(req,res)=>{
  res.setHeader('Content-type','text/html');
  todoData.forEach(data=>{
    if(checkingIfUserIsLoggedin(data)){
      if(req.url==`/${data.title}`){
        res.write(`<p>Title: ${data.title.replace(/\+/g,' ')}</p>`);
        res.write(`<p>Description: ${data.description.replace(/\+/g,' ')}</p>`);
        if(data.done=="true"){
          res.write(
            `<p>Todo Items: <br/> <input type="checkbox" checked>
            ${data.item.replace(/\+/g,' ')} <a href="/edit${data.item}"> Edit</a></p><p><a href="/done${data.title}"> Done</a> <br/><a href="/notDone${data.title}">  Not Done</a></p>`
          );
        } else{
          res.write(
            `<p>Todo Items: <br/> <input type="checkbox">
            ${data.item.replace(/\+/g,' ')} <a href="/edit${data.item}"> Edit</a></p><p><a href="/done${data.title}"> Done</a> <br/><a href="/notDone${data.title}">  Not Done</a></p>`
          );
        }
        res.write(`<a href="/edit${data.title}"> Edit This Todo </a> <br/>`);
        res.write(`<a href="/delete${data.title}"> Delete This Todo </a> <br/>`);
        res.write(`<a href="/logout"> Logout </a> <br/>`);
        res.write(`<a href="/index.html"> Home </a> <br/>`);
        res.end();
      }
    }
  });
}

const deleteTodo=(req,res)=>{
  let todoToDelete=null;
  todoData.map(data=>{
    if(checkingIfUserIsLoggedin(data)){
      if(req.url==`/delete${data.title}`){
        todoToDelete=data;
      }
    }
  });
  if(todoToDelete!=null){
    todoData=todoData.filter(data=>{
      return data!=todoToDelete;
    });
    writeData();
    res.redirect('/index.html');
  }
}

const editTodo=(req,res)=>{
  todoData.forEach(data=>{
    if(checkingIfUserIsLoggedin(data)){
      if(req.url==`/edit${data.title}`){
        if(req.method=='GET'){
          let createTodoFile=fs.readFileSync('./public/createTodo.html').toString();
          createTodoFile=replaceValueToEdit(data.title,createTodoFile,'title');
          createTodoFile=replaceValueToEdit(data.description,createTodoFile,'description');
          createTodoFile=replaceValueToEdit(data.item,createTodoFile,'item');
          res.write(createTodoFile);
          res.end();
        } else{
          data.title=req.body.title;
          data.description=req.body.description;
          data.item=req.body.item;
          writeData();
          res.redirect('/index.html');
        }
      }
    }
  });
}

const editTodoItem=(req,res)=>{
  todoData.forEach(data=>{
    if(checkingIfUserIsLoggedin(data)){
      if(req.url==`/edit${data.item}`){
        if(req.method=='GET'){
          res.setHeader('Content-Type','text/html');
          res.write(`<form method="POST">
          Edit Todo Item: <input type="text" name="item" value="${data.item}">
          <input type="submit"></form>`);
          res.end();
        } else{
          data.item=req.body.item;
          writeData();
          res.redirect(`/${data.title}`);
        }
      }
    }
  });
}

const serveFile=(req,res)=>{
  try {
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
    res.write(`Wrong Username or Password! <br/>`);
    res.write(fs.readFileSync('./public/login.html'));
    res.end();
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
  req.body.done=false;
  todoData.push(req.body);
  writeData();
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

app.use(checkIfDoneOrNot);
app.use(editTodo);
app.use(editTodoItem);
app.use(deleteTodo);
app.use(viewTodo);
app.use(loadUser);
app.use(serveFile);
app.use(redirectNotLoggedInUserToLogin);
app.use(redirectLoggedinUserToHome);

module.exports=app;
