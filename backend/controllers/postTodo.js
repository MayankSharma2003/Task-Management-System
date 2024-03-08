const con =  require("../models/mysql")

function postTodo(request, response) {
    var data  = request.body;
    // console.log(data);
    con.query(`insert into todo values('${data.name}','${data.desc}','${data.sdate}','${data.edate}','${data.stime}','${data.etime}','${data.status}',${data.id})`, function (error, data) {
        if (error) throw error;
        response.status(200).send();
    });
}

module.exports = { postTodo }