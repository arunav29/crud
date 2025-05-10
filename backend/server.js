const express = require('express')
const Port = 3001;
const app = express();
const db = require('./db')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const secret_key = '123456789'
const authenticate = require('./authenticate')
const cors = require('cors')
app.use(cors())
app.use(bodyParser.json())

app.post('/register', async (req, res) => {
    const data = req.body;
    console.log('Data:', data)
    const { username, password } = data;
    const sql = 'insert into login(username,password) values(?,?)'
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log('hashedpassword:', hashedPassword)
    db.query(sql, [username, hashedPassword], (err, result) => {
        if (err) {
            console.error('Error', err.message)
            return res.status(500).send('unable to register user')
        }
        console.log('Result:', result)
        return res.status(200).json({ sucess: true, data: result })
    })
})

app.post('/login', (req, res) => {
    try {
        const data = req.body;
        const { username, password } = data;
        console.log('Data:', data)
        const sql = "select * from login where username=?"
        db.query(sql, [username], async (err, result) => {
            if (err) {
                console.error('error fetching data', err.message)
                return res.status(500).send('unable to login')
            }
            console.log('Result', result)
            const userId = result[0]?.id;


            const encryptedpassword = result[0]?.password;
            const passwordmatched = await bcrypt.compare(password, encryptedpassword)
            if (passwordmatched) {
                const token = jwt.sign({ userId: userId, username: username }, secret_key, { expiresIn: '30m' })
                return res.status(200).send({ success: true, message: 'user logged in successfully', token: token })
            } else {
                return res.status(401).send({ success: false, message: 'invalid criendentials' })
            }
        })
    } catch (error) {
        console.error('Error:', error)
    }

})

app.get('/getProducts',(req, res) => {
    const sql = 'select * from products';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error', err.message)
            return res.status(500).send('Error while fetching data')
        }
        return res.status(200).json({ success: true, data: result })
    })
})


app.post('/addProduct',(req,res)=>{
    const data =req.body
    console.log('data:',data)
    const {name,category,price,quantity}=data
    const sql='insert into products(name,category,price,quantity) values(?,?,?,?)'
    db.query(sql,[name,category,price,quantity],(err,result)=>{
        if(err){
            return res.status(500).send('Unable to fetch data')
        }
        return res.status(200).send({success:true,message:'Product added succesfully'})
    })

})

app.listen(Port, () => {
    console.log('server is running on Port:', Port)
}) 