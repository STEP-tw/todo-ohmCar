const WebApp = require('./webapp.js');

const app=WebApp.create();

const utils=require('./utils.js');

const logoutUser=utils.logoutUser;
const getAddItem=utils.getAddItem;
const getHomePage=utils.getHomePage;
const getViewTodo=utils.getViewTodo;
const getEditTodo=utils.getEditTodo;
const getEditItem=utils.getEditItem;
const getIndexPage=utils.getIndexPage;
const getDeleteTodo=utils.getDeleteTodo;
const getCreateTodoPage=utils.getCreateTodoPage;

const postViewTodo=utils.postViewTodo;
const postDeleteTodo=utils.postDeleteTodo;
const postEditTodo=utils.postEditTodo;
const postIndexPage=utils.postIndexPage;
const postCreateTodoPage=utils.postCreateTodoPage;
const postEditItem=utils.postEditItem;
const postAddItem=utils.postAddItem;

const loadUser=utils.loadUser;
const logRequest=utils.logRequest;
const redirectLoggedinUserToHome=utils.redirectLoggedinUserToHome;
const redirectNotLoggedInUserToLogin=utils.redirectNotLoggedInUserToLogin;


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
