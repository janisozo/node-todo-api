const _ = require('lodash');
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {user} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe("POST /todos", () => {
	it('should create a new todo', (done) => {
		var text = "Testing todo text";

		request(app)
			.post('/todos')
			.send({text})
			.expect(200)
			.expect((res) => {
				expect(res.body.text).toBe(text);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.find({text}).then((todos) => {
					expect(todos.length).toBe(1);
					expect(todos[0].text).toBe(text);
					done();
				}).catch((e) => done(e));
			});
	});

	it('should not create todo with invalid data', (done) => {
		request(app)
			.post('/todos')
			.send({})
			.expect(400)
			.end((err,res) => {
				if (err) {
					return done(err);
				}

				Todo.find().then((todos) => {
					expect(todos.length).toBe(2);
					done();
				}).catch((e) => done());
			});
	});
});

describe('GET /todos', () => {
	it('should get all todos', (done) => {
		request(app)
			.get('/todos')
			.expect(200)
			.expect((res) => {
				expect(res.body.todos.length).toBe(2);
			})
			.end(done);
	});
});

describe('GET /todos/:id', () => {
	it('should return todo doc', (done) => {
		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(todos[0].text);
			})
			.end(done);
	});

	it('should return 404 if todo not found', (done) => {
		const newId = new ObjectID().toHexString();

		request(app)
			.get(`/todos/${newId}`)
			.expect(404)
			.expect((res) => {
				expect(res.body.todo).toBe(undefined);
			})
			.end(done);
	});
	
	it("should return 400 for non-ObjectID's", (done) => {
		request(app)
			.get('/todos/123')
			.expect(400)
			.end(done);
	});
});

describe('DELETE /todos/:id', () => {

	it('should delete a valid todo', (done) => {
		const newId = todos[1]._id.toHexString();
		request(app)
			.delete(`/todos/${newId}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo._id).toBe(newId);
			})
			.end((err, res) => {
				if (err) {
					return done(err)
				} 

				Todo.findById(newId).then((todo) => {
					expect(todo).toBeFalsy();
					done();
				}).catch((e) => done(e));
			});
	});

	it('should return 404 if todo not found', (done) => {
		const newId = new ObjectID().toHexString();
		request(app)
			.delete(`/todos/${newId}`)
			.expect(404)
			.end(done);
	});

	it('should return 400 if id not valid', (done) => {
		request(app)
			.delete('/todos/123456')
			.expect(400)
			.end(done);
	});
});

describe('PATCH /todos/:id', () => {
	it('should update the todo', (done) => {
		const id = todos[0]._id.toHexString();
		const text = "make your own dinner";

		request(app)
			.patch(`/todos/${id}`)
			.send({
				text,
				completed: true
			})
			.expect(200)
			.expect((res) => {
				expect(res.body.todo._id).toBe(id);
				expect(res.body.todo.text).toBe(text);
				expect(res.body.todo.completed).toBe(true);
				expect(typeof res.body.todo.completedAt).toBe('number');
			})
			.end(done);
	});


	it('clear completedAt when todo is not completed', (done) => {
		const id = todos[1]._id.toHexString();
		const text = "go to bed early after dinner";

		request(app)
			.patch(`/todos/${id}`)
			.send({
				completed: false,
				text
			})
			.expect(200)
			.expect((res) => {
				expect(res.body.todo._id).toBe(id);
				expect(res.body.todo.text).toBe(text);
				expect(res.body.todo.completed).toBeFalsy();
				expect(res.body.todo.completedAt).toBe(null);
			})
			.end(done);
	});
	// it('should clear completedAt when completed is false', () => {

	// });
});

describe('GET /users/me', () => {
	it('should return user if authenticated', (done) => {
		request(app)
			.get('/users/me')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body._id).toBe(users[0]._id.toHexString());
				expect(res.body.email).toBe(users[0].email);
			})
			.end(done);
	});

	it('should return 401 if not authenticated', (done) => {
		request(app)
			.get('/users/me')
			.expect(401)
			.expect((res) => {
				expect(res.body).toEqual({});
			})
			.end(done);
	});
});

describe('POST /users', () => {
	it('should create a user', (done) => {
		var email = "example@example.com";
		var password = "123mnb!";

		request(app)
			.post('/users')
			.send({email, password})
			.expect(200)
			.expect((res) => {
				expect(res.headers['x-auth']).toBeTruthy();
				expect(res.body._id).toBeTruthy();
				expect(res.body.email).toBe(email);
			})
			// .end(done);
			// We can also use a custom .end function like this
			.end((err) => {
				if(err) {
					return done(err);
				}

				user.findOne({email}).then((user) => {
					expect(user).toBeTruthy();
					expect(user.password).not.toBe(password);
					done();
				});
			});
	});

	it('should return validation error if request invalid', (done) => {
		var email = "111 1";
		var password = "box";
		request(app)
			.post('/users')
			.send({email, password})
			.expect(400)
			.expect((res) => {
				expect(res.body).toEqual({})
			})
			.end(done);
		// send across invalid email and password
		// expect (400)
	});

	it('should not create user if email in use', (done) => {
		// var email = "janisozo@example.com";
		var password = "box";

		request(app)
			.post('/users')
			.send({email: users[0].email,
			 password})
			.expect(400)
			.expect((res) => {
				expect(res.body).toEqual({})
			})
			.end(done);
		// use a used email (seed data)
		// expect (400)
	});
});