/* Include Express */
const express = require('express');
/* Express App*/
const app = express();
/* Include Express Session */
const session = require('express-session');

/* Include JavaScript Object (Model) for all Items */
const model = require('../models/Item');
let items = model.getItems(); //Function to export all items

/* return the Item with the specified itemId from the hardcoded database */
var getItem = (itemId) => {
	return items[itemId];
}

/* Profile Controller to manage user actions */
const ProfileController = require('../controls/ProfileController');

/* Render views from following directory*/
app.set('views', '../views');
/* Set View engine*/
app.set('view engine', 'ejs');
/* Use static resources from following directory*/
app.use('/resources', express.static('../resources'));
/* User Session - set a secret */
app.use(session({secret: "nbad"}));

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
app.get('/subCategories', (req, res) => {
	if(req.session.theUser === undefined) {
		/* Check catalogCategory parameter exist and it is valid */
		if(req.query.catalogCategory === 'Movies' || req.query.catalogCategory === 'Vehicle') {
			/* Dispatch list of sub categories of type catalogCategory */
			/* If the user is not defined display the complete catalog */
			res.render('subCategories', {
			welcome: 'Not signed in.',
			catalogCategory: req.query.catalogCategory,
			items,
			sessionStatus: false
			});
		} else {//If invalid catalogCategory, dispatch catalog as if no category had been provided
			res.render('categories', {
				welcome: 'Not signed in.',
				sessionStatus: false
			});
		}
	} else {
		if(req.query.catalogCategory === 'Movies' || req.query.catalogCategory === 'Vehicle') {
		var userItems = Object.values(items);
		tempcodes =[];
		userTempItems  = []; 
		/* Display items that do not belong to the active user */
		/* TODO: Modularize the below code to a function/method to the database utility classes that can filter the catalog based on a user */
		for(var i=0;i<req.session.currentProfile.userItems.length;i++) {
					tempcodes.push(req.session.currentProfile.userItems[i].item.code);
		}
		for(var j=0;j<userItems.length;j++) {
			if (tempcodes.indexOf( userItems[j].code) == -1) {
				userTempItems.push(userItems[j])
			}
		}
		/* Dispatch filtered Item List */
		res.render('subCategories', {
			welcome: 'Not signed in.',
			catalogCategory: req.query.catalogCategory,
			items: userTempItems,
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

/* GET Item Router */
app.get('/item', (req, res) => {
	if(req.session.theUser === undefined) {
		if(Object.keys(req.query.length != 0)) {
			/* Check the http request for a parameter called "itemCode" and validate it matches our format and it is valid */
			if(req.query.itemCode <= 6 && req.query.itemCode >= 1) {
				Object.keys(items).forEach((item, index) => {
					/* Valid Object should be added to the http response object */
					if(items[item]['code'] === req.query.itemCode) {
						/* Dispatch the individual item */
						res.render('item', {
							welcome: 'Not signed in.',
							item: getItem(item),
							sessionStatus: false,
							itemStatus: 'available'
						});
					} 
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
			var userItemsToStatus = req.session.currentProfile.userItems;
			var stat = req.query.itemCode;
			var itemStatus;
			for (var i = 0; i < userItemsToStatus.length; i++) {
				if (userItemsToStatus[i].item.code == stat) {
					itemStatus = userItemsToStatus[i].status;
				}
			}
			console.log(itemStatus);
			if(req.query.itemCode <= 6 && req.query.itemCode >= 1) {
				Object.keys(items).forEach((item, index) => {
					if(items[item]['code'] === req.query.itemCode) {
						res.render('item', {
							welcome: 'Welcome ' + req.session.theUser.firstName + '!',
							item: getItem(item),
							sessionStatus: true,
							itemStatus: itemStatus
						});
					}
				});
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
app.get('/myItems', (req, res) => {
	res.render('myItems', {
		welcome: 'Welcome Darshak!'
	});
});

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
app.get('/mySwaps', (req, res) => {
	if(req.session.theUser === undefined) {
		res.render('mySwaps', {
			welcome: 'Not signed in.',
			sessionStatus: false,
			swapList: {},
			name: 'My'
		});
	} else {
		var swapList = [];	
		var swapItemList = [];
		var userItemList;
		var flag = false;
		Object.keys(req.session.currentProfile.userItems).forEach((item) => {
			if(req.session.currentProfile.userItems[item].status === 'pending') {
				swapList.push(req.session.currentProfile.userItems[item]);
				swapItemList.push(getItem("item" + req.session.currentProfile.userItems[item].swapItem));
				flag = true;
				res.render('mySwaps', {
					welcome: 'Welcome ' + req.session.theUser.firstName + '!',
					swapList,
					swapItemList,
					sessionStatus: true,
					name: req.session.theUser.firstName
				});
			} 
		});
		if(!flag) {
			res.render('mySwaps', {
				welcome: 'Not signed in.',
				sessionStatus: true,
				swapList: {},
				name: 'My'
			});
				
		}
	}
});

/* Get Any URL Router*/
app.get('/*', (req, res) => {
	res.send('Plain Message');
});

/* Listen Express app on Port 8080 */
app.listen(8080, () => {
	console.log('App listening at port 8080');
});