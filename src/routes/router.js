const express = require('express');
const axios = require('axios');
const router = express.Router();
const { writeToLocalCache, readLoadCache, lastModifiedDate } = require('../fs');

router.get('/api/trending-service', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const endpoint = process.env.ENDPOINT;
  axios({
    method: 'GET',
    url: endpoint,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      res.send(JSON.stringify(response.data));
      const result = lastModifiedDate('localCache.json');
      console.log(result);

      writeToLocalCache(response.data, 'localCache.json');
    })
    .catch(error => {
      console.log(error);
      var callback = jsonData => {
        res.send(JSON.parse(jsonData));
      };
      readLoadCache('localCache.json', callback);
    });
});

router.get('/ping', (req, res) => {
  res.send('pong');
});
router.use('/', express.static('client'));

module.exports = router;
