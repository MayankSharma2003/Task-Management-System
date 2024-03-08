const con = require("../models/mysql")

function getTodo(request,response){
    var offset = request.query.offset;
    con.query(`SELECT * FROM todo limit 10 offset ${offset*10}`, function (error, data) {
        if (error) throw error;
        // console.log(data);
        response.status(200);
        response.json(data);
    });
}

function todoLength(request,response){
    var offset = request.query.offset;
    con.query(`SELECT * FROM todo`, function (error, data) {
        if (error) throw error;
        if(data.length>offset*10)
            response.status(200).send();
        else
            response.status(400).send();
    });
}

module.exports = {getTodo,todoLength}