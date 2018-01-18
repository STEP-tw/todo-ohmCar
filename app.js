const WebApp = require('./webapp.js');

const app=WebApp.create();

const getIndexPage=require('./utils.js').getIndexPage;
const logoutUser=require('./utils.js').logoutUser;
const getHomePage=require('./utils.js').getHomePage;
const getCreateTodoPage=require('./utils.js').getCreateTodoPage;
const getViewTodo=require('./utils.js').getViewTodo;
const getDeleteTodo=require('./utils.js').getDeleteTodo;
const getEditTodo=require('./utils.js').getEditTodo;
const getAddItem=require('./utils.js').getAddItem;
const getEditItem=require('./utils.js').getEditItem;

const postViewTodo=require('./utils.js').postViewTodo;
const postDeleteTodo=require('./utils.js').postDeleteTodo;
const postEditTodo=require('./utils.js').postEditTodo;
const postIndexPage=require('./utils.js').postIndexPage;
const postCreateTodoPage=require('./utils.js').postCreateTodoPage;
const postEditItem=require('./utils.js').postEditItem;
const postAddItem=require('./utils.js').postAddItem;

const loadUser=require('./utils.js').loadUser;
const logRequest=require('./utils.js').logRequest;
const redirectLoggedinUserToHome=require('./utils.js').redirectLoggedinUserToHome;
const redirectNotLoggedInUserToLogin=require('./utils.js').redirectNotLoggedInUserToLogin;


app.get('/index',getIndexPage);
app.get('/logout',logoutUser);
app.get('/home',getHomePage);
app.get('/createTodo',getCreateTodoPage);
app.get('/viewTodo',getViewTodo);
app.get('/deleteTodo',getDeleteTodo);
app.get('/editTodo',getEditTodo);
app.get('/addItem',getAddItem);
app.get('/editItem',getEditItem);

app.post('/viewTodo',postViewTodo);
app.post('/deleteTodo',postDeleteTodo);
app.post('/editTodo',postEditTodo);
app.post('/index',postIndexPage);
app.post('/createTodo',postCreateTodoPage);
app.post('/addItem',postAddItem);
app.post('/editItem',postEditItem);

app.use(loadUser);
app.use(logRequest);
app.use(redirectLoggedinUserToHome);
app.use(redirectNotLoggedInUserToLogin);

module.exports=app;
