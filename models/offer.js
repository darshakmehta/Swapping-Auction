/* Represents a UserDB */
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
/* Offer Model to represent in MongoDB */
const Offer = mongoose.model('offers', {
	offerId: {
		type: String, required: true
	},
	userId: {
		type: String, required: true
	},
	swapUserId: {
		type: String, required: true
	},
	userItemCode: {
		type: String, required: true
	},
	swapUserItemCode: {
		type: String, required: true
	},
	status: {
		type: String, required: true
	},
	swapperRating: {
		type: String, required: true
	}
});

/* Add offer */
module.exports.addOffer = (userId, swapUserId, userItemCode, swapUserItemCode, status, swapperRating) => {
	Offer.countDocuments({}, (err, count) => {
		var offer = new offerDB(count + 1, userId, swapUserId, userItemCode, swapUserItemCode, status, swapperRating);
		var offerItem = new Offer(offer);
		/* Store offer in mongoose table */
		offerItem.save((err) => {
			if(err) throw err;
		})
	});
}

/* Update offer */
module.exports.updateOffer = (swapUserId, swapUserItemCode, action) => {
	try {
		Offer.findOneAndUpdate({swapUserId, swapUserItemCode, status: "pending"}, {$set: {status: action}}, {$new: true}, (err, doc) => {
			if(err) throw err;
		});
	} catch(e) {
		console.log(e);
	}
}

/* Withdraw Update offer */
module.exports.withdrawUpdateOffer = (userId, userItemCode, action) => {
	try {
		Offer.findOneAndUpdate({userId, userItemCode, status: "pending"}, {$set: {status: action}}, {$new: true}, (err, doc) => {
			if(err) throw err;
		});
	} catch(e) {
		console.log(e);
	}
}

/* Get Pending Offer by User */
module.exports.getOfferByUser = (userId, userItemCode) => {
	try {
		return Offer.findOne({userId, userItemCode, status: "pending"});
	} catch(e) {
		console.log(e);
	}
}
/* Get Pending Offer by Other User */
module.exports.getOfferByOtherUser = (swapUserId, swapUserItemCode) => {
	try {
		return Offer.findOne({swapUserId, swapUserItemCode, status: "pending"});
	} catch(e) {
		console.log(e);
	}
}

/* Reject Offer */
module.exports.rejectOffer = (swapUserId, swapUserItemCode) => {
	try {
		return Offer.findOne({swapUserId, swapUserItemCode, status: "pending"});
	} catch(e) {
		console.log(e);
	}
}

/* Accept Offer */
module.exports.acceptOffer = (swapUserId, swapUserItemCode) => {
	try {
		return Offer.findOneAndUpdate({swapUserId, swapUserItemCode, status: "pending"}, {$set: {status: "accepted"}}, {$new : true});
	} catch(e) {
		console.log(e);
	}
}

/* Get Pending Offers */
module.exports.getPendingOffers = async (userId) => {
	try {
		let arr = await Offer.find({userId, status: "pending"});
		let arr2 = await Offer.find({swapUserId: userId, status: "pending"});
		let newArr = arr.concat(arr2);
		return newArr;
		
	} catch(e) {
		console.log(e);
	}
}

/* Get Count of Pending Offers */
module.exports.getCountOfPending = async (userId) => {
	try {
		return await Offer.find({userId, status: "pending"}).countDocuments() 
				 + await Offer.find({swapUserId: userId, status: "pending"}).countDocuments();
	} catch(e) {
		console.log(e);
	}
}

/* Get Pending Offer to check for swap */
module.exports.getOfferForSwap = (userItemCode) => {
	try {
		return Offer.find({userItemCode, status: "pending"});
	} catch(e) {
		console.log(e);
	}
}