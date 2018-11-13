/* Represents a Feedback for Other User with whom user Swapped */
class FeedbackDBUser {
	constructor(offerId, userId, swapUserId, rating, feedback) {
		this.offerId = offerId,
		this.userId = userId,
		this.swapUserId = swapUserId,
		this.rating = rating,
		this.feedback = feedback
	}
}

/* Represents a Feedback for Item Swapped */
class FeedbackDBOffer {
	constructor(code, userId, rating, feedback) {
		this.code = code,
		this.userId = userId,
		this.rating = rating,
		this.feedback = feedback
	}
}

/* Require Mongoose Library */
var mongoose = require('mongoose');

/* Represents User Feedback for other user in MongoDB */
const FeedbackUser = mongoose.model('userfeedbacks', {
	offerId: {
		type: String, required: true
	},
	userId: {
		type: String, required: true
	},
	swapUserId: {
		type: String, required: true
	},
	rating: {
		type: String, required: true
	},
	feedback: {
		type: String, required: true
	}
});

/* Represents Item Feedback by other user in MongoDB */
const FeedbackItem = mongoose.model('itemfeedbacks', {
	code: {
		type: String, required: true
	},
	userId: {
		type: String, required: true
	},
	rating: {
		type: String, required: true
	},
	feedback: {
		type: String, required: true
	}
});

/* Add Feedback for the Item for Offer made to the user */
module.exports.addItemFeedback = (code, userId, rating, feedback) => {
	var offerFeedback = new FeedbackDBOffer(code, userId, rating, feedback);
	addOfferFeedbackByUser(offerFeedback);
}

/* Store Feedback for Offer By User in mongoose table */
var addOfferFeedbackByUser = (offerFeedback) => {
	FeedbackItem.save((err) => {
		if(err) throw err;
	})
}

/* Add Feedback for the Offer made to the user */
module.exports.addOfferFeedback = (offerId, userId, swapUserId, rating, feedback) => {
	var userFeedback = new FeedbackDBUser(offerId, userId, swapUserId, rating, feedback);
	addFeedbackForUser(userFeedback);
}

/* Store Feedback by userId to swapUserId (both have completed swap) in mongoose table */
var addFeedbackForUser = (userFeedback) => {
	FeedbackUser.save((err) => {
		if(err) throw err;
	})
}