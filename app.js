const WebApp = require('./webapp.js');

const app=WebApp.create();

const utility=require('./utility.js');

const logoutUser=utility.logoutUser;
const getAddItem=utility.getAddItem;
const getHomePage=utility.getHomePage;
const getViewTodo=utility.getViewTodo;
const getEditTodo=utility.getEditTodo;
const getEditItem=utility.getEditItem;
const getIndexPage=utility.getIndexPage;
const getDeleteTodo=utility.getDeleteTodo;
const getCreateTodoPage=utility.getCreateTodoPage;

const postViewTodo=utility.postViewTodo;
const postDeleteTodo=utility.postDeleteTodo;
const postEditTodo=utility.postEditTodo;
const postIndexPage=utility.postIndexPage;
const postCreateTodoPage=utility.postCreateTodoPage;
const postEditItem=utility.postEditItem;
const postAddItem=utility.postAddItem;

const loadUser=utility.loadUser;
const logRequest=utility.logRequest;
const redirectLoggedinUserToHome=utility.redirectLoggedinUserToHome;
const redirectNotLoggedInUserToLogin=utility.redirectNotLoggedInUserToLogin;


app.get('/home',getHomePage);
app.get('/logout',logoutUser);
app.get('/index',getIndexPage);
app.get('/addItem',getAddItem);
app.get('/viewTodo',getViewTodo);
app.get('/editTodo',getEditTodo);
app.get('/editItem',getEditItem);
app.get('/deleteTodo',getDeleteTodo);
app.get('/createTodo',getCreateTodoPage);

app.post('/index',postIndexPage);
app.post('/addItem',postAddItem);
app.post('/viewTodo',postViewTodo);
app.post('/editTodo',postEditTodo);
app.post('/editItem',postEditItem);
app.post('/deleteTodo',postDeleteTodo);
app.post('/createTodo',postCreateTodoPage);

app.use(loadUser);
app.use(logRequest);
app.use(redirectLoggedinUserToHome);
app.use(redirectNotLoggedInUserToLogin);

module.exports=app;
