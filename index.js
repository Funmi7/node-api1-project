// implement your API here
const express = require('express')
const cors = require('cors')
const db = require('./data/db')

const server = express()

server.use(cors())
server.use(express.json())

server.get('/api/users', (req, res) => {
    db.find()
    .then(users => {
        res.status(200).json(users)
    })
    .catch(err => {
        res.status(500).json({
            success: false,
            err,
        });
    });
});

server.post('/api/users', (req, res) => {
    const userInfo = req.body;

    db.insert(userInfo)
    .then(user => {
        res.status(201).json(user)
    })
    .catch(err => {
        res.status(500).json({
            success: false,
            err,
        });
    });
});

server.get('*', handleDefaultRequest)

function handleDefaultRequest(req, res) {
    res.json('hello world!')
}

server.listen(process.env.PORT || 3000, () => {
    console.log('listening on ' + (process.env.PORT || 3000));
})

