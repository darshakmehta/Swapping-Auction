/* Include HTTP */
const http = require('http');
/* Include Express */
const express = require('express');
/* Include Express Session */
const session = require('express-session');

/* Express App*/
const app = express();

/* Include JavaScript Object (Model) for all Items from database */
const model = require('../models/Item'); /* Function to export all items */
let items = model.getItems();

/* return the Item with the specified itemId from the hardcoded database */
var getItem = (itemId) => {
	return items[itemId];
}

/* Include JavaScript Object (Model) for UserProfile */
var UserProfile = require('../models/UserProfile');
/* Include JavaScript Object (Model) for UserItem */
var userItem = require('../models/UserItem');

/* Create JavaScript Object (Model) for UserProfile */
const profileOne = new UserProfile();

/* Render views from following directory*/
app.set('views', '../views');
/* Set View engine*/
app.set('view engine', 'ejs');
/* Use static resources from following directory*/
app.use('/resources', express.static('../resources'));

/* actions array represents possible set of User Action */
var actions = ['accept', 'reject', 'update', 'withdraw', 'offer', 'delete', 'signout'];

app.get('/myItems', (req, res) => {
	
	/* If user have taken set of action on the profile than assign the sessionProfile to currentProfile */
	if(req.session.sessionProfile != undefined)
		req.session.currentProfile = req.session.sessionProfile;

	if(req.session.theUser === undefined) { /* Check the session for a current user, using the attribute "theUser" */
		var user = require('../models/UserDB'); /* create a User Object, by selecting the first (or random) user from the UserDB */
		/* Now user is the current placeholder for having the user go through all the steps of entering their details or logging in to their account */
		req.session.theUser = user; /*  add the User object to the current session as "theUser" */
		profileOne.userId = req.session.theUser.userId;
		profileOne.userItems = profileOne.getUserItems(); /*  get the User Profile item - this is current placeholder for a user's saved information and items */
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
	} else { /* if there is a user exist in the session on "theUser" disptach to Profile view with user Items*/
		res.render('myItems', {
			welcome: 'Welcome ' + req.session.theUser.firstName + '!',
			itemMsg : true,
			userItemList: req.session.currentProfile.userItems,
			sessionStatus: true
		});
	}
});

/* If action is "signout" clear the session and dispatch to the categories/catalog view */
app.get('/signout', (req, res) => {
	req.session.theUser = undefined; /*  clear the session*/
	req.session.currentProfile = undefined; /*  clear the UserProfile*/
	res.render('categories', { /* dispatch to the categories view*/
		welcome: 'Not signed in.',
		sessionStatus: false
	});
});


app.get('myItems/:action', (req, res) => {
	if(req.session.theUser !== undefined) {
		if(action.includes(req.params.action)) {
			res.render('myItems', {
				welcome: 'Welcome ' + req.session.theUser.firstName + '!',
				itemMsg : true,
				userItemList: req.session.currentProfile.userItems,
				sessionStatus: true
			});
		} else {
			res.render('myItems', {
				welcome: 'Welcome ' + req.session.theUser.firstName + '!',
				itemMsg : true,
				userItemList: req.session.currentProfile.userItems,
				sessionStatus: true
			});
		}
	} else {
		res.render('index', {
			welcome: 'Not signed in.',
			sessionStatus: false
		});
	}
});

