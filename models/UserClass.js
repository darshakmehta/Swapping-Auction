/***

UserClass {
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
class UserClass {
	constructor(userId, firstName, lastName, email, address1, address2, city, state, zip, country) {
		this.userId = userId,
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


const UserClass1 = new UserClass('1', 'Darshak', 'Mehta', 'dmehta9@uncc.edu', '9527 University Terrace Dr.', 'Apt K', 'Charlotte', 'NC', '28262', 'USA');

module.exports = UserClass1;