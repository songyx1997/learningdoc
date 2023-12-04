const express = require('express');
const router = express.Router();
const { array } = require('../public/json/data.json')

router.get('/', (res, rsp) => {
  rsp.render('index');
})

router.post('/add', (res, rsp) => {
  rsp.render('details', { 'array': array });
})

module.exports = router;
