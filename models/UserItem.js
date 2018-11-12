/* Include JavaScript Object (Model) for all Items */
// const model = require('../models/item');
// let items = model.getItems(); //Function to export all items

/* return the Item with the specified itemId from the hardcoded database */
// var getItem = (itemId) => {
// 	return items[itemId];
// }

/***

UserItem {
Item - an item object that belongs to this user (this user is the one that offered/added this item)
Rating - this user's rating for their item
Status - this attribute indicates swap item status - available, pending (offer made), swapped (offer accepted)
Swap Item - This is the item swapped with this user item (an item that was offered for swapping by another user and was swapped with this user item). It stores the Item Code to map the item in the database
Swap Item Rating - This is the user's rating for the item swapped with this user item.
Swapper Rating - This is the user's rating for the other user that owns the items swapped with this user item.
}

Note:
if the user item status is available then there's no values for Swap Item, Swap Item Rating or Swapper Rating.
if the user item status is pending then Swap Item has a value but not the rating for the swap item and the swapper.
if the user item status is swapped then the user will be able to rate the swap item and the swapper(the other user). 

***/

/* Associates an item with a user and a swap */

class UserItemClass {
	constructor(itemCode, itemName, category, description, rating, image_url, active, userRating, status) {
		this.code = itemCode,
		this.name = itemName,
		this.category = category,
		this.description = description,
		this.rating = rating,
		this.image_url = image_url,
		this.active = active,
		this.userRating = userRating,
		this.status = status
	}
}

// const userItem1 = new UserItem(getItem("item1"), '4', 'available', 0, 0, 0);
// const userItem2 = new UserItem(getItem("item3"), '4', 'pending', 6, 0, 0);
// const userItem3 = new UserItem(getItem("item5"), '2', 'swapped', 2, 0, 0);

// module.exports = {
// 	userItem1,
// 	userItem2,
// 	userItem3
// }

/*
Collection: userItems
[{
userId: "1",
code: "1", 
name: "Lord of the Rings",
category: "Movies", 
description: "The Lord of the Rings is a film series consisting of three high fantasy adventure films directed by Peter Jackson. They are based on the novel The Lord of the Rings by J. R. R. Tolkien. The films are subtitled The Fellowship of the Ring (2001), The Two Towers (2002) and The Return of the King (2003). They are a New Zealand-American venture produced by WingNut Films and The Saul Zaentz Company and distributed by New Line Cinema.", 
rating: 4,
image_url: "../resources/images/item1.png",
active: 'active',
userRating: '4',
status: 'available'
},
{
userId: "2",
code: '2', 
name: 'Game of Thrones',
category: 'Movies', 
description: 'George R.R. Martins best-selling book series `A Song of Ice and Fire is brought to the screen as HBO sinks its considerable storytelling teeth into the medieval fantasy epic. Its the depiction of two powerful families - kings and queens, knights and renegades, liars and honest men - playing a deadly game for control of the Seven Kingdoms of Westeros, and to sit atop the Iron Throne. Martin is credited as a co-executive producer and one of the writers for the series, which was filmed in Northern Ireland and Malta.', 
rating: 4,
image_url: '/resources/images/item2.png',
active: 'active',
userRating: '4',
status: 'available'
},
{
userId: "1",
code: '3', 
name: 'Hobbit',
category: 'Movies', 
description: 'The Hobbit is a film series consisting of three high fantasy adventure films directed by Peter Jackson. They are based on the 1937 novel The Hobbit by J. R. R', 
rating: 4.5,
image_url: '/resources/images/item3.png',
active: 'active',
userRating: '5',
status: 'available'
},
{
userId: "1",
code: '4', 
name: 'Car',
category: 'Vehicle', 
description: 'A car is a wheeled motor vehicle used for transportation. Most definitions of car say they run primarily on roads, seat one to eight people, have four tires, and mainly transport people rather than goods. Cars came into global use during the 20th century, and developed economies depend on them.', 
rating: 4,
image_url: '/resources/images/item4.png',
active: 'active',
userRating: '4',
status: 'available'	
},
{
userId: "2",
code: '5', 
name: 'Cycle',
category: 'Vehicle', 
description: 'A bicycle, also called a cycle or bike, is a human-powered or motor-powered, pedal-driven, single-track vehicle, having two wheels attached to a frame, one behind the other. A bicycle rider is called a cyclist, or bicyclist.', 
rating: 4.3,
image_url: '/resources/images/item5.png',
active: 'active',
userRating: '5',
status: 'available'	
},
{
userId: "2",
code: '6', 
name: 'Motorcycle',
category: 'Vehicle', 
description: 'A motorcycle, often called a bike, motorbike, or cycle, is a two- or three-wheeled motor vehicle.[1] Motorcycle design varies greatly to suit a range of different purposes: long distance travel, commuting, cruising, sport including racing, and off-road riding. Motorcycling is riding a motorcycle and related social activity such as joining a motorcycle club and attending motorcycle rallies.', 
rating: 4.9,
image_url: '/resources/images/item6.png',
active: 'active',
userRating: '5',
status: 'available'
}]

Collection: offers
[{
userId: 
swapUserId:
userItemCode:
swapUserItemCode:
status:
swapperRating:	
}]

Collection: swaps
[{
userId:
swapUserId:
userItemCode:
swapUserItemCode:
status:
swapperRating: 
}]
*/

/* Require Mongoose Library */
var mongoose = require('mongoose');

/***

// UserItems Model

UserItem {
userId - Uniquely identify each user
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

**/
const UserItem = mongoose.model('items', {
	userId: {
		type: String,
        required: true,
        minlength: 1
	},
	code: {
		type: String,
        required: true,
        minlength: 1
	},
	name: {
		type: String,
        required: true,
        trim: true,
        minlength: 1
	},
	category: {
		type: String,
        required: true,
        trim: true,
        minlength: 1
	},
	description: {
		type: String,
        required: true,
        trim: true,
        minlength: 1
	},
	rating: {
		type: String,
        required: true,
        trim: true,
        minlength: 1
	},
	image_url: {
		type: String,
        required: true,
        trim: true,
        minlength: 1
	},
	active: {
		type: String,
        required: true,
        trim: true,
        minlength: 1
	},
	userRating: {
		type: String,
        required: true,
        minlength: 5
	},
	status: {
		type: String,
        required: true,
        trim: true,
        minlength: 1
	}
});

module.exports = {
    UserItem
}

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

	}
}
/* Get Items Not belonging to the user */
module.exports.getNotAllItemsOfUser = (userId) => {
	// UserItem.find({userId: {$ne: "1"}, active: "active"}, (err, userItem) => {
	// 	if(userItem) {
	// 		callback(null, userItem);
	// 	} else {
	// 		callback(true, null);
	// 	}
	// });
	try {
		return UserItem.find({userId: {$ne: userId}, active: "active"});
	} catch(e) {

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

/* Add Item - TODO: add UserID, password */
module.exports.addItem = (itemCode, itemName, category, description, rating, image_url, active, userRating, status) => {
	var item = new UserItemClass(itemCode, itemName, category, description, rating, image_url, active, userRating, status);
	addItem(item);
}

/* Store in mongoose table */
var addItem = (item) => {
	UserItem.save((err) => {
		if(err) throw err;
		res.send('Item created successfully');
	})
}
/* Delete an item */
module.exports.deleteItem = (code) => {
	try {
		UserItem.findOneAndUpdate({code: code}, {$set: {active: "inactive"}}, {$new: true}, (err, doc) => {
			if(err) throw err;
		});
	} catch(e) {
		
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
		
	}
}