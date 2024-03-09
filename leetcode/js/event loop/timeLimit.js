/* 请你编写一个函数，它接受一个异步函数 fn 和一个以毫秒为单位的时间 t。它应根据限时函数返回一个有 限时 效果的函数。函数 fn 接受提供给 限时 函数的参数。
限时 函数应遵循以下规则：
如果 fn 在 t 毫秒的时间限制内完成，限时 函数应返回结果。
如果 fn 的执行超过时间限制，限时 函数应拒绝并返回字符串 "Time Limit Exceeded" 。 */
var timeLimit = function (fn, t) {
    return async function (...args) {
        return new Promise(async (resolve, reject) => {
            const timeout = setTimeout(() => {
                reject("Time Limit Exceeded");
            }, t);
            try {
                const result = await fn(...args);
                resolve(result);
            } catch (err) {
                reject(err);
            }
            clearTimeout(timeout);
        });
    };
};
/* 1.await 关键字会导致阻塞，并等待Promise解决或拒绝。
并且当且仅当Promise解决或拒绝后，才会将回调添加至微任务队列，并执行后续同步代码！！！
2.若fn未在t内执行完，则其回调并未加入微任务队列！！
因此微任务队列此时已经为空，开始执行下一个宏任务，也就是setTimeout中的回调。 */