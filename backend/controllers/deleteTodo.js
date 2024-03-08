const con = require("../models/mysql")

function deleteTodo(request, response) {
    let id = request.query.id;
    con.query(`delete from todo where id=${id}`, function (error, data) {
        if (error) throw error;
        response.status(200).send();
    });
}

module.exports = { deleteTodo }