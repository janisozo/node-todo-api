// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
	if (err) {
		return console.log('Unable to connect to MongoDB server');
	}
	console.log('Connected to MongoDB server');

	const db = client.db('TodoApp');

	// db.collection("Todos").deleteMany({text: "Cook dinner"}).then((docs) => {
	// 	console.log(docs.result);
	// });;

	// db.collection("Todos").deleteOne({text: "Watch a tv show"}).then((docs) => {
	// 	console.log(docs.result);
	// });;

	db.collection("Users").deleteMany({name: "John"}).then((docs) => {
		console.log(docs.result);
	});;


	db.collection("Users").findOneAndDelete({_id: new ObjectID("5b4ba51400c38318d8e73d8d")}).then((docs) => {
		console.log(docs);
	});

	// db.close();
});