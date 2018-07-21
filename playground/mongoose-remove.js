const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {user} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
// 	console.log(result);
// });

// Todo.findByIdAndRemove('5b533840648b9af8e72aeb11').then((result) => {
// 	console.log(result);
// });

// Todo.findOneAndRemove({_id: }).then((result) => {
	
// });