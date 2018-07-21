const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {user} = require('./../server/models/user');

const id = '5b50e97e1ee27f26209cdb1a';
const id2 = '5b4e4e9176d79627701c7711';

if (!ObjectID.isValid(id2)) {
	console.log("Id not valid!");
}

// Todo.find({
// 	_id: id
// }).then((todos) => {
// 	console.log('Todos', todos);
// });

// Todo.findOne({
// 	_id: id
// }).then((todo) => {
// 	console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
// 	if (!todo) {
// 		return console.log('Id not found');
// 	}
// 	console.log('Todo By Id', todo);
// }).catch((e) => {
// 	console.log(e);
// });

// if (ObjectID.isValid(id2)) {
// user.findById(id2).then((todo) => {
// 	if (!todo) {
// 		console.log('ID not found');
// 	} else return console.log('Todo', todo)
// })
// } else {
// 	console.log(`Id ${id2} invalid`);
// }

user.findById(id2).then((user) => {
	if (!user) {
		return console.log('ID not found');
	} else return console.log('Todo', user)
}).catch((e) => {
	console.log(e);
});