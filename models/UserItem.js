/***

UserItem {
Item Code - Unique identifier for the item --> TODO: Alphanumeric string
Item Name - Name of the product
Catalog Category - Select or Arrange items by section or type in the catalog
Description - describe the importance of the item
Rating - this user's rating for their item
Image URL -  Item image URL - generated based on itemCode and Directory file path
active - Check if product is active or inactive(deleted)
user Rating - This is the user's rating by other users
Status - this attribute indicates swap item status - available, pending (offer made), swapped (offer accepted)
}

***/

/* Represents a ItemDB */
class UserItemClass {
	constructor(code, name, category, description, rating, image_url, active, userRating, status) {
		this.code = code,
		this.name = name,
		this.category = category,
		this.description = description,
		this.rating = rating,
		this.image_url = image_url,
		this.active = active,
		this.userRating = userRating,
		this.status = status
	}
}

/* Require Mongoose Library */
var mongoose = require('mongoose');

/* Represents User with ItemDB in MongoDB */
const UserItem = mongoose.model('items', {
	userId: {
		type: String, required: true
	},
	code: {
		type: String, required: true
	},
	name: {
		type: String, required: true
	},
	category: {
		type: String, required: true
	},
	description: {
		type: String, required: true
	},
	rating: {
		type: String, required: true
	},
	image_url: {
		type: String, required: true
	},
	active: {
		type: String, required: true
	},
	userRating: {
		type: String, required: true
	},
	status: {
		type: String, required: true
	}
});

/* Get All Items from Database */
module.exports.getAllItems = (callback) => {
	UserItem.find({active: "active"}, (err, userItem) => {
		if(userItem) {
			callback(null, userItem);
		} else {
			callback(true, null);
		}
	});
}

/* Get All Items from Database for particular User */
module.exports.getAllItemsOfUser = (userId) => {
	try {
		return UserItem.find({userId: userId, active: "active"});
	} catch(e) {
		console.log(e);	
	}
}

/* Get Items Not belonging to the user */
module.exports.getNotAllItemsOfUser = (userId) => {
	try {
		return UserItem.find({userId: {$ne: userId}, active: "active"});
	} catch(e) {
		console.log(e);	
	}
}

/* Get Item by itemCode from Database */
module.exports.getItem = (code) => {
	try {
		return UserItem.findOne({code});
	} catch(e) {
		console.log(e);
	}
}

/* Add Item - TODO: get UserID by req.session.theUser.userId */
module.exports.addItem = (userId, code, name, category, description, rating, image_url, active, userRating, status) => {
	var item = new UserItemClass(userId, code, name, category, description, rating, image_url, active, userRating, status);
	addItem(item);
}

/* Store in mongoose table */
var addItem = (item) => {
	UserItem.save((err) => {
		if(err) throw err;
	})
}

/* Delete an item */
module.exports.deleteItem = (code) => {
	try {
		UserItem.findOneAndUpdate({code: code}, {$set: {active: "inactive"}}, {$new: true}, (err, doc) => {
			if(err) throw err;
		});
	} catch(e) {
		console.log(e);	
	}
}

/* Get Item By name */
module.exports.getItemByName = (name) => {
	try {
		return UserItem.findOne({name});
	} catch(e) {
		console.log(e);
	}
}

/*Update Item Status */
module.exports.updateItemStatus = (code, status) => {
	try {
		UserItem.findOneAndUpdate({code: code}, {$set: {status: status}}, {$new: true}, (err, doc) => {
			if(err) throw err;
		});
	} catch(e) {
		console.log(e);	
	}
}