class offerDB {
	constructor(offerId, userId, swapUserId, userItemCode, swapUserItemCode, status, swapperRating) {
		this.offerId = offerId	,
		this.userId = userId,
		this.swapUserId = swapUserId,
		this.userItemCode = userItemCode,
		this.swapUserItemCode = swapUserItemCode,
		this.status = status,
		this.swapperRating = swapperRating
	}
}
/* Require Mongoose Library */
var mongoose = require('mongoose');	
var Offer = mongoose.model('offers', {
	offerId: {
		type: String,
        required: true,
        minlength: 1
	},
	userId: {
		type: String,
        required: true,
        minlength: 1
	},
	swapUserId: {
		type: String,
        required: true,
        minlength: 1
	},
	userItemCode: {
		type: String,
        required: true,
        trim: true,
        minlength: 1
	},
	swapUserItemCode: {
		type: String,
        required: true,
        trim: true,
        minlength: 1
	},
	status: {
		type: String,
        required: true,
        trim: true,
        minlength: 1
	},
	swapperRating: {
		type: String,
        required: true,
        trim: true,
        minlength: 1
	}
});

module.exports = {
    Offer
}

/* Add offer */
module.exports.addOffer = (userId, swapUserId, userItemCode, swapUserItemCode, status, swapperRating) => {
	Offer.countDocuments({}, (err, count) => {
		var offer = new offerDB(count + 1, userId, swapUserId, userItemCode, swapUserItemCode, status, swapperRating);
		var offerItem = new Offer(offer);
		offerItem.save((err) => {
			if(err) throw err;
		})
	});
}

/* Update offer */
module.exports.updateOffer = (userId, swapUserItemCode, action) => {
	try {
		Offer.findOneAndUpdate({userId, swapUserItemCode, status: "pending"}, {$set: {status: action}}, {$new: true}, (err, doc) => {
			if(err) throw err;
		});
	} catch(e) {
		
	}
}

/* Swap Update offer */
module.exports.swapUpdateOffer = (swapUserId, userItemCode, action) => {
	try {
		Offer.findOneAndUpdate({swapUserId, userItemCode, status: "pending"}, {$set: {status: action}}, {$new: true}, (err, doc) => {
			if(err) throw err;
		});
	} catch(e) {
		
	}
}

/* Withdraw Update offer */
module.exports.withdrawUpdateOffer = (userId, userItemCode, action) => {
	try {
		Offer.findOneAndUpdate({userId, userItemCode, status: "pending"}, {$set: {status: action}}, {$new: true}, (err, doc) => {
			if(err) throw err;
		});
	} catch(e) {
		
	}
}

/* Get Pending Offer Id for swapUserItemCode */
module.exports.getPendingOfferSwapUserItemCode = (userId, userItemCode) => {
	try {
		return Offer.findOne({userId, userItemCode, status: "pending"});
	} catch(e) {

	}
}
/* Get Pending Offer Id for userItemCode */
module.exports.getPendingOfferUserItemCode = (swapUserId, swapUserItemCode) => {
	try {
		return Offer.findOne({swapUserId, swapUserItemCode, status: "pending"});
	} catch(e) {

	}
}

/* Reject Offer */
module.exports.rejectOffer = (swapUserId, userItemCode) => {
	try {
		return Offer.findOne({swapUserId, userItemCode, status: "pending"});
	} catch(e) {

	}
}

/* Reject Offer */
module.exports.swapRejectOffer = (userId, swapUserItemCode) => {
	try {
		return Offer.findOne({userId, swapUserItemCode, status: "pending"});
	} catch(e) {

	}
}

/* Withdraw Offer */
module.exports.withdrawOffer = (userId, userItemCode) => {
	try {
		return Offer.findOne({userId, userItemCode, status: "pending"});
	} catch(e) {

	}
}


module.exports.acceptOffer = (swapUserId, userItemCode) => {
	try {
		return Offer.findOneAndUpdate({swapUserId, userItemCode, status: "pending"}, {$set: {status: "accepted"}}, {$new : true});
	} catch(e) {

	}
}

module.exports.getPendingOffers = () => {
	try {
		return Offer.find({status: "pending"});
	} catch(e) {

	}
}

module.exports.getCountOfPending = () => {
	try {
		return Offer.find({status: "pending"}).countDocuments();
	} catch(e) {

	}
}

/* Get Offer Id for swapUserItemCode */
// module.exports.getOffer = (userId, userItemCode) => {
// 	try {
// 		return Offer.findOne({userId, userItemCode);
// 	} catch(e) {

// 	}
// }