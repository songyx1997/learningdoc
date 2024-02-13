const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.post('/server', urlencodedParser, (req, res) => {
    let { text } = req.body;
    // 解决跨域问题
    res.setHeader('Access-Control-Allow-Origin', '*');
    setTimeout(() => {
        res.json({
            code: 'AAAAAAA',
            msg: '上传成功',
            data: text,
        })
    }, 5000);
})

app.listen(10086);