// implement your API here
const express = require('express')
const cors = require('cors')
const db = require('./data/db')

const server = express()

server.use(cors())
server.use(express.json())

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


server.get('/api/users/:id', (req, res) => {
    db.findById(req.params.id)
    .then(user => {
        if(user) {
            res.status(200).json({
                success: true,
                user,
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'We cannot find the user you are looking for'
            });
        }
    })
    .catch(err => {
        res.status(500).json({
            success: false,
            err,
        });
    });
});

server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;

    db.remove(id)
    .then(deleted => {
        if(deleted) {
            res.status(204).end();
        } else {
            res.status(404).json({
                success: false,
                message
            });
        }
    })
    .catch(err => {
        res.status(500).json({
            success: false,
            message,
        });
    });
});

server.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    db.update(id, changes)
    .then(updated => {
        if(updated) {
            res.status(200).json({
                success: true,
                updated
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'I cannot find the user you are looking for'
            });
        }
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

