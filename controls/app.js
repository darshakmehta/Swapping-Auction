/* Include Express */
const express = require('express');
/* Express App*/
const app = express();
/* Include Express Session */
const session = require('express-session');
/* Include Body Parser */
const bodyParser = require('body-parser');
/* Url encoded Parser for POST Requests */
const urlencodedParser = bodyParser.urlencoded({extended: false});
/* Include Cookie Parser */
const cookieParser = require('cookie-parser');

/* Include JavaScript Object (Model) for all Items */
//const model = require('../models/Item');
//let items = model.getItems(); //Function to export all items

/* return the Item with the specified itemId from the hardcoded database */
// var getItem = (itemId) => {
// 	return items[itemId];
// }

let userItem = require('../models/UserItem');

/* Profile Controller to manage user actions */
const ProfileController = require('../controls/ProfileController');
app.use(ProfileController);
/* Render views from following directory*/
app.set('views', '../views');
/* Set View engine*/
app.set('view engine', 'ejs');
/* Use static resources from following directory*/
app.use('/resources', express.static('../resources'));
/* Use Cookie Parser */
app.use(cookieParser());
/* User Session - set a secret */
app.use(session({secret: "nbad"}));

var {ObjectID} = require('mongodb');

var {mongoose} = require('../controls/mongoose');
var {User} = require('../models/UserDB');
var {UserItem} = require('../models/UserItem');
var offer = require('../models/offer');

let items = [];

/* GET Home Router */
app.get('/', (req, res) => {
	if(req.session.theUser === undefined) {
		res.render('index', {
			welcome: 'Not signed in.',
			sessionStatus: false

		});
	} else {
		res.render('index', {
			welcome: 'Welcome ' + req.session.theUser.firstName + '!',
			sessionStatus: true
		});
	}
});

/* Router to GET users */
app.get('/users', (req, res) => {
	User.find().then((user) => {
		//console.log(user);
		res.send(user);
	}, (e) => {
		console.log(e);
	});
});


/* Router to GET user Items*/
app.get('/userItems', (req, res) => {
	UserItem.find().then((userItem) => {
		res.send(userItem);
	}, (e) => {
		console.log(e);
	});
});

/* GET Home Router */
app.get('/home', (req, res) => {
	if(req.session.theUser === undefined) {
		res.render('index', {
			welcome: 'Not signed in.',
			sessionStatus: false
		});
	} else {
		res.render('index', {
			welcome: 'Welcome ' + req.session.theUser.firstName + '!',
			sessionStatus: true
		});
	}
});


/* GET Categories Router - Use to display categories belonging to the Catalog */
app.get('/categories', (req, res) => {
	if(req.session.theUser === undefined) {
		res.render('categories', {
			welcome: 'Not signed in.',
			sessionStatus: false
		});
	} else {
		res.render('categories', {
			welcome: 'Welcome ' + req.session.theUser.firstName + '!',
			sessionStatus: true
		});
	}
});

var userTempItems  = []; //List of user items which does not belong to user
var tempcodes = []; //List of item codes which belongs to user

/* GET Sub Categories Router - Use to display all sub categories of a choosen category */
app.get('/subCategories', async (req, res) => {
	if(req.session.theUser === undefined) {
		var itemList = [];
		userItem.getAllItems((err, item) => {
			//console.log(itemList);
			/* Check catalogCategory parameter exist and it is valid */
			if(req.query.catalogCategory === 'Movies' || req.query.catalogCategory === 'Vehicle') {
				/* Dispatch list of sub categories of type catalogCategory */
				/* If the user is not defined display the complete catalog */
				res.render('subCategories', {
				welcome: 'Not signed in.',
				catalogCategory: req.query.catalogCategory,
				items: item,
				sessionStatus: false
				});
			} else {//If invalid catalogCategory, dispatch catalog as if no category had been provided
				res.render('categories', {
					welcome: 'Not signed in.',
					sessionStatus: false
				});
			}
		});
	} else {
		var userId = req.session.theUser.userId;
		var item = await userItem.getNotAllItemsOfUser(userId);
		if(req.query.catalogCategory === 'Movies' || req.query.catalogCategory === 'Vehicle') {
		// var userItems = Object.values(items);
		// tempcodes =[];
		// userTempItems  = []; 
		/* Display items that do not belong to the active user */
		/* TODO: Modularize the below code to a function/method to the database utility classes that can filter the catalog based on a user */
		// for(var i=0;i<req.session.currentProfile.userItems.length;i++) {
		// 			tempcodes.push(req.session.currentProfile.userItems[i].code);
		// }
		// for(var j=0;j<userItems.length;j++) {
		// 	if (tempcodes.indexOf( userItems[j].code) == -1) {
		// 		userTempItems.push(userItems[j])
		// 	}
		// }
		/* Dispatch filtered Item List */
		res.render('subCategories', {
			welcome: 'Not signed in.',
			catalogCategory: req.query.catalogCategory,
			items: item,
			sessionStatus: true
		});
		} else { //If invalid catalogCategory, dispatch catalog as if no category had been provided
			res.render('categories', {
				welcome: 'Not signed in.',
				sessionStatus: true
			});
		}
	}
});

