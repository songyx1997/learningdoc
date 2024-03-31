const request1 = () =>
    new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(1);
        }, 1000);
    });
const request2 = () =>
    new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(2);
        }, 500);
    });
const request3 = () =>
    new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(3);
        }, 300);
    });
const request4 = () =>
    new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(4);
        }, 400);
    });

// 实现一个 scheduler 函数，满足以下要求：

// 接收一个参数 max 控制最大并发请求量
// 执行以下代码依次输出：2、3、1、4
const addRequest = scheduler(2);
addRequest(request1).then(res => {
    console.log(res);
});
addRequest(request2).then(res => {
    console.log(res);
});
addRequest(request3).then(res => {
    console.log(res);
});
addRequest(request4).then(res => {
    console.log(res);
});

function scheduler(max) {
    // 存储全部请求
    const reqs = [];
    // 当前处理的请求的数目
    let current = 0;
    return function (request) {
        return new Promise((resolve, reject) => {
            // 存储resolve方法
            request.successFun = resolve;
            reqs.push(request);
            // 开始调用
            loop();
        });

        function loop() {
            while (current < max && reqs.length > 0) {
                // 取出执行
                let newReq = reqs.shift();
                current++;
                newReq().then((value) => {
                    // 执行成功时
                    current--;
                    newReq.successFun(value);
                    // 继续调用其他请求
                    loop();
                })
            }
        }
    }
}