/* Include Express */
const express = require('express');
/* Express App*/
const app = express();

/* Include JavaScript Object (Model) for all Items */
const model = require('../models/item');
let items = model.getItems(); //Function to export all items

/* return the Item with the specified itemId from the hardcoded database */
var getItem = (itemId) => {
	return items[itemId];
}

/* Render views from following directory*/
app.set('views', '../views');
/* Set View engine*/
app.set('view engine', 'ejs');
/* Use static resources from following directory*/
app.use('/resources', express.static('../resources'));

/* GET Home Router */
app.get('/', (req, res) => {
	res.render('index', {
		welcome: 'Not signed in.'
	});
});

/* GET Home Router */
app.get('/home', (req, res) => {
	res.render('index', {
		welcome: 'Not signed in.'
	});
});


/* GET Categories Router - Use to display categories belonging to the Catalog */
app.get('/categories', (req, res) => {
		res.render('categories', {
			welcome: 'Not signed in.',
		});
});

/* GET Sub Categories Router - Use to display all sub categories of a choosen category */
app.get('/subCategories', (req, res) => {
		/* Check catalogCategory parameter exist and it is valid */
		if(req.query.catalogCategory === 'Movies' || req.query.catalogCategory === 'Vehicle') {
			/* Dispatch list of sub categories of type catalogCategory */
			res.render('subCategories', {
			welcome: 'Not signed in.',
			catalogCategory: req.query.catalogCategory,
			items
			});
		} else { //If invalid catalogCategory, dispatch catalog as if no category had been provided
			res.render('categories', {
				welcome: 'Not signed in.'
			});
		}
});

/* GET Item Router */
app.get('/item', (req, res) => {
	if(Object.keys(req.query.length != 0)) {
		/* Check the http request for a parameter called "itemCode" and validate it matches our format and it is valid */
		if(req.query.itemCode <= 6 && req.query.itemCode >= 1) {
			Object.keys(items).forEach((item, index) => {
				/* Valid Object should be added to the http response object */
				if(items[item]['code'] === req.query.itemCode) {
					/* Dispatch the individual item */
					res.render('item', {
						welcome: 'Welcome Darshak!',
						item: getItem(item)
					})
				} 
			});
		} else { //If item code is invalid, dispatch catalog as if no code had been provided
			res.render('categories', {
					welcome: 'Not signed in.'
				});
		}
	} else { //If no itemCode parameter is present, dispatch catalog
		res.render('categories', {
			welcome: 'Not signed in.'
		});
		
	}
});

/* Get My Items Router*/
app.get('/myItems', (req, res) => {
	res.render('myItems', {
		welcome: 'Welcome Darshak!'
	});
});

/* Get Contact Router*/
app.get('/contact', (req, res) => {
	res.render('contact', {
		welcome: 'Not signed in.'
	});
});

/* Get About Router*/
app.get('/about', (req, res) => {
	res.render('about', {
		welcome: 'Not signed in.'
	});
});

app.get('/swap', (req, res) => {
	res.render('swap', {
		welcome: 'Welcome Darshak!'
	});
});

/* Get My Swaps Router*/
app.get('/mySwaps', (req, res) => {
	res.render('mySwaps', {
		welcome: 'Welcome Darshak!'
	});
});

/* Get Any URL Router*/
app.get('/*', (req, res) => {
	res.send('Plain Message');
});

/* Listen Express app on Port 8080 */
app.listen(8080, () => {
	console.log('App listening at port 8080');
});