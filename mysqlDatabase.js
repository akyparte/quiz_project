let mysql = require('mysql');
const { collection } = require('./database');

let connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'12345678',
    database:'userDatas'
})


connection.connect(function (err) {
    if(err)console.log(err);
    else console.log('connection established');
})


function validateUser(username) {
    connection.query(`select ${username} from users`,function (err,result,fields) {
        result.find((user) => {
            if(user.username === username){
                 return false;
            }else {
                connection.query(`insert into users(username)`)
            }
        })
    })
}