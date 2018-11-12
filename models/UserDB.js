/***

UserDB {
User ID - Unique identifier for the user
First Name
Last Name
Email Address
Address Field 1
Address Field 2
City
State / Region
Postal Code / Zip Code
Country	
}

getusers() - returns a set of all the users in the database

***/

/* Represents a user */
class UserDB {
	constructor(firstName, lastName, email, address1, address2, city, state, zip, country) {
		//this.userId = userId, Auto Increment User id
		this.firstName = firstName,
		this.lastName = lastName,
		this.emailAddress = email,
		this.addressField1 = address1,
		this.addressField2 = address2,
		this.city = city,
		this.stateOrRegion = state,
		this.postalCode = zip,
		this.country = country
	}
	getUsers(){
		//return all users
	}
}


//const User1 = new UserDB('1', 'Darshak', 'Mehta', 'dmehta9@uncc.edu', '9527 University Terrace Dr.', 'Apt K', 'Charlotte', 'NC', '28262', 'USA');

//module.exports = User1;

/*


[{
userId: "1",
firstName : "Darshak",
lastName :"Mehta",
email: "dmehta9@uncc.edu",
addressField1: "9527 University Terrace Dr.",
addressField2: "Apt K",
city: "Charlotte",
state: "NC",
zip: "28262",
country: "USA"
},
{
userId: "2",
firstName : "Russel",
lastName :"Peters",
email: "rpeters@uncc.edu",
addressField1: "10004 University Terrace Dr.",
addressField2: "Apt A",
city: "Charlotte",
state: "NC",
zip: "28262",
country: "USA"
}]


*/


var mongoose = require('mongoose');
var User = mongoose.model('users', {
	userId: {
		type: String,
        required: true,
        minlength: 1
	},
	firstName: {
		type: String,
        required: true,
        trim: true,
        minlength: 1
	},
	lastName: {
		type: String,
        required: true,
        trim: true,
        minlength: 1
	},
	emailAddress: {
		type: String,
        required: true,
        trim: true,
        minlength: 1
	},
	addressField1: {
		type: String,
        required: true,
        trim: true,
        minlength: 1
	},
	addressField2: {
		type: String,
        required: true,
        trim: true,
        minlength: 1
	},
	city: {
		type: String,
        required: true,
        trim: true,
        minlength: 1
	},
	stateOrRegion: {
		type: String,
        required: true,
        trim: true,
        minlength: 1
	},
	postalCode: {
		type: String,
        required: true,
        minlength: 5
	},
	country: {
		type: String,
        required: true,
        trim: true,
        minlength: 1
	}
});

module.exports = {
    User
}

/* Add User */
module.exports.addUser = (firstName, lastName, email, address1, address2, city, state, zip, country) => {
	User.countDocuments({}, (err, count) => {
		var user = new UserDB(count + 1, firstName, lastName, email, address1, address2, city, state, zip, country);
		addUser(user);
	});
}

/* Store in mongoose table */
var addUser = (user) => {
	User.save((err) => {
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
