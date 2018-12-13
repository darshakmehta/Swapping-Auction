const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const express = require('express');
const fs = require("fs");
const http = require("http");
const multer = require("multer");
var nodemailer = require('nodemailer');
const path = require("path");
const session = require('express-session');

/* Validation/Sanitization */
const { check, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

const urlencodedParser = bodyParser.urlencoded({extended: false});

const app = express();
app.set('views', '../views');
app.set('view engine', 'ejs');
app.use('/resources', express.static('../resources'));
app.use(cookieParser());
app.use(session({secret: "nbad"}));

const mongoose = require('../controls/mongoose');
var transporter = require('../controls/nodemailtransporter');
const ProfileController = require('../controls/ProfileController');/* Profile Controller to manage user actions */
app.use(ProfileController);

const User = require('../models/UserDB');
const UserItem = require('../models/UserItem');
const offer = require('../models/offer');
const userDB = require('../models/UserDB');
const UserProfile = require('../models/UserProfile');
const FeedbackDB = require('../models/FeedbackDB');

const profileOne = new UserProfile();
let userItem = require('../models/UserItem');
let items = [];
let categoryOptions = ['Movies', 'Vehicle'];
let itemOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15']; /* TODO: Update it to be dynamic */

/* GET Home Router */
app.get('/', (req, res) => {
	if (req.session.theUser === undefined) {
		res.render('index', {
			welcome: 'notSignedIn',
			sessionStatus: false,
			name: 'Anonymous'
		});
	} else {
		res.render('index', {
			welcome: req.session.theUser.firstName,
			sessionStatus: true,
			name: req.session.theUser.firstName
		});
	}
});

/* GET Categories Router */
app.get('/categories', (req, res) => {
	if (req.session.theUser === undefined) {
		res.render('categories', {
			welcome: 'notSignedIn',
			sessionStatus: false
		});
	} else {
		res.render('categories', {
			welcome: req.session.theUser.firstName,
			sessionStatus: true
		});
	}
});

/* GET Sub Categories Router - Use to display all sub categories of a choosen category */
app.get('/subCategories', async (req, res) => {
	if (req.session.theUser === undefined) {
		userItem.getAllItems((err, item) => {
			/* Check catalogCategory parameter exist and it is valid */
			if (categoryOptions.includes(req.query.catalogCategory)) {
				/* Dispatch list of sub categories of type catalogCategory */
				/* If the user is not defined display the complete catalog */
				res.render('subCategories', {
					welcome: 'notSignedIn',
					catalogCategory: req.query.catalogCategory,
					items: item,
					sessionStatus: false
				});
			} else {/*If invalid catalogCategory, dispatch catalog as if no category had been provided*/
				res.render('categories', {
					welcome: 'notSignedIn',
					sessionStatus: false
				});
			}
		});
	} else {
		let userId = req.session.theUser.userId;
		let items = await userItem.getNotAllItemsOfUser(userId);
		if (categoryOptions.includes(req.query.catalogCategory)) {
			/* Dispatch filtered Item List upon Logged-in user */
			res.render('subCategories', {
				welcome: req.session.theUser.firstName,
				catalogCategory: req.query.catalogCategory,
				items,
				sessionStatus: true
			});
		} else {/*If invalid catalogCategory, dispatch catalog as if no category had been provided*/
			res.render('categories', {
				welcome: req.session.theUser.firstName,
				sessionStatus: true
			});
		}
	}
});

/* GET Item Router */
app.get('/item', async (req, res) => {
	if (req.session.theUser === undefined) {
		if (Object.keys(req.query.length != 0)) {
			/* Check the http request for a parameter called "itemCode" and validate it matches our format and it is valid */
			if (itemOptions.includes(req.query.itemCode)) {
				let item = await userItem.getItem(req.query.itemCode);
				res.render('item', {
					welcome: 'notSignedIn',
					item: item,
					sessionStatus: false,
					itemStatus: 'available',
					swapIt: "yes"
				});
			} else { /* If item code is invalid, dispatch catalog as if no code had been provided */
				res.render('categories', {
					welcome: 'notSignedIn',
					sessionStatus: false
				});
			}
		} else { /* If no itemCode parameter is present, dispatch catalog */
			res.render('categories', {
				welcome: 'notSignedIn',
				sessionStatus: false
			});
		}
	} else {
		if (Object.keys(req.query.length != 0)) {
			if (itemOptions.includes(req.query.itemCode)) {
				let item = await userItem.getItem(req.query.itemCode);
				let itemStatus = item.status;
				let swapIt = req.session.theUser.userId === item.userId ? "no" : "yes";
				/*
				TODO: check if the item is user and he has got offer, or he has swap to send the appropriate message
				if (itemStatus === "pending") {
					if (swapIt === "no") {
						let offerItem = await offer.getOffer(req.sessionStatus.theUser.userId);
					} else {
					}
				}*/
				res.render('item', {
					welcome: req.session.theUser.firstName,
					item,
					sessionStatus: true,
					itemStatus,
					swapIt
				});
			} else { /* If item code is invalid, dispatch catalog as if no code had been provided */
				res.render('categories', {
					welcome: req.session.theUser.firstName,
					sessionStatus: true
				});
			}
		} else { /* If no itemCode parameter is present, dispatch catalog */
			res.render('categories', {
				welcome: req.session.theUser.firstName,
				sessionStatus: true
			});
			
		}
	}
});

/* GET Contact Router*/
app.get('/contact', (req, res) => {
	if (req.session.theUser === undefined) {
		res.render('contact', {
			welcome: 'notSignedIn',
			sessionStatus: false
		});
	} else {
		res.render('contact', {
			welcome: req.session.theUser.firstName,
			sessionStatus: true
		});
	}
});

/* GET About Router*/
app.get('/about', (req, res) => {
	if (req.session.theUser === undefined) {
		res.render('about', {
			welcome: 'notSignedIn',
			sessionStatus: false
		});
	} else {
		res.render('about', {
			welcome: req.session.theUser.firstName,
			sessionStatus: true
		});
	}
});

/* GET My Swaps Router*/
app.get('/mySwaps', async (req, res) => {
	if (req.session.theUser === undefined) {
		res.render('login', {
			welcome: 'notSignedIn',
			sessionStatus: false,
			name: 'Anonymous',
			error: 'null'
		});
	} else {
		let offerList = await offer.getPendingOffers(req.session.theUser.userId);
		let count = await offer.getCountOfPending(req.session.theUser.userId);
		if (count !== 0) {
			let userItemList= [];
			let swapUserItemList = [];
			let actionList = [];
			Object.keys(offerList).forEach(async (offer) => {
				let item = await userItem.getItem(offerList[offer].userItemCode);
				let swapItem = await userItem.getItem(offerList[offer].swapUserItemCode);
				if ((req.session.theUser.userId == offerList[offer].userId)) {
					userItemList.push(item);
					swapUserItemList.push(swapItem);
					actionList.push("withdraw");
				} else {
					userItemList.push(swapItem);
					swapUserItemList.push(item);
					actionList.push("accept/reject");
				}
				if ((count - 1) == offer) {
					res.render('mySwaps', {
						welcome: req.session.theUser.firstName,
						swapList: userItemList,
						swapItemList: swapUserItemList,
						sessionStatus: true,
						name: req.session.theUser.firstName,
						actionList,
						swapping: false
					});	
				} 
			});		
		} else {
			res.render('mySwaps', {
				welcome: req.session.theUser.firstName,
				sessionStatus: true,
				swapList: {},
				name: 'My',
				actionList: [],
				swapping: true
			});
		}
	}
});

/* POST Confirm Swap Router */
app.post('/confirmswap', urlencodedParser, async (req, res) => {
	if (req.session === undefined) {
		res.render('index', {
			welcome: 'notSignedIn',
			sessionStatus: false,
			name: 'Anonymous'
		});
	} else {
		offer.addOffer(req.body.userId, req.body.swapUserId, req.body.userItemCode, req.body.swapUserItemCode, "pending");
		await userItem.updateItemStatus(req.body.userItemCode, "pending");
		await userItem.updateItemStatus(req.body.swapUserItemCode, "pending");
		req.session.currentProfile.userItems = await userItem.getAllItemsOfUser(req.session.theUser.userId);
		res.render('myItems', {
          	welcome: req.session.theUser.firstName,
          	userItemList:req.session.currentProfile.userItems,
          	sessionStatus: true
        });
	}
});

/* GET Login Router*/
app.get('/login', (req, res) => {
	if (req.session.theUser === undefined) {
		res.render('login', {
			welcome: 'notSignedIn',
			sessionStatus: false,
			name: 'Anonymous',
			error: 'null'
		});
	} else {
		res.render('myItems', {
			welcome: req.session.theUser.firstName,
			userItemList: req.session.currentProfile.userItems,
			sessionStatus: true
		});
	}
});

/* GET Register Router*/
app.get('/register', (req, res) => {
	if (req.session.theUser === undefined) {
		res.render('register', {
			welcome: 'notSignedIn',
			sessionStatus: false,
			name: 'Anonymous',
			user: {},
		});
	} else {
		res.render('myItems', {
			welcome: req.session.theUser.firstName,
			userItemList: req.session.currentProfile.userItems,
			sessionStatus: true
		});
	}
});

/* POST Login Router */
app.post('/login', urlencodedParser, [
  check('username').blacklist(`{}<>&'/"`).isEmail().trim(),
  sanitizeBody('notifyOnReply').toBoolean()
], async (req, res) => {
	if (req.body.signIn === 'Submit') {
		if (req.session.theUser === undefined) {
			if (req.body.username === '') {
				res.render('login', {
					welcome: 'notSignedIn',
					sessionStatus: false,
					name: 'Anonymous',
					error: 'username'
				});
			} else if (req.body.password === '') {
				res.render('login', {
					welcome: 'notSignedIn',
					sessionStatus: false,
					name: 'Anonymous',
					error: 'password',
					username: req.body.username
				});
			} else {
				const errors = validationResult(req);
			  	if (!errors.isEmpty()) {
			    	res.render('login', {
						welcome: 'notSignedIn',
						sessionStatus: false,
						name: 'Anonymous',
						error: 'incorrect-email'
					});
			  	} else {
			  		let userLoginData = await userDB.getUser(req.body.username);
			  		if(userLoginData !== null) {
			  			if(userDB.checkUser(req.body.username, req.body.password, userLoginData.password, userLoginData.salt)) {
			  				req.session.theUser = userLoginData;
			  				profileOne.userId = req.session.theUser.userId;
							profileOne.userItems = await userItem.getAllItemsOfUser(profileOne.userId); /*  get the User Profile item - this is current placeholder for a user's saved information and items */
							req.session.currentProfile = profileOne; /*  add the user profile to the session object as "currentProfile" */
							res.render('myItems', {
								welcome: req.session.theUser.firstName,
								userItemList: req.session.currentProfile.userItems,
								sessionStatus: true
							});
			  			} else { /* Incorrect Password */
			  				req.session.theUser = undefined;
							req.session.currentProfile = undefined;
							res.render('login', {
								welcome: 'notSignedIn',
								sessionStatus: false,
								name: 'Anonymous',
								error: 'incorrect'
							});
			  			}
			  		} else { /* Incorrect Email */
			  			req.session.theUser = undefined;
						req.session.currentProfile = undefined;
						res.render('login', {
							welcome: 'notSignedIn',
							sessionStatus: false,
							name: 'Anonymous',
							error: 'incorrect-email'
						});
			  		}
			  	}
			}
		} else {		
			res.render('myItems', {
				welcome: req.session.theUser.firstName,
				userItemList: req.session.currentProfile.userItems,
				sessionStatus: true
			});
		}	
	} else {
		res.render('login', {
			welcome: 'notSignedIn',
			sessionStatus: false,
			name: 'Anonymous',
			error: 'null'
		});
	}
});

/* POST Register Router */
app.post('/register', urlencodedParser, [
  check('firstName').isAlpha().withMessage('First name is missing'),
  check('lastName').isAlpha().withMessage('Last name is missing'),
  check('email').blacklist(`{}<>&'/"`).isEmail().withMessage('must be an email'),
  check('password').isAlphanumeric().withMessage('password is missing'),
  check('confirmPassword').isAlphanumeric().withMessage('confirm password please'),
  check('addressField1').isAscii().withMessage('Address 1 is missing'),
  check('addressField2').isAscii().withMessage('Address 2 is missing'),
  check('city').isAscii().withMessage('City is missing'),
  check('state').isAscii().withMessage('state is missing'),
  check('zip').isNumeric().withMessage('zip is missing'),
  check('country').isAscii().withMessage('country is missing'),
  sanitizeBody('notifyOnReply').toBoolean()
], async (req, res) => {
	if (req.session.theUser === undefined) {
		const firstName = req.body.firstName;
		const lastName = req.body.lastName;
		const email = req.body.email;
		const password = req.body.password;
		const confirmPassword = req.body.confirmPassword;
		const addressField1 = req.body.addressField1;
		const addressField2 = req.body.addressField2;
		const city = req.body.city;
		const state = req.body.state;
		const zip = req.body.zip;
		const country = req.body.state;
		
		const errors = validationResult(req);
		console.log(errors.array());

	  	if (!errors.isEmpty()) {
	    	res.render('register', {
				welcome: 'notSignedIn',
				sessionStatus: false,
				name: 'Anonymous',
				user: req.body,
			});
	  	} else {
	  		let userData = await userDB.getUser(email);
	  		if(userData !== null) { /* Email already exist */
	  			console.log("Email already exist");
	  			res.render('register', {
					welcome: 'notSignedIn',
					sessionStatus: false,
					name: 'Anonymous',
					user: req.body,
				});
	  		} else {
		  		await userDB.addUser(firstName, lastName, email, password, addressField1, addressField2, city, state, zip, country);
				let flag = false; /* Switch to true to start email function */
				if (flag === true) {
					const mailOptions = {
					  from: 'dmehta9@uncc.edu', // sender address
					  to: email, // list of receivers
					  subject: 'Successfully Registerd ' + firstName, // Subject line
					  html: '<h1><p>Congratulations for your first step.</p></h1><h4>As a First Sign up to our website we give you 25 points to start your swapping journey</h4>'// plain text body
					};
					try {
						transporter.sendMail(mailOptions, function (err, info) {
						   if (err)
						     console.log(err)
						   else
						     console.log(info);
						});
					} catch(e) {
						console.log(e);
					}
				}
				res.render('login', {
					welcome: 'notSignedIn',
					sessionStatus: false,
					name: 'Anonymous',
					error:'success',
					firstName
				});
	  		}
	  	}
		
	} else {
		res.render('myItems', {
			welcome: req.session.theUser.firstName,
			userItemList: req.session.currentProfile.userItems,
			sessionStatus: true
		});
	}
});

app.get('/addItem', (req, res) => {
	if (req.session.theUser === undefined) {
		res.render('login', {
			welcome: 'notSignedIn',
			sessionStatus: false,
			name: 'Anonymous',
			error: 'null'
		});
	} else {
		res.render('addItem', {
			welcome: req.session.theUser.firstName,
			sessionStatus: true
		});
	}
});

/* Set Storage Engine */
const destination = (req, file, callback) => {
	callback(null, '../resources/images/');
};

const filename = (req, file, callback) => {
	callback(null, file.fieldname  + '-' + Date.now() + path.extname(file.originalname));
};

const storage = multer.diskStorage({
	destination, filename
});

/* Check File type */
const allowedImagesExts = ['jpg', 'png', 'gif', 'jpeg'];

const fileFilter =  (req, file, cb) => {
  cb(null, allowedImagesExts.includes(file.originalname.split('.').pop()))
}

/* Initialize upload */
const upload = multer({
	storage, 
	fileFilter
}).single('itemImage');


app.post('/addItem', urlencodedParser, async (req, res) => {
	if (req.session.theUser === undefined) {
		res.render('login', {
			welcome: 'notSignedIn',
			sessionStatus: false,
			name: 'Anonymous',
			error: 'null'
		});
	} else {
		upload(req, res, async (err) => {
			if (err) {
				/* Render Error */
				console.log(err);
			} else {
				if (req.file == undefined) {
					/* Render empty image error */
					console.log("No File selected");
				} else {
					/* Render file uploaded successful */
					console.log('File upload successful');
					const name = req.body.itemName;
					const category = req.body.itemCategory;
					const description = req.body.itemDescription;
					const userId = req.session.theUser.userId;
					/* TODO checks and validation */
					await userItem.addItem(userId, name, category, description, "/resources/images/" + req.file.filename);
					itemOptions.push(itemOptions.length + 1 + '');
					console.log(await userItem.getAllItemsOfUser(req.session.theUser.userId));
					req.session.currentProfile.userItems = await userItem.getAllItemsOfUser(req.session.theUser.userId);
					res.render('myItems', {
						welcome: req.session.theUser.firstName,
						userItemList: req.session.currentProfile.userItems,
						sessionStatus: true
					});
				}
			}
		});
	}
});

app.post('/confirmRating', urlencodedParser, async (req, res) => {
	if(req.session.theUser === undefined) {
		res.render('login', {
			welcome: 'notSignedIn',
			sessionStatus: false,
			name: 'Anonymous',
			error: 'null'
		});
	} else {
		var feedback = await FeedbackDB.getItemFeedback(req.session.theUser.userId, req.body.itemCode);
		if(feedback === null) {
			await FeedbackDB.addItemFeedback(req.session.theUser.userId, req.body.itemCode, req.body.rating, "");
			/* Average Rating */
			let item = await userItem.getItem(req.body.itemCode);
			console.log(item);
			let currentTotalRating = Number(item.totalUserRating) + Number(req.body.rating);
			let totalUsers = Number(item.totalUserRatedItem) + 1;
			let rating = Number((currentTotalRating / totalUsers).toFixed(2));
			
			if(item.userId === req.session.theUser.userId) {
				await userItem.updateMyItemRating(req.body.itemCode, rating, totalUsers, currentTotalRating, req.body.rating);	
			} else {
				await userItem.updateMyItemRating(req.body.itemCode, rating, totalUsers, currentTotalRating);	
			}
			/* Check some times it get updated sometimes it does not */
			let userUpdatedItem = await userItem.getItem(req.body.itemCode);
			let itemStatus = userUpdatedItem.status;
			let swapIt = req.session.theUser.userId === item.userId ? "no" : "yes";
			res.render('item', {
				welcome: req.session.theUser.firstName,
				item: userUpdatedItem,
				sessionStatus: true,
				itemStatus,
				swapIt
			});
		} else {
			let oldRating = feedback.rating;
			await FeedbackDB.updateItemFeedback(req.session.theUser.userId, req.body.itemCode, req.body.rating, "");
			/* Average Rating */
			let item = await userItem.getItem(req.body.itemCode);
			let currentTotalRating = Number(item.totalUserRating) + Number(req.body.rating) - Number(oldRating);
			let totalUsers = Number(item.totalUserRatedItem);
			let rating = (currentTotalRating / totalUsers).toFixed(2);
			if(item.userId === req.session.theUser.userId) {
				await userItem.updateMyItemRating(req.body.itemCode, rating, totalUsers, currentTotalRating, req.body.rating);	
			} else {
				await userItem.updateMyItemRating(req.body.itemCode, rating, totalUsers, currentTotalRating);	
			}
			/* Check some times it get updated sometimes it does not */
			let userUpdatedItem = await userItem.getItem(req.body.itemCode);
			let itemStatus = userUpdatedItem.status;
			let swapIt = req.session.theUser.userId === item.userId ? "no" : "yes";
			res.render('item', {
				welcome: req.session.theUser.firstName,
				item: userUpdatedItem,
				sessionStatus: true,
				itemStatus,
				swapIt
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