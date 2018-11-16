/* Include HTTP */
const http = require('http');
/* Include Express */
const express = require('express');
/* Include Express Session */
const session = require('express-session');

/* Express App*/
const app = express();

/* Include JavaScript Object (Model) for UserProfile */
var UserProfile = require('../models/UserProfile');
/* Include JavaScript Object (Model) for UserItem */
var userItem = require('../models/UserItem');
/* Include UserDB Class */
var userDB = require('../models/UserDB');
/* Include Offer Class */
var offer = require('../models/offer');
/* Create JavaScript Object (Model) for UserProfile */
const profileOne = new UserProfile();

/* Render views from following directory*/
app.set('views', '../views');
/* Set View engine*/
app.set('view engine', 'ejs');
/* Use static resources from following directory*/
app.use('/resources', express.static('../resources'));
/* User Session - set a secret */
app.use(session({secret: "nbad"}));
/* actions array represents possible set of User Action */
var actions = ['accept', 'reject', 'update', 'withdraw', 'offer', 'delete', 'signout'];

app.get('/myItems', async (req, res) => {

	if(req.session.theUser === undefined) { /* Check the session for a current user, using the attribute "theUser" */
		/* Now user is the current placeholder for having the user go through all the steps of entering their details or logging in to their account */
		req.session.theUser = await userDB.getUser("1"); /*  add the User object to the current session as "theUser" */
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
			sessionStatus: false,
			name: 'Anonymous'
		});
	}
});

