const express = require("express");
const app = express();
// var session = require("express-session");
app.use(function (req, res, next) {
    console.log(req.method, req.url);
    next();
  });

// app.set("view engine","ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());  
// app.use(
//   session({
//     secret: "Hello",
//     resave: true,
//     saveUninitialized: true,
//   })
// );

const con = require("./models/mysql.js");
con.connect(function (error) {
  if (error) throw error;
  console.log("Connected");
});

const getTodo = require("./controllers/getTodo")
const postTodo = require('./controllers/postTodo')
const deleteTodo = require('./controllers/deleteTodo');
const updateTodo = require('./controllers/updateTodo');


app.get("/", function (request, response) {
  response.sendFile("C:/Users/dell/Documents/Python/Todo/frontend/public/index.html");
  });
  
app.route('/todo')
  .get(getTodo.getTodo)
  .post(postTodo.postTodo)
  .put(updateTodo.updateTodoStatus)
  .delete(deleteTodo.deleteTodo)

app.put("/updateDetails",updateTodo.updateAllTodo)
app.get("/todoLength",getTodo.todoLength)

app.get("/style", function (request, response) {
  response.sendFile("C:/Users/dell/Documents/Python/Todo/frontend/public/css/style.css");
});

app.get("/scripts", function (request, response) {
  response.sendFile("C:/Users/dell/Documents/Python/Todo/frontend/todo.js");
});


app.get("*", function (request, response) {
    response.sendFile(__dirname + "/public/404.html");
  });

app.listen(8000, function () {
    console.log("Server is running on port 8000");
  });