const mysql = require('mysql2');
const con =mysql.createConnection({
    host: 'localhost',
    port: 3306,
    password: '123456789',
    user: 'root',
    database: 'productdb'
})
con.connect((err)=>{
    console.log('connected to mysql')
})

module.exports=con;