/* check http request for a parameter called "action" and "theItem" */
app.get('/myItems/:action/:theItem', (req, res) => {
	var swapList = []; /* List containing UserItems with pending status*/
	var swapItemList = []; /* List containing Swapped Item from database for current user item with status as pending*/
	var userItemList; /*  Represents available item requested by the user action*/
	if(req.session.theUser !== undefined) { /* if there is a user attribute and it is valid*/
		if(actions.includes(req.params.action) && req.params.action === "update") { /* check the http request for a parameter called "action" having a valid value from actions array*/
				/* if the action is update */
				if(req.params !== undefined && req.params.theItem === "1" || req.params.theItem === "2" || 
					req.params.theItem === "3" || req.params.theItem === "4" || req.params.theItem === "5" || req.params.theItem === "6" ) { /* check for a parameter called "theItem and validate that its value matches our item code format and is a valid current item code" */
					/* TODO: validate that this request was an intentional user action
						- check that it originated from a view that displayed this item as a candidate for an update and all items displayed are valid current items and that they belong to this user 
						Hint: Use a hidden field named "itemList" in the view with the item code as the value for that field. The controller with receive that as a paramter with that name and having an array of values (all the items on the view). 
						For example in Java, request.getParameterValues(“itemList”) will give you a list of all the items on the view)*/

					/* If the item validates and exists in the user profile, get the UserItem Object saved in the user profile for this current item and check the status value */
					Object.keys(req.session.currentProfile.userItems).forEach((item) => { /* iterate all the Items belonging to current user*/
						if(req.session.currentProfile.userItems[item].item.code === req.params.theItem) {
							if(req.session.currentProfile.userItems[item].status === 'pending') { /*  add the UserItem object to the request as "swapItem" and redirect to mySwaps view (to allow the user to accept/reject/withdraw)*/
								swapList.push(req.session.currentProfile.userItems[item]); /*  Add User Item to SwapList */
								swapItemList.push(getItem("item" + req.session.currentProfile.userItems[item].swapItem)); /*  Add Swapped Item for current user Item*/
								/* Dispatch to mySwaps for user to take action - accept/reject/withdraw */
								res.render('mySwaps', {
									welcome: 'Welcome ' + req.session.theUser.firstName + '!',
									swapList,
									swapItemList,
									sessionStatus: true, /* user logged in or logged out*/
									name: req.session.theUser.firstName, /* user name*/
									itemStatus: req.session.currentProfile.userItems[item].status /* item status*/
								});
							} else if(req.session.currentProfile.userItems[item].status === 'available') { /* add the UserItem object to the request as "userItem" dispatch to the individual item view*/
								/* Current placeholder for this stage of implementation we have choose the user item to display on the individual item view {We could choose swap item} */
								userItemList = getItem("item" + req.session.currentProfile.userItems[item].item.code);
								/* Dispatch to individual item view */
								res.render('item', {
									welcome: 'Welcome ' + req.session.theUser.firstName + '!',
									item: userItemList,
									sessionStatus: true,
									itemStatus: 'available' /* different message to user based on status*/
								});
							} else if(req.session.currentProfile.userItems[item].status === 'swapped') {
								userItemList = getItem("item" + req.session.currentProfile.userItems[item].item.code);
								/* Dispatch to individual item view */
								res.render('item', {
									welcome: 'Welcome ' + req.session.theUser.firstName + '!',
									item: userItemList,
									sessionStatus: true,
									itemStatus: 'swapped' /* different message to user based on status*/
								});
							}
						} else {
							/* If valid itemCode does not exist in the user Profile disptach to the profile view  */
						}
					});
					
				} else { 
					/* If the item does not validate or does not exist in the user Profile disptach to the profile view */
					/* TODO: if this is a new user and no items are added to their profile this page should be empty (display a message indicating there are no items to display */
					/* Current situation : User is sign out, also TODO: check if session is cleared */
					res.render('myItems', {
						welcome: 'Not signed in',
						itemMsg : true,
						sessionStatus: false
					});
				}
		} else if(actions.includes(req.params.action) && req.params.action === "accept" || req.params.action === "reject" || req.params.action === "withdraw") {
				/* if the action is accept/reject/withdraw */
				if(req.params !== undefined && req.params.theItem === "1" || req.params.theItem === "2" || 
					req.params.theItem === "3" || req.params.theItem === "4" || req.params.theItem === "5" || req.params.theItem === "6" ) { /* check for a parameter called "theItem and validate that its value matches our item code format and is a valid current item code" */
					/* TODO: validate that this request was an intentional user action
						- check that it originated from a view that displayed this item as a candidate for an accept, reject or withdraw and all items displayed are valid current items and that they belong to this user */
					Object.keys(req.session.currentProfile.userItems).forEach((item) => {
						if(req.session.currentProfile.userItems[item].item.code === req.params.theItem) {
							/* if the item validates and exists in the user profile and the status is pending (the pending status indicates that this item has a swap offer), get the user object saved in the user profile */
							if(req.session.currentProfile.userItems[item].status === 'pending') {
								/* if action is reject or withdraw => reset the status value to indicate that this item is available for swap and clear the value for the swap status property */
								if(req.params.action === 'reject' || req.params.action === 'withdraw'){
				                  req.session.currentProfile.userItems[item].status = 'available';
				                  req.session.currentProfile.userItems[item].swapItem = 0;
				                  req.session.currentProfile.userItems[item].swapItemRating = 0;
				                  req.session.currentProfile.userItems[item].swapperRating = 0;
				                  /* Add the updated profile to the session object as "sessionProfile" and dispatch to the user profile view */
				                  /* Current situation we do not update the database, so we have sessionProfile */
				                  req.session.sessionProfile = req.session.currentProfile;
				                  res.render('myItems',{
				                  	welcome: 'Welcome ' + req.session.theUser.firstName + '!',
									itemMsg : true,
				                  	userItemList:req.session.sessionProfile.userItems,
				                  	sessionStatus: true,
				                  });
				                } else if(req.params.action === 'accept'){
				                /* if the action is accept, set the status value to indicate that this item was swapped */
				                  req.session.currentProfile.userItems[item].status = 'swapped';
				                  res.render('myItems',{
				                  	welcome: 'Welcome ' + req.session.theUser.firstName + '!',
									itemMsg : true,
				                  	userItemList:req.session.currentProfile.userItems,
				                  	sessionStatus: true
				                  });
				                }
				            }
						} else {
							/* check if no pending status object */
						}
					});
					
				} else {
					res.render('myItems', {
						welcome: 'Not signed in',
						itemMsg : true,
						sessionStatus: false
					});
				}
		} else if(actions.includes(req.params.action) && req.params.action === "delete") {
			/* if the action is delete */
				if(req.params !== undefined && req.params.theItem === "1" || req.params.theItem === "2" || 
					req.params.theItem === "3" || req.params.theItem === "4" || req.params.theItem === "5" || req.params.theItem === "6" ) { /* check for a parameter called "theItem and validate that its value matches our item code format and is a valid current item code" */
					/* TODO: validate that this request was an intentional user action
						- check that it originated from a view that displayed this item as a candidate for a delete and all items displayed are valid current items and that they belong to this user */
					Object.keys(req.session.currentProfile.userItems).forEach((item) => {
						if(req.session.currentProfile.userItems[item].item.code === req.params.theItem) {
							if(req.params.action === 'delete'){
			                  Object.keys(req.session.currentProfile.userItems).forEach((item, index) => {
			                  	if(req.session.currentProfile.userItems[item].item.code == req.params.theItem) {
			                  		/* If item validates and exists in the user, remove this item from the userProfile */
			                  		req.session.currentProfile.userItems.splice(item, 1);
			                  		req.session.sessionProfile = req.session.currentProfile;
			                  		/* Add the updated profile to the session object as "sessionProfile" and dispatch to the user profile view */
				                  	/* Current situation we do not update the database, so we have sessionProfile */
			                  		 res.render('myItems', {
					                  	welcome: 'Welcome ' + req.session.theUser.firstName + '!',
										itemMsg : true,
					                  	userItemList:req.session.sessionProfile.userItems,
					                  	sessionStatus: true
					                });
			                  	}
			                  });
			                } else {
			                	/* If the item does not validate or does not exist in the user Profile disptach to the profile view */
								/* TODO: if this is a new user and no items are added to their profile this page should be empty (display a message indicating there are no items to display */
								/* Current situation : User is sign out, also TODO: check if session is cleared */
			                	res.render('myItems', {
									welcome: 'Not signed in',
									itemMsg : true,
									sessionStatus: false
								});
			                } 
						}
					});
					
				} else { 
					/* If the item does not validate or does not exist in the user Profile disptach to the profile view */
					/* TODO: if this is a new user and no items are added to their profile this page should be empty (display a message indicating there are no items to display */
					/* Current situation : User is sign out, also TODO: check if session is cleared */
					res.render('myItems', {
						welcome: 'Not signed in',
						itemMsg : true,
						sessionStatus: false
					});
				}
		} else if(actions.includes(req.params.action) && req.params.action === "offer") {
			/* if the action is offer */
				var availableList = []; /* Available items for swapping */
				if(req.params !== undefined && req.params.theItem === "1" || req.params.theItem === "2" || 
					req.params.theItem === "3" || req.params.theItem === "4" || req.params.theItem === "5" || req.params.theItem === "6" ) { /* check for a parameter called "theItem and validate that its value matches our item code format and is a valid current item code" */
					/* TODO: validate that this request was an intentional user action
						- check that it originated from a view that displayed this item as a candidate for a delete and all items displayed are valid current items and that they belong to this user */
					Object.keys(req.session.currentProfile.userItems).forEach((item) => {
						// if(req.session.currentProfile.userItems[item].item.code === req.params.theItem) {
							if(req.session.currentProfile.userItems[item].status === 'available') {
								/* Available items for swapping */
								availableList.push(req.session.currentProfile.userItems[item]);
						//	}
						}
					});
					if(availableList.length > 0) {
						/* If there are available items, add all the available items to the request and dispatch to the swap item view (swap.ejs) */
						res.render('swap', {
							welcome: 'Welcome ' + req.session.theUser.firstName + '!',
							availableList,
							flag: true,
							sessionStatus: true,
							item: getItem("item" + req.params.theItem)
						});
					} else { /* If NO Available items for swapping, add a message requesting to add more items to start swapping again */
							 /* TODO: dispatch back to the individual item view displaying the message and the item */
						res.render('swap', {
							message: '    Sorry, you do not have any available items for swapping. Please add more items to start swapping again!',
							welcome: 'Welcome ' + req.session.theUser.firstName + '!',
							flag: false,
							sessionStatus: true,
							item: getItem("item" + req.params.theItem)
						});
					}
				} else {
					/* If the item does not validate or does not exist in the user Profile disptach to the profile view */
					/* TODO: if this is a new user and no items are added to their profile this page should be empty (display a message indicating there are no items to display */
					/* Current situation : User is sign out, also TODO: check if session is cleared */
					res.render('myItems', {
						welcome: 'Not signed in',
						itemMsg : true,
						sessionStatus: false
					});
				}
		}  else {
			/* If the item does not validate or does not exist in the user profile disptach to the profile view */
			/* TODO: if this is a new user and no items are added to their profile this page should be empty (display a message indicating there are no items to display */
			res.render('myItems', {
				welcome: 'Welcome ' + req.session.theUser.firstName + '!',
				itemMsg : true,
				userItemList: req.session.currentProfile.userItems,
				sessionStatus: true
			});
		}
	} else {
		/* If there is no action parameter or if it has an unknown value, dispatch to the profile view */
		/* Clear the session and send to home page */
		req.session.theUser = undefined;
		req.session.currentProfile = undefined;
		req.session.sessionProfile = undefined;
		res.render('index', {
			welcome: 'Not signed in.',
			sessionStatus: false
		});
	}
});
module.exports = app;	