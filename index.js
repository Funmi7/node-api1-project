// implement your API here
const express = require('express')
const cors = require('cors')
const db = require('./data/db')

const server = express()

server.use(cors())
server.use(express.json())

server.post('/api/users', (req, res) => {
	const userInfo = req.body;
	if (!userInfo.name || !userInfo.bio) {
		res.status(400).json({
			errorMessage: 'Please provide name and bio for the user'
		})
	} else {
		db.insert(userInfo)
			.then(user => {
				res.status(201).json(user)
			})
			.catch(error => {
				res.status(500).json({
					success: false,
					error: 'There was an error while saving the user to the database',
				});
			});
	}

});


server.get('/api/users', (req, res) => {
	db.find()
		.then(users => {
			res.status(200).json(users)
		})
		.catch(err => {
			res.status(500).json({
				success: false,
				error: 'The users information could not be retrieved.'
			});
		});
});


server.get('/api/users/:id', (req, res) => {
	db.findById(req.params.id)
		.then(user => {
			if (user) {
				res.status(200).json({
					success: true,
					user,
				});
			} else {
				res.status(404).json({
					success: false,
					message: 'The user with the specified ID does not exist.'
				});
			}
		})
		.catch(error => {
			res.status(500).json({
				success: false,
				error: 'The user information could not be retrieved.',
			});
		});
});

server.delete('/api/users/:id', (req, res) => {
	const { id } = req.params;

	db.remove(id)
		.then(deleted => {
			if (deleted) {
				res.status(204).end();
			} else {
				res.status(404).json({
					success: false,
					message: 'The user with the specified ID does not exist.'
				});
			}
		})
		.catch(error => {
			res.status(500).json({
				success: false,
				error: 'The user could not be removed.',
			});
		});
});

server.put('/api/users/:id', (req, res) => {
	const { id } = req.params;
	const changes = req.body;

	db.update(id, changes)
		.then(updated => {
			if (updated) {
				res.status(200).json({
					success: true,
					updated
				});
			} else if (!changes.name || !changes.bio) {
				res.status(400).json({
					success: false,
					errorMessage: 'Please provide name and bio for the user.'
				})
			}
			else {
				res.status(404).json({
					success: false,
					message: 'The user with the specified ID does not exist.'
				});
			} 
		})
		.catch(error => {
			res.status(500).json({
				success: false,
				error: 'The user information could not be modified.',
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