var findItems = async() => {
	
	return items;
}


/* GET Item Router */
app.get('/item', async (req, res) => {
	
	if(req.session.theUser === undefined) {
		if(Object.keys(req.query.length != 0)) {
			/* Check the http request for a parameter called "itemCode" and validate it matches our format and it is valid */
			if(req.query.itemCode <= 6 && req.query.itemCode >= 1) {
				/*
				Object.keys(items).forEach((item, index) => {
					/* Valid Object should be added to the http response object 
					if(items[item]['code'] === req.query.itemCode) {
						/* Dispatch the individual item 
						res.render('item', {
							welcome: 'Not signed in.',
							item: getItem(item),
							sessionStatus: false,
							itemStatus: 'available'
						});
					} 
				});
				*/
				/* Await till the item is returned */
				var item = await userItem.getItem(req.query.itemCode);
				/* Render individual Item */
				res.render('item', {
					welcome: 'Not signed in.',
					item: item,
					sessionStatus: false,
					itemStatus: 'available',
					swapIt: "yes"
				});
					
			} else { //If item code is invalid, dispatch catalog as if no code had been provided
				res.render('categories', {
						welcome: 'Not signed in.',
						sessionStatus: false
					});
			}
		} else { //If no itemCode parameter is present, dispatch catalog
			res.render('categories', {
				welcome: 'Not signed in.',
				sessionStatus: false
			});
		}
	} else {
		if(Object.keys(req.query.length != 0)) {
			// var userItemsToStatus = req.session.currentProfile.userItems;
			// var stat = req.query.itemCode;
			// var itemStatus;
			// for (var i = 0; i < userItemsToStatus.length; i++) {
			// 	if (userItemsToStatus[i].item.code == stat) {
			// 		itemStatus = userItemsToStatus[i].status;
			// 	}
			// }
			// console.log(itemStatus);
			if(req.query.itemCode <= 6 && req.query.itemCode >= 1) {
				//Object.keys(items).forEach((item, index) => {
				//	if(items[item]['code'] === req.query.itemCode) {
				var item = await userItem.getItem(req.query.itemCode);
				var itemStatus = item.status;
				var swapIt = req.session.theUser.userId === item.userId ? "no" : "yes";
				res.render('item', {
					welcome: 'Welcome ' + req.session.theUser.firstName + '!',
					item,
					sessionStatus: true,
					itemStatus: itemStatus,
					swapIt
				});
				// 	}
				// });
			} else {
				res.render('categories', {
					welcome: 'Welcome ' + req.session.theUser.firstName + '!',
					sessionStatus: true
				});
			}
			// if(tempcodes.indexOf(req.query.itemCode)==-1) {
			// 	Object.keys(items).forEach((item, index) => {
			// 		if(items[item]['code'] === req.query.itemCode) {
			// 			res.render('item', {
			// 				welcome: 'Welcome ' + req.session.theUser.firstName + '!',
			// 				item: getItem(item),
			// 				sessionStatus: true,

			// 			});
			// 		}
			// 	});
			// } else {
			// 	res.render('categories', {
			// 		welcome: 'Welcome ' + req.session.theUser.firstName + '!',
			// 		sessionStatus: true,
			// 	});
			// }

		} else { 
			res.render('categories', {
				welcome: 'Welcome ' + req.session.theUser.firstName + '!',
				sessionStatus: true
			});
			
		}
	}
});

