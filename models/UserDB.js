/* Represents a UserDB */
class UserDB {
	constructor(userId, password, firstName, lastName, email, address1, address2, city, state, zip, country) {
		this.userId = userId, //Auto Increment
		this.password = password,
		this.firstName = firstName,
		this.lastName = lastName,
		this.email = email,
		this.addressField1 = address1,
		this.addressField2 = address2,
		this.city = city,
		this.state = state,
		this.zip = zip,
		this.country = country
	}
}
/* Require Mongoose Library */
var mongoose = require('mongoose');
/* Offer Model to represent in MongoDB */
const User = mongoose.model('users', {
	userId: {
		type: String, required: true
	},
	password: {
		type: String, required: true
	},
	firstName: {
		type: String, required: true
	},
	lastName: {
		type: String, required: true
	},
	email: {
		type: String, required: true
	},
	addressField1: {
		type: String, required: true
	},
	addressField2: {
		type: String, required: true
	},
	city: {
		type: String, required: true
	},
	state: {
		type: String, required: true
	},
	zip: {
		type: String, required: true
	},
	country: {
		type: String, required: true
	}
});

/* Add User */
module.exports.addUser = (firstName, lastName, email, password, addressField1, addressField2, city, state, zip, country) => {
	User.countDocuments({}, (err, count) => {
		var passwordHash = "XXX"; //Salt and Hash Password before saving
		var user = new UserDB(count + 1, password, firstName, lastName, email, addressField1, addressField2, city, state, zip, country);
		addUser(new User(user));
	});
}

/* Store user in mongoose table */
var addUser = (user) => {
	user.save((err) => {
		if(err) throw err;
	})
}

/* Get All Users from Database */
module.exports.getAllUsers = (callback) => {
	User.find({}, (err, user) => {
		if(user) {
			callback(null, user);
		} else {
			callback(true, null);
		}
	});
}

/* Get User by userId from Database */
module.exports.getUser = (userId) => {
	try {
		return User.findOne({userId});
	} catch(e) {
		console.log(e);
	}
}

/* Verify User and render myItems */
module.exports.getUser = (email, password) => {
	try {
		return User.findOne({email, password});
	} catch(e) {
		console.log(e);
	}
}