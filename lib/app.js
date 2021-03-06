const express = require('express');
const app = express();

app.use(express.json());

app.use('/api/v1/auctions', require('./routes/auctions'));
app.use('/api/v1/bids', require('./routes/bids'));
app.use('/api/v1/auth', require('./routes/auth'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
