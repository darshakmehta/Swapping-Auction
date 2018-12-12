/* Represents a Feedback for Other User with whom user Swapped */
class FeedbackDBUser {
	constructor(feedbackId, offerId, userId, swapUserId, rating, feedback) {
		this.feedbackId = feedbackId;
		this.offerId = offerId,
		this.userId = userId,
		this.swapUserId = swapUserId,
		this.rating = rating,
		this.feedback = feedback
	}
}

/* Represents a Feedback for Item Swapped */
class FeedbackDBOffer {
	constructor(feedbackId, userId, itemCode, rating, feedback) {
		this.feedbackId = feedbackId;
		this.userId = userId,
		this.itemCode = itemCode,
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
	feedbackId: {
	 	type: String, required: true
	},
	userId: {
		type: String, required: true
	},
	itemCode: {
		type: String, required: true
	},
	rating: {
		type: String, required: true
	},
	feedback: {
		type: String, required: false
	}
});

/* Add Feedback for the Item for Offer made to the user */
module.exports.addItemFeedback = (userId, itemCode, rating, feedback) => {
	FeedbackItem.countDocuments().then((count) => {
		var offerFeedback = new FeedbackDBOffer(count + 1, userId, itemCode, rating, "");
		var newFeedback = new FeedbackItem(offerFeedback);
		addOfferFeedbackByUser(newFeedback);
	}, (err) => {
		res.status(400).send(err);
	});
}

/* Store Feedback for Offer By User in mongoose table */
var addOfferFeedbackByUser = (offerFeedback) => {
	offerFeedback.save((err) => {
		if(err) throw err;
	})
}

/* Get Item Feedback */
module.exports.getItemFeedback = (userId, itemCode) => {
	try {
		return FeedbackItem.findOne({userId, itemCode});
	} catch(e) {
		console.log(e);
	}
}

/* update Item Feedback */
module.exports.updateItemFeedback = (userId, itemCode, rating, feedback) => {
	try {
		FeedbackItem.findOneAndUpdate({userId, itemCode}, {$set: {rating}}, {$new: true}, (err, doc) => {
			if(err) throw err;
		});
	} catch(e) {
		console.log(e);	
	}
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

var getNumberOfFeedbackForItem = (itemCode) => {
	try {
		return FeedbackItem.find(itemCode).countDocuments();
	} catch(e) {
		console.log(e);	
	}
}

module.exports.getAverageRating = (itemCode) => {
	try {
		return FeedbackItem.aggregate([
	        { $match: {
	            itemCode
	        }},
	        { $group: {
	            _id: "$itemCode",
	            totalRating: { $sum: "$rating"  }
	        }}
	    ], function (err, result) {
	        if (err) {
	            console.log(err);
	            return;
	        }
	        console.log(result);
	    });
		} catch(e) {
			console.log(e);	
		}
}