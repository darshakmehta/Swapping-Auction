const item1 = {
	code: '1', 
	name: 'Lord of the Rings',
	category: 'Movies', 
	description: 'The Lord of the Rings is a film series consisting of three high fantasy adventure films directed by Peter Jackson. They are based on the novel The Lord of the Rings by J. R. R. Tolkien. The films are subtitled The Fellowship of the Ring (2001), The Two Towers (2002) and The Return of the King (2003). They are a New Zealand-American venture produced by WingNut Films and The Saul Zaentz Company and distributed by New Line Cinema.', 
	rating: 4,
	image_url: '../resources/images/item1.png'
};

const item2 = {
	code: '2', 
	name: 'Game of Thrones',
	category: 'Movies', 
	description: 'George R.R. Martins best-selling book series `A Song of Ice and Fire is brought to the screen as HBO sinks its considerable storytelling teeth into the medieval fantasy epic. Its the depiction of two powerful families - kings and queens, knights and renegades, liars and honest men - playing a deadly game for control of the Seven Kingdoms of Westeros, and to sit atop the Iron Throne. Martin is credited as a co-executive producer and one of the writers for the series, which was filmed in Northern Ireland and Malta.', 
	rating: 4,
	image_url: '/resources/images/item2.png'
};

const item3 = {
	code: '3', 
	name: 'Hobbit',
	category: 'Movies', 
	description: 'The Hobbit is a film series consisting of three high fantasy adventure films directed by Peter Jackson. They are based on the 1937 novel The Hobbit by J. R. R', 
	rating: 4.5,
	image_url: '/resources/images/item3.png'
};

const item4 = {
	code: '4', 
	name: 'Car',
	category: 'Vehicle', 
	description: 'A car is a wheeled motor vehicle used for transportation. Most definitions of car say they run primarily on roads, seat one to eight people, have four tires, and mainly transport people rather than goods. Cars came into global use during the 20th century, and developed economies depend on them.', 
	rating: 4,
	image_url: '/resources/images/item4.png'
};

const item5 = {
	code: '5', 
	name: 'Cycle',
	category: 'Vehicle', 
	description: 'A bicycle, also called a cycle or bike, is a human-powered or motor-powered, pedal-driven, single-track vehicle, having two wheels attached to a frame, one behind the other. A bicycle rider is called a cyclist, or bicyclist.', 
	rating: 4.3,
	image_url: '/resources/images/item5.png'
};

const item6 = {
	code: '6', 
	name: 'Motorcycle',
	category: 'Vehicle', 
	description: 'A motorcycle, often called a bike, motorbike, or cycle, is a two- or three-wheeled motor vehicle.[1] Motorcycle design varies greatly to suit a range of different purposes: long distance travel, commuting, cruising, sport including racing, and off-road riding. Motorcycling is riding a motorcycle and related social activity such as joining a motorcycle club and attending motorcycle rallies.', 
	rating: 4.9,
	image_url: '/resources/images/item6.png'
};

/* Function to get all items from the Database */
module.exports.getItems = () => {
	return {
		item1, item2, item3, item4, item5, item6
	}
}