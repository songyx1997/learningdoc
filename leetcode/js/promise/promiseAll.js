/* 手写Promise.all()方法，返回结果需要为4，10，16 */
funs = [
    () => new Promise(resolve => setTimeout(() => resolve(4), 50)),
    () => new Promise(resolve => setTimeout(() => resolve(10), 150)),
    () => new Promise(resolve => setTimeout(() => resolve(16), 100))
]
const promiseAll = function (funs) {
    let result = [];
    let count = 0;
    return new Promise((resolve, reject) => {
        for (let index = 0; index < funs.length; index++) {
            let fun = funs[index];
            fun().then((value) => {
                count++;
                result[funs.indexOf(fun)] = value;
                if (count === funs.length) {
                    resolve(result);
                }
            }).catch((reason) => {
                reject(reason);
            })
        }
    })
};
/* for循环是同步的，所以funs中的函数会同时开始执行。
举例中是计时器，当达到计时器的时间时，其回调会被加入宏任务队列。
funs中回调的执行顺序为4，16，10 */