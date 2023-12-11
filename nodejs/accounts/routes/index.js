const express = require('express');
const accountModel = require('../models/accountModel');
const router = express.Router();
const dayjs = require('dayjs');

router.get('/', (res, rsp) => {
  rsp.render('index');
})

router.post('/add', (res, rsp) => {
  let params = { ...res.body, date: dayjs(res.body.date).toDate() };
  accountModel.create(params).then(() => {
    rsp.render('success', { 'message': '新增成功' });
  }).catch((e) => {
    throw e;
  })
})

router.get('/details', (res, rsp) => {
  // 倒序
  accountModel.find().sort({ date: -1 }).then((data) => {
    rsp.render('details', { 'details': data, 'dayjs': dayjs });
  }).catch((e) => {
    throw e;
  })
})

router.get('/deleteOne/:id', (res, rsp) => {
  let { id } = res.params;
  accountModel.deleteOne({ _id: id }).then(() => {
    rsp.render('success', { 'message': '删除成功' });
  }).catch((e) => {
    throw e;
  })
})

module.exports = router;