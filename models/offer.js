class offerDB {
	constructor(offerId, userId, swapUserId, userItemCode, swapUserItemCode, status, swapperRating) {
		this.offerId = offerId	,
		this.userId = userId,
		this.swapUserId = swapUserId,
		this.userItemCode = userItemCode,
		this.swapUserItemCode = swapUserItemCode,
		this.status = status
		this.swapperRating = swapperRating,
	}
}
	
const Offer = mongoose.model('offers', {
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
	var count = Offer.find({}).count() + 1;
	var offer = new offerDB(count, userId, swapUserId, userItemCode, swapUserItemCode, status, swapperRating);
	Offer.save((err) => {
		if(err) throw err;
		res.send("Offer added successfully");
	})
}

/* Update offer */
module.exports.updateOffer = () => {
	try {
		Offer.findOneAndUpdate({code: code}, {$set: {}, {$new: true}, (err, doc) => {
			if(err) throw err;
		});
	} catch(e) {
		
	}
}