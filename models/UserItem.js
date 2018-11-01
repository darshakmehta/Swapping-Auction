/* Include JavaScript Object (Model) for all Items */
const model = require('../models/item');
let items = model.getItems(); //Function to export all items

/* return the Item with the specified itemId from the hardcoded database */
var getItem = (itemId) => {
	return items[itemId];
}

/***

UserItem {
Item - an item object that belongs to this user (this user is the one that offered/added this item)
Rating - this user's rating for their item
Status - this attribute indicates swap item status - available, pending (offer made), swapped (offer accepted)
Swap Item - This is the item swapped with this user item (an item that was offered for swapping by another user and was swapped with this user item). It stores the Item Code to map the item in the database
Swap Item Rating - This is the user's rating for the item swapped with this user item.
Swapper Rating - This is the user's rating for the other user that owns the items swapped with this user item.
}

Note:
if the user item status is available then there's no values for Swap Item, Swap Item Rating or Swapper Rating.
if the user item status is pending then Swap Item has a value but not the rating for the swap item and the swapper.
if the user item status is swapped then the user will be able to rate the swap item and the swapper(the other user). 

***/

/* Associates an item with a user and a swap */
class UserItem {
	constructor(item, rating, status, swapItem, swapItemRating, swapperRating, madeOffer) {
		this.item = item,
		this.rating = rating,
		this.status = status,
		this.swapItem = swapItem,
		this.swapItemRating = swapItemRating,
		this.swapperRating = swapperRating,
	}
}

const userItem1 = new UserItem(getItem("item1"), '4', 'available', 0, 0, 0);
const userItem2 = new UserItem(getItem("item3"), '4', 'pending', 6, 0, 0);
const userItem3 = new UserItem(getItem("item5"), '2', 'swapped', 2, 0, 0);

module.exports = {
	userItem1,
	userItem2,
	userItem3
}