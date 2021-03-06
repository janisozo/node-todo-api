const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const{user} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
	_id: userOneId,
	email: "janisozo@example.com",
	password: "janisPassword",
	tokens: [{
		access: "auth",
		token: jwt.sign({_id: userOneId, access: "auth"}, process.env.JWT_SECRET)
	}]
}, {
	_id: userTwoId,
	email: 'toto@inbox.lv',
	password: 'totoPassword',
	tokens: [{
		access: "auth",
		token: jwt.sign({_id: userTwoId, access: "auth"}, process.env.JWT_SECRET)
	}]
}];

const todos = [{
	_id: new ObjectID(),
	text: "Fist test todo",
	_creator: userOneId
}, {
	_id: new ObjectID(),
	text: "Second test todo",
	completed: true,
	completedAt: 257,
	_creator: userTwoId
}];

 const populateTodos = (done) => {
	Todo.remove({}).then(() => {
		Todo.insertMany(todos);
	}).then(() => done());
};

const populateUsers = (done) => {
	user.remove({}).then(() => {
		var userOne = new user(users[0]).save();
		var userTwo = new user(users[1]).save();

		return Promise.all([userOne, userTwo])
	}).then(() => done());
};

module.exports = {
	todos,
	populateTodos,
	users,
	populateUsers
};