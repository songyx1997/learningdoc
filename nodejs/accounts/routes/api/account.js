const express = require('express');
const accountModel = require('../../models/accountModel');
const router = express.Router();
const dayjs = require('dayjs');

router.get('/', (res, rsp) => {
    rsp.render('index');
})

/**
 * 获取全部
 */
router.get('/account', (res, rsp) => {
    // 倒序
    accountModel.find().sort({ date: -1 }).then((data) => {
        rsp.render('details', { 'details': data, 'dayjs': dayjs });
        // rsp.json({
        //     code: '0000',
        //     msg: '查询成功',
        //     data: data,
        // })
    }).catch((e) => {
        // rsp.json({
        //     code: '1001',
        //     msg: '查询失败',
        //     data: e,
        // })
    })
})

/**
 * 新增
 */
router.post('/account', (res, rsp) => {
    let params = { ...res.body, date: dayjs(res.body.date).toDate() };
    accountModel.create(params).then((data) => {
        rsp.render('success', { 'message': '新增成功' });
        // rsp.json({
        //     code: '0000',
        //     msg: '新增成功',
        //     data: data,
        // })
    }).catch((e) => {
        // rsp.json({
        //     code: '1002',
        //     msg: '新增失败',
        //     data: e,
        // })
    })
})

/**
 * 删除
 */
router.get('/deleteOne/:id', (res, rsp) => {
    let { id } = res.params;
    accountModel.deleteOne({ _id: id }).then((data) => {
        rsp.render('success', { 'message': '删除成功' });
        // rsp.json({
        //     code: '0000',
        //     msg: '删除成功',
        //     data: data,
        // })
    }).catch((e) => {
        // rsp.json({
        //     code: '1003',
        //     msg: '删除失败',
        //     data: null,
        // })
    })
})

/**
 * 获取单个
 */
// router.get('/account/:id', (res, rsp) => {
//     let { id } = res.params;
//     accountModel.findById(id).then((data) => {
//         rsp.json({
//             code: '0000',
//             msg: '查询成功',
//             data: data,
//         })
//     }).catch((e) => {
//         rsp.json({
//             code: '1001',
//             msg: '查询失败',
//             data: e,
//         })
//     })
// })

/**
 * 部分修改
 */
// router.patch('/account/:id', (res, rsp) => {
//     let { id } = res.params;
//     accountModel.updateOne({ _id: id }, res.body).then(() => {
//         accountModel.findById(id).then((data) => {
//             rsp.json({
//                 code: '0000',
//                 msg: '修改成功',
//                 data: data,
//             })
//         })
//     }).catch((e) => {
//         rsp.json({
//             code: '1004',
//             msg: '修改失败',
//             data: e,
//         })
//     })
// })

module.exports = router;