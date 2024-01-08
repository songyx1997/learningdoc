const express = require('express');
const router = express.Router();

router.get('/', (res, rsp) => {
  rsp.setHeader('content-type', 'text/html;charset=utf-8');
  rsp.end('首页');
})

module.exports = router;