/* Get My Items Router*/
/*app.get('/myItems', (req, res) => {
	res.render('myItems', {
		welcome: 'Welcome Darshak!',
		sessionStatus: true
	});
});*/

/* Get Contact Router*/
app.get('/contact', (req, res) => {
	if(req.session.theUser === undefined) {
		res.render('contact', {
			welcome: 'Not signed in.',
			sessionStatus: false

		});
	} else {
		res.render('contact', {
			welcome: 'Welcome ' + req.session.theUser.firstName + '!',
			sessionStatus: true
		});
	}
});

/* Get About Router*/
app.get('/about', (req, res) => {
	if(req.session.theUser === undefined) {
		res.render('about', {
			welcome: 'Not signed in.',
			sessionStatus: false

		});
	} else {
		res.render('about', {
			welcome: 'Welcome ' + req.session.theUser.firstName + '!',
			sessionStatus: true
		});
	}
});

app.get('/swap', (req, res) => {
	res.render('swap', {
		welcome: 'Welcome Darshak!'
	});
});

/* Get My Swaps Router*/
app.get('/mySwaps', async (req, res) => {
	
	if(req.session.theUser === undefined) {
		res.render('mySwaps', {
			welcome: 'Not signed in.',
			sessionStatus: false,
			swapList: {},
			name: 'My',
			actionList: []
		});
	} else {
		
		var offerList = await offer.getPendingOffers();
		
		var count = await offer.getCountOfPending();
		if(count !== 0) {
				var userItemList= [];
				var swapUserItemList = [];
				var actionList = [];
				Object.keys(offerList).forEach(async (offer) => {
					var item = await userItem.getItem(offerList[offer].userItemCode);
					userItemList.push(item);
					var swapItem = await userItem.getItem(offerList[offer].swapUserItemCode);
					swapUserItemList.push(swapItem);
					if((req.session.theUser.userId == offerList[offer].userId)) {
						actionList.push("withdraw");
					} else {
						actionList.push("accept/reject");
					}
					if((count - 1) == offer) {
						res.render('mySwaps', {
							welcome: 'Welcome ' + req.session.theUser.firstName + '!',
							swapList: userItemList,
							swapItemList: swapUserItemList,
							sessionStatus: true,
							name: req.session.theUser.firstName,
							actionList
						});	
					} 
				});		
		} else {
			res.render('mySwaps', {
				welcome: 'Welcome ' + req.session.theUser.firstName + '!',
				sessionStatus: true,
				swapList: {},
				name: 'My',
				actionList: []
			});
		}
		
	}
});

app.post('/confirmswap', urlencodedParser, async (req, res) => {
	// var nameOfItemAvailableToSwap = req.body.itemSelected;
	 /*TODO get Item code from front end because products can have same name */
	// var item = await userItem.getItemByName(nameOfItemAvailableToSwap);
	// var codeOfItemAvaialbleToSwap = item.code;
	//console.log(codeOfItemAvaialbleToSwap);
	if(req.session === undefined) {
		res.render('index', {
			welcome: 'Not signed in.',
			sessionStatus: false
		});
	} else {
		// console.log(req.body);
		offer.addOffer(req.body.userId, req.body.swapUserId, req.body.userItemCode, req.body.swapUserItemCode, "pending", "0");
		await userItem.updateItemStatus(req.body.userItemCode, "pending");
		await userItem.updateItemStatus(req.body.swapUserItemCode, "pending");
		// console.log(req.session.theUser.userId);
		req.session.currentProfile.userItems = await userItem.getAllItemsOfUser(req.session.theUser.userId);
		// console.log(req.session.currentProfile.userItems);
		res.render('myItems', {
          	welcome: 'Welcome ' + req.session.theUser.firstName + '!',
			itemMsg : true,
          	userItemList:req.session.currentProfile.userItems,
          	sessionStatus: true
        });
	}
});

/* Get Any URL Router*/
// app.get('/*', (req, res) => {
// 	res.send('Plain Message');
// });

/* Listen Express app on Port 8080 */
app.listen(8080, () => {
	console.log('App listening at port 8080');
});