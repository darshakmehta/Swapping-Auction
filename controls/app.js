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
/* Include UserDB Class */
var userDB = require('../models/UserDB');
/* Include JavaScript Object (Model) for UserProfile */
var UserProfile = require('../models/UserProfile');
/* Include JavaScript Object (Model) for UserItem */
const profileOne = new UserProfile();
let items = [];

/* GET Home Router */
app.get('/', (req, res) => {
	if(req.session.theUser === undefined) {
		res.render('index', {
			welcome: 'Not signed in.',
			sessionStatus: false,
			name: 'Anonymous'
		});
	} else {
		res.render('index', {
			welcome: 'Welcome ' + req.session.theUser.firstName + '!',
			sessionStatus: true,
			name: req.session.theUser.firstName
		});
	}
});

/* Test Router to GET users */
app.get('/users', (req, res) => {
	User.find().then((user) => {
		//console.log(user);
		res.send(user);
	}, (e) => {
		console.log(e);
	});
});


/* Test Router to GET user Items*/
app.get('/userItems', (req, res) => {
	UserItem.find().then((userItem) => {
		res.send(userItem);
	}, (e) => {
		console.log(e);
	});
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

/* GET Sub Categories Router - Use to display all sub categories of a choosen category */
app.get('/subCategories', async (req, res) => {
	if(req.session.theUser === undefined) {
		var itemList = [];
		userItem.getAllItems((err, item) => {
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

/* GET Item Router */
app.get('/item', async (req, res) => {
	
	if(req.session.theUser === undefined) {
		if(Object.keys(req.query.length != 0)) {
			/* Check the http request for a parameter called "itemCode" and validate it matches our format and it is valid */
			if(req.query.itemCode <= 6 && req.query.itemCode >= 1) {
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
			if(req.query.itemCode <= 6 && req.query.itemCode >= 1) {
				var item = await userItem.getItem(req.query.itemCode);
				var itemStatus = item.status;
				var swapIt = req.session.theUser.userId === item.userId ? "no" : "yes";
				/*
				TODO: check if the item is user and he has got offer, or he has swap to send the appropriate message
				if(itemStatus === "pending") {
					if(swapIt === "no") {
						var offerItem = await offer.getOffer(req.sessionStatus.theUser.userId);
					} else {

					}
					
				}*/
				res.render('item', {
					welcome: 'Welcome ' + req.session.theUser.firstName + '!',
					item,
					sessionStatus: true,
					itemStatus: itemStatus,
					swapIt
				});
			} else {
				res.render('categories', {
					welcome: 'Welcome ' + req.session.theUser.firstName + '!',
					sessionStatus: true
				});
			}
		} else { 
			res.render('categories', {
				welcome: 'Welcome ' + req.session.theUser.firstName + '!',
				sessionStatus: true
			});
			
		}
	}
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

/* Confirm Swap Router */
app.post('/confirmswap', urlencodedParser, async (req, res) => {
	if(req.session === undefined) {
		res.render('index', {
			welcome: 'Not signed in.',
			sessionStatus: false,
			name: 'Anonymous'
		});
	} else {
		offer.addOffer(req.body.userId, req.body.swapUserId, req.body.userItemCode, req.body.swapUserItemCode, "pending", "0");
		await userItem.updateItemStatus(req.body.userItemCode, "pending");
		await userItem.updateItemStatus(req.body.swapUserItemCode, "pending");
		req.session.currentProfile.userItems = await userItem.getAllItemsOfUser(req.session.theUser.userId);
		res.render('myItems', {
          	welcome: 'Welcome ' + req.session.theUser.firstName + '!',
			itemMsg : true,
          	userItemList:req.session.currentProfile.userItems,
          	sessionStatus: true
        });
	}
});

app.get('/login', (req, res) => {
	if(req.session.theUser === undefined) {
		res.render('login', {
			welcome: 'Not signed in.',
			sessionStatus: false,
			name: 'Anonymous',
			error: 'null'
		});
	} else {
		res.render('myItems', {
			welcome: 'Welcome ' + req.session.theUser.firstName + '!',
			itemMsg : true,
			userItemList: req.session.currentProfile.userItems,
			sessionStatus: true
		});
	}
});

app.get('/register', (req, res) => {
	if(req.session.theUser === undefined) {
		res.render('register', {
			welcome: 'Not signed in.',
			sessionStatus: false,
			name: 'Anonymous'
		});
	} else {
		res.render('myItems', {
			welcome: 'Welcome ' + req.session.theUser.firstName + '!',
			itemMsg : true,
			userItemList: req.session.currentProfile.userItems,
			sessionStatus: true
		});
	}
});

app.post('/login', urlencodedParser, async (req, res) => {
	if(req.body.signIn === 'Submit') {
		if(req.session.theUser === undefined) {
			if(req.body.username === '') {
				res.render('login', {
					welcome: 'Not signed in.',
					sessionStatus: false,
					name: 'Anonymous',
					error: 'username'
				});
			} else if(req.body.password === '') {
				res.render('login', {
					welcome: 'Not signed in.',
					sessionStatus: false,
					name: 'Anonymous',
					error: 'password',
					username: req.body.username
				});
			} else {
				req.session.theUser = await userDB.getUser(req.body.username, req.body.password);
				if(req.session.theUser === null) {
					req.session.theUser = undefined; /*  clear the session*/
					req.session.currentProfile = undefined; /*  clear the UserProfile*/
					res.render('login', {
						welcome: 'Not signed in.',
						sessionStatus: false,
						name: 'Anonymous',
						error: 'incorrect'
					});
				} else {
					profileOne.userId = req.session.theUser.userId;
					profileOne.userItems = await userItem.getAllItemsOfUser(profileOne.userId); /*  get the User Profile item - this is current placeholder for a user's saved information and items */
					req.session.currentProfile = profileOne; /*  add the user profile to the session object as "currentProfile" */
					/* Check if user has any items if it does not have any item dispatch with message as "There are no items to display" */
					if(req.session.currentProfile.userItems === undefined || req.session.currentProfile.userItems.length === 0) {
						res.render('myItems', {
							welcome: 'Welcome ' + req.session.theUser.firstName + '!',
							itemMsg: false,
							itemsMsg: 'There are no items to display',
							sessionStatus: true
						});
					} else { /* Dispatch to Profile view with user Items added on currentProfile*/
						res.render('myItems', {
							welcome: 'Welcome ' + req.session.theUser.firstName + '!',
							itemMsg : true,
							userItemList: req.session.currentProfile.userItems,
							sessionStatus: true
						});
					}
				}
			}
		} else {		
			res.render('myItems', {
				welcome: 'Welcome ' + req.session.theUser.firstName + '!',
				itemMsg : true,
				userItemList: req.session.currentProfile.userItems,
				sessionStatus: true
			});
		}	
	} else {
		res.render('login', {
			welcome: 'Not signed in.',
			sessionStatus: false,
			name: 'Anonymous',
			error: 'null'
		});
	}
});

app.post('/register', urlencodedParser, async (req, res) => {
	if(req.session.theUser === undefined) {
		var firstName = req.body.firstName;
		var lastName = req.body.lastName;
		var email = req.body.email;
		var password = req.body.password;
		var confirmPassword = req.body.confirmPassword;
		var addressField1 = req.body.addressField1;
		var addressField2 = req.body.addressField2;
		var city = req.body.city;
		var state = req.body.state;
		var zip = req.body.zip;
		var country = req.body.state;
		/* TODO checks and validation */
		await userDB.addUser(firstName, lastName, email, password, addressField1, addressField2, city, state, zip, country);
		res.render('login', {
			welcome: 'Not signed in.',
			sessionStatus: false,
			name: 'Anonymous',
			error:'success',
			firstName
		});
	} else {
		res.render('myItems', {
			welcome: 'Welcome ' + req.session.theUser.firstName + '!',
			itemMsg : true,
			userItemList: req.session.currentProfile.userItems,
			sessionStatus: true
		});
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