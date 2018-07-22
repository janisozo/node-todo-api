const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = "123abc!";

bcrypt.genSalt(10, (err, salt) => {
	bcrypt.hash(password, salt, (err, hash) => {
		console.log(hash);	
	});
});

var hashedPassword = '$2a$10$IdYhfXoba89KnsZsK3wGC.P.z/TreLOCZT16HS5EooRgw1XCfV.DO';

bcrypt.compare(password, hashedPassword, (err, res) => {
	console.log(res);
});
// var data = {
// 	id: 10
// };

// var token = jwt.sign(data, '123abc');
// var decoded = jwt.verify(token, '123abc');
// console.log(token);

// console.log('decoded:', decoded);

// const message = "I am";
// var hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`hash: ${hash}`);



// var data = {
// 	id: 4
// };

// var token = {
// 	data,
// 	hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }

// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if (resultHash === token.hash) {
// 	console.log('Data is secure');
// } else {
// 	console.log('Data was changed. Do not trust');
// }