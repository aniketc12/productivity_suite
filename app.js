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
                res.json({
                    auth: false,
                    message: 'This Username does not exist'
                })
                return
            }
            query = "select * from users where username = '"+req.body.username+"' and password = '"+req.body.password+"'"
            db.query(query, (err, result, fields) => {
                if (err) {
                    throw err
                }
                else {
                    if (result[0]) {
                        var username = result[0].username
                        const token = jwt.sign({username}, process.env.SESSION_SECRET, {
                            expiresIn: 3000
                        })
                        res.json({
                            auth: true,
                            token: token,
                            result: username
                        })
                        return
                    }
                    else {
                        res.json({
                            auth: false,
                            message: 'Password is Incorrect'
                        })
                        return
                    }

                }
            })

        }
    })
})


var verify = (req, res, next) => {
    var token = req.headers["authorization"]
    if (!token) {
        res.json({
            auth: false
        })
        return
    }
    else {
        token = token.substring(7)
        jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
            if (err) {
                console.log(err)
                res.json({
                    auth: false
                })
                return
            }
            else {
                req.username = decoded.username
                next()
            }

        })
    }
}

app.put('/api/todo/:username', verify, (req, res) => {
    if (req.params.username != req.username) {
        res.json({
            auth: false
        })
        return
    }
    console.log(req.username)
    query = "update todo set lists = '"+JSON.stringify(req.body)+
        "' where username = '"+req.username+"'"
    db.query(query, (err, result, fields) => {
        if (err) {
            console.log(err)
        }
        else {
            res.json({
                auth: true
            })
        }
    })

})

app.get('/api/todo/:username', verify, (req, res) => {
    if (req.params.username != req.username) {
        res.json({
            auth: false
        })
        return
    }
    query = "select lists from todo where username = '"+req.params.username+"'"
    db.query(query, (err, result, fields) => {
        if (err) {
            console.log(err)
        }
        else {
            res.json({
                auth: true,
                lists: JSON.parse(result[0].lists)
            })
        }
    })
})


app.put('/api/notes/:username', verify, (req, res) => {
    if (req.params.username != req.username) {
        res.json({
            auth: false
        })
        return
    }
    query = "update notes set lists = '"+JSON.stringify(req.body)+
        "' where username = '"+req.username+"'"
    db.query(query, (err, result, fields) => {
        if (err) {
            console.log(err)
        }
        else {
            res.json({
                auth: true
            })
        }
    })

})

app.get('/api/notes/:username', verify, (req, res) => {

    if (req.params.username != req.username) {
        res.json({
            auth: false
        })
        return
    }
    query = "select lists from notes where username = '"+req.params.username+"'"
    db.query(query, (err, result, fields) => {
        if (err) {
            console.log(err)
        }
        else {
            res.json({
                auth: true,
                lists: JSON.parse(result[0].lists)
            })
        }
    })
})

app.post('/auth/signup', (req, res) => {
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

app.get('/auth/isAuth/:username', verify, (req, res) => {
    if (req.params.username != req.username) {
        res.json({
            auth: false
        })
        return
    }
    res.json({
        auth: true
    })
})

app.listen(port, () => {
    console.log('')
})
