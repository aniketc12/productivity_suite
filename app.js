require('dotenv').config()
const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('jsonwebtoken')

const app = express() 

app.use(bodyParser.json())
app.use(express.static('.'))
app.use(express.json())
app.use(cors())

const port = 8000
const db = mysql.createConnection({
    host:      process.env.MYSQL_HOST,
    user:      process.env.MYSQL_USER, 
    password:  process.env.MYSQL_PASSWORD,
    database:  process.env.MYSQL_DB 
})

var user = 'aniket'

db.connect((err) => {
    if (err) {
        throw err
    }
})

app.get('/', (req, res) => {
    res.sendFile('./index.html')
})

app.post('/login', (req, res) => {

    query = "select * from users where username = '"+req.body.username+"'"
    db.query(query, (err, result, fields) => {
        if (err) {
            throw err
        }
        else {
            if (!result[0]) {
                res.send('This Username does not exist')
                return
            }
            query = "select * from users where username = '"+req.body.username+"' and password = '"+req.body.password+"'"
            db.query(query, (err, result, fields) => {
                if (err) {
                    throw err
                }
                else {
                    if (result[0]) {
                        res.send('Success')
                        return
                    }
                    else {
                        res.send('Password is Incorrect')
                        return
                    }

                }
            })

        }
    })
})


app.put('/api/todo/:username', (req, res) => {
    query = "update todo set lists = '"+JSON.stringify(req.body)+
        "' where username = 'aniket'"
    db.query(query, (err, result, fields) => {
        if (err) {
            console.log(err)
        }
        else {
            res.send('Success')
        }
    })
    console.log('put')

})

app.get('/api/todo/:username', (req, res) => {
    console.log('here')
    query = "select lists from todo where username = '"+req.params.username+"'"
    db.query(query, (err, result, fields) => {
        if (err) {
            console.log(err)
        }
        else {
            res.send(JSON.parse(result[0].lists))
        }
    })
})


app.post('/auth/signup', (req, res) => {
    console.log(req.body.username)
    query = "select * from users where username = '"+req.body.username+"'"
    db.query(query, (err, result, fields) => {
        if (err) {
            res.send('Fail')
        }
        else {
            if (result[0]) {
                res.send('Fail')
            }
            else {
                query = "insert into users values ('"+req.body.username+"', '"+req.body.password+"')"
                db.query(query, (err, result, fields) => {
                    if (err) {
                        throw err
                    }
                })
                query = "insert into todo values ('"+req.body.username+"', '[]')"
                db.query(query, (err, result, fields) => {
                    if (err) {
                        throw err
                    }
                }) 
                res.send('Success')
            }
        }
    })
})

app.listen(port, () => {
    console.log('')
})
