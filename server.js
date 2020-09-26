'use strict'

const express = require('express');

const app = express();

const router = express.Router();

const tree = require('./tree');

const port = process.env.PORT || 3000;

router.get('/tree', tree.main);

app.use(router);


app.listen(port, function() {
  console.log('Listening in port:', port);
});
