/* Include JavaScript Object (Model) for this User Items */
const UserItems = require('../models/UserItem');

/***

UserProfile {
	User ID - Unique identifier for the user
	User Items - List of UserItem(s)
	removeUserItem(item) - Method to remove UserItem associated with the given item in parameter
	getUserItems - return a List/Collection of UserItems from this user profile
	emptyProfile - clears the entire profile contents, resets the UserItem List to null
	getUserProfile - Returns a User Profile object for a specified user by userId
}

***/

/* A class to manage a List/Collection of UserItem(s) */
class UserProfile {

	constructor(userId, userItems) {
		this.userId = userId,
		this.userItems = userItems
	}

	removeUserItem(item) {

	}

	getUserItems() {
		var Items = [UserItems.userItem1, UserItems.userItem2, UserItems.userItem3];
		return Items;
	}

	emptyProfile() {

	}

	getUserProfile(userId) {
		//return user Profile
	}
}

module.exports = UserProfile;