/* check http request for a parameter called "action" and "theItem" */
app.get('/myItems/:action/:theItem', async (req, res) => {
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
				var actionList = [];
				/* If the item validates and exists in the user profile, get the UserItem Object saved in the user profile for this current item and check the status value */
				var item = await userItem.getItem(req.params.theItem);
				if(item.status === 'pending') { /*  add the UserItem object to the request as "swapItem" and redirect to mySwaps view (to allow the user to accept/reject/withdraw)*/
					var swapList = []; /* List containing UserItems with pending status*/
					var swapItemList = []; /* List containing Swapped Item from database for current user item with status as pending*/
					var itemOffer = await offer.getOfferByUser(req.session.theUser.userId, req.params.theItem); /*  Add Swapped Item for current user Item*/
					if(itemOffer === null) {
						var itemOfferInner = await offer.getOfferByOtherUser(req.session.theUser.userId, req.params.theItem); /*  Add Swapped Item for current user Item*/
						swapList.push(await userItem.getItem(itemOfferInner.userItemCode));
						swapItemList.push(await userItem.getItem(itemOfferInner.swapUserItemCode)); /*  Add User Item to SwapList */
						actionList.push("accept");
					} else {
						swapList.push(await userItem.getItem(itemOffer.userItemCode)); /*  Add User Item to SwapList */
						swapItemList.push(await userItem.getItem(itemOffer.swapUserItemCode));
						actionList.push("withdraw")
					}
					/* Dispatch to mySwaps for user to take action - accept/reject/withdraw */
					res.render('mySwaps', {
						welcome: 'Welcome ' + req.session.theUser.firstName + '!',
						swapList,
						swapItemList,
						sessionStatus: true, /* user logged in or logged out*/
						name: req.session.theUser.firstName, /* user name*/
						itemStatus: 'pending', /* item status*/
						actionList
					});
				} else if(item.status === 'available') { /* add the UserItem object to the request as "userItem" dispatch to the individual item view*/
					/* Current placeholder for this stage of implementation we have choose the user item to display on the individual item view {We could choose swap item} */
					/* Dispatch to individual item view */
					res.render('item', {
						welcome: 'Welcome ' + req.session.theUser.firstName + '!',
						item,
						sessionStatus: true,
						itemStatus: 'available', /* different message to user based on status*/
						swapIt: "no"
					});
				} else if(item.status === 'swapped') {
					userItemList = await userItem.getItem(req.params.theItem);
					/* Dispatch to individual item view */
					res.render('item', {
						welcome: 'Welcome ' + req.session.theUser.firstName + '!',
						item: userItemList,
						sessionStatus: true,
						itemStatus: 'swapped' /* different message to user based on status*/
					});
				} else {
					/* If valid itemCode does not exist in the user Profile disptach to the profile view  */
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
		} else if(actions.includes(req.params.action) && req.params.action === "accept" || req.params.action === "reject" || req.params.action === "withdraw") {
				/* if the action is accept/reject/withdraw */
				if(req.params !== undefined && req.params.theItem === "1" || req.params.theItem === "2" || 
					req.params.theItem === "3" || req.params.theItem === "4" || req.params.theItem === "5" || req.params.theItem === "6" ) { /* check for a parameter called "theItem and validate that its value matches our item code format and is a valid current item code" */
					/* TODO: validate that this request was an intentional user action
						- check that it originated from a view that displayed this item as a candidate for an accept, reject or withdraw and all items displayed are valid current items and that they belong to this user */
					if(req.params.action === 'reject'){
	                  var offerItem = await offer.rejectOffer(req.session.theUser.userId, req.params.theItem);
	                  await offer.updateOffer(req.session.theUser.userId, req.params.theItem, req.params.action);
	                  await userItem.updateItemStatus(offerItem.swapUserItemCode, "available");
	                  await userItem.updateItemStatus(offerItem.userItemCode, "available");
		              req.session.currentProfile.userItems = await userItem.getAllItemsOfUser(req.session.theUser.userId);
	                  res.render('myItems',{
	                  	welcome: 'Welcome ' + req.session.theUser.firstName + '!',
						itemMsg : true,
	                  	userItemList:req.session.currentProfile.userItems,
	                  	sessionStatus: true,
	                  });
	                } else if (req.params.action === 'withdraw') {
	                	var offerItem = await offer.getOfferByUser(req.session.theUser.userId, req.params.theItem);                	
                	  	await offer.withdrawUpdateOffer(req.session.theUser.userId, req.params.theItem, req.params.action);
                	  	await userItem.updateItemStatus(offerItem.userItemCode, "available");
	                  	await userItem.updateItemStatus(offerItem.swapUserItemCode, "available");
	                	req.session.currentProfile.userItems = await userItem.getAllItemsOfUser(req.session.theUser.userId);
		                res.render('myItems',{
		                  	welcome: 'Welcome ' + req.session.theUser.firstName + '!',
							itemMsg : true,
		                  	userItemList:req.session.currentProfile.userItems,
		                  	sessionStatus: true,
		                });
	                } else if(req.params.action === 'accept'){
		                /* if the action is accept, set the status value to indicate that this item was swapped */
		                var offerItem = await offer.acceptOffer(req.session.theUser.userId, req.params.theItem);
			            await userItem.updateItemStatus(offerItem.userItemCode, "swapped");
			            await userItem.updateItemStatus(offerItem.swapUserItemCode, "swapped");
		                req.session.currentProfile.userItems = await userItem.getAllItemsOfUser(req.session.theUser.userId);
		                  res.render('myItems',{
		                  	welcome: 'Welcome ' + req.session.theUser.firstName + '!',
							itemMsg : true,
		                  	userItemList:req.session.currentProfile.userItems,
		                  	sessionStatus: true
		                });
	                }
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
				await userItem.deleteItem(req.params.theItem);
				req.session.currentProfile.userItems = await userItem.getAllItemsOfUser(req.session.theUser.userId);
				res.render('myItems', {
                  	welcome: 'Welcome ' + req.session.theUser.firstName + '!',
					itemMsg : true,
                  	userItemList:req.session.currentProfile.userItems,
                  	sessionStatus: true
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
			/* TODO: check from user Item ID and not 1,2,3,4,5,6 */ 
			if(req.params !== undefined && req.params.theItem === "1" || req.params.theItem === "2" || 
				req.params.theItem === "3" || req.params.theItem === "4" || req.params.theItem === "5" || req.params.theItem === "6" ) { /* check for a parameter called "theItem and validate that its value matches our item code format and is a valid current item code" */
				/* TODO: validate that this request was an intentional user action
					- check that it originated from a view that displayed this item as a candidate for a delete and all items displayed are valid current items and that they belong to this user */
				Object.keys(req.session.currentProfile.userItems).forEach((item) => {
					if(req.session.currentProfile.userItems[item].status === 'available') {
						/* Available items for swapping */
						availableList.push(req.session.currentProfile.userItems[item]);
					}
				});
				if(availableList.length > 0) {
					/* If there are available items, add all the available items to the request and dispatch to the swap item view (swap.ejs) */
					var item = await userItem.getItem(req.params.theItem);
					res.render('swap', {
						welcome: 'Welcome ' + req.session.theUser.firstName + '!',
						availableList,
						flag: true,
						sessionStatus: true,
						item
					});
				} else { /* If NO Available items for swapping, add a message requesting to add more items to start swapping again */
						 /* TODO: dispatch back to the individual item view displaying the message and the item */
					var item = await userItem.getItem(req.params.theItem);
					res.render('swap', {
						message: '    Sorry, you do not have any available items for swapping. Please add more items to start swapping again!',
						welcome: 'Welcome ' + req.session.theUser.firstName + '!',
						flag: false,
						sessionStatus: true,
						item
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
		res.render('index', {
			welcome: 'Not signed in.',
			sessionStatus: false,
			name: 'Anonymous'
		});
	}
});
module.exports = app;	