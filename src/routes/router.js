const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/api/trending-service', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const endpoint = process.env.ENDPOINT;
    axios({
        method: 'GET',
        url: endpoint,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      }).then(response => {
        res.send(JSON.stringify(response.data));
      }).catch(error => {
        res.status(400).send(JSON.stringify(error));
      });
});

router.get('/ping', (req, res) => {
    res.send('pong')
});
router.use('/', express.static('client'))

module.exports = router;
