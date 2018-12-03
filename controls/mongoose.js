const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/swapAuction');
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
module.exports = {
    mongoose
}