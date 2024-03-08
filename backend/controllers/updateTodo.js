const con = require("../models/mysql")

function updateTodoStatus(request, response) {

    const data = request.body;
    con.query(`update todo set status='${data.status}' where id=${data.id}`, function (error, data) {
        if (error) throw error;
        response.status(200).send();
    });
}

function updateAllTodo(request,response){
    const data = request.body;
    var id = Number(data.id);
    // console.log(`update todo set name='${data.name}' and description='${data.desc}' and sdate='${data.sdate}' and edate='${data.edate}' and stime='${data.stime}' and etime='${data.etime}' where id=${id}`);
    con.query(`update todo set name='${data.name}', description='${data.desc}' ,sdate='${data.sdate}' , edate='${data.edate}' , stime='${data.stime}' ,etime='${data.etime}' where id=${id}`, function (error, data) {
        if (error) throw error;
        response.status(200).send();
    });
}

module.exports = { updateTodoStatus, updateAllTodo }