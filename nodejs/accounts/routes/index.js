const express = require('express');
const accountModel = require('../models/accountModel');
const router = express.Router();
const dayjs = require('dayjs');

router.get('/', (res, rsp) => {
  rsp.render('index');
})

router.post('/add', (res, rsp) => {
  // 1.添加数据至数据库
  let params = { ...res.body, date: dayjs(res.body.date).toDate() };
  accountModel.create(params).then(() => {
    console.log('添加成功');
    rsp.render('details');
  }).catch((e) => {
    throw e;
  })
})

module.exports = router;
