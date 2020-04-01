const express = require('express');
require('dotenv').config();
const router = require('./routes/router');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(router);

app.listen(PORT, () => console.log('Express server is running'));
