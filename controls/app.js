const express = require('express');

const app = express();
const model = require('../models/item');
let items = model.getItems();

var getItem = (itemId) => {
	return items[itemId];
}

app.set('views', '../views');
app.set('view engine', 'ejs');
app.use('/resources', express.static('../resources'));

app.get('/', (req, res) => {
	res.render('index', {
		welcome: 'Not signed in.'
	});
});

app.get('/home', (req, res) => {
	res.render('index', {
		welcome: 'Not signed in.'
	});
});

app.get('/categories', (req, res) => {
		res.render('categories', {
			welcome: 'Not signed in.',
		});
});

app.get('/subCategories', (req, res) => {
		if(req.query.catalogCategory === 'Movies' || req.query.catalogCategory === 'Vehicle') {
			res.render('subCategories', {
			welcome: 'Not signed in.',
			catalogCategory: req.query.catalogCategory,
			items
			});
		} else {
			res.render('categories', {
				welcome: 'Not signed in.'
			});
		}
});

app.get('/item', (req, res) => {
	if(Object.keys(req.query.length != 0)) {

		if(req.query.itemCode <= 6 && req.query.itemCode >= 1) {
			Object.keys(items).forEach((item, index) => {
				
				if(items[item]['code'] === req.query.itemCode) {
					res.render('item', {
						welcome: 'Welcome Darshak!',
						item: getItem(item)
					})
				} 
			});
		} else {
			res.render('categories', {
					welcome: 'Not signed in.'
				});
		}

	} else {
		res.render('categories', {
			welcome: 'Not signed in.'
		});
		
	}
});

app.get('/myItems', (req, res) => {
	res.render('myItems', {
		welcome: 'Welcome Darshak!'
	});
});

app.get('/contact', (req, res) => {
	res.render('contact', {
		welcome: 'Not signed in.'
	});
});

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

app.get('/mySwaps', (req, res) => {
	res.render('mySwaps', {
		welcome: 'Welcome Darshak!'
	});
});

app.get('/*', (req, res) => {
	res.send('Plain Message');
});

app.listen(8080, () => {
	console.log('App listening at port 8080');
});