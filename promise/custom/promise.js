class Promise {
    // 构造函数
    constructor(executor) {
        this.PromiseState = 'pending';
        this.PromiseResult = undefined;
        // 保存回调函数
        this.callBacks = [];
        // resolve函数
        let resolve = (value) => {
            // 5.保证状态只能修改一次
            if (this.PromiseState !== 'pending') {
                return;
            } else {
                // 3.修改状态和结果
                this.PromiseState = 'resolved';
                this.PromiseResult = value;
                // 7.等到状态改变后，再执行then中的回调
                // 8.当存在多个回调。状态改变时，都需要执行，需要使用数组
                // 12.then方法内的回调是异步执行的
                setTimeout(() => {
                    for (const iterator of this.callBacks) {
                        iterator.onResolved(value);
                    }
                });
            }
        }
        // reject函数
        let reject = (err) => {
            // 5.保证状态只能修改一次
            if (this.PromiseState !== 'pending') {
                return;
            } else {
                // 3.修改状态和结果
                this.PromiseState = 'rejected';
                this.PromiseResult = err;
                // 7.等到状态改变后，再执行then中的回调
                // 8.当存在多个回调。状态改变时，都需要执行，需要使用数组
                // 12.then方法内的回调是异步执行的
                setTimeout(() => {
                    for (const iterator of this.callBacks) {
                        iterator.onRejected(err);
                    }
                });
            }
        }
        // 2.执行器函数是同步调用的
        try {
            executor(resolve, reject);
        } catch (e) {
            // 4.通过throw抛出异常改变Promise状态
            reject(e);
        }
    }

    // 1.添加then方法
    // 为了使this指向实例对象，这里需要使用function(){}，而不是()=>{}。 
    then(onResolved, onRejected) {
        // 10.异常穿透。需初始化以供this.callBacks保存
        if (typeof onRejected !== 'function') {
            onRejected = (reason) => { throw reason };
        }
        // 11.值传递，当其中一个then，入参均为空时，为了将值往后传递，需初始化以供this.callBacks保存。
        if (typeof onResolved !== 'function') {
            onResolved = value => value;
        }
        return new Promise((resolve, reject) => {
            const _this = this;
            // 9.根据回调结果确定then的返回结果，then的返回结果为Promise对象
            function callback(type) {
                try {
                    let res = type(_this.PromiseResult);
                    if (res instanceof Promise) {
                        // 9.回调结果为Promise，PromiseState和PromiseResult与回调结果相一致
                        res.then(v => {
                            resolve(v);
                        }, j => {
                            reject(j);
                        });
                    } else {
                        // 9.回调结果非Promise，状态为成功，结果为返回值
                        resolve(res);
                    }
                } catch (e) {
                    reject(e);
                }
            }
            // 6.executor中（同步），先修改状态，后执行then，同时then中的回调立即执行
            // 由于then方法由Promise实例对象调用，因此this指向实例对象
            if (this.PromiseState === 'resolved') {
                // 12.then方法内的回调是异步执行的
                setTimeout(() => {
                    callback(onResolved);
                });
            }
            if (this.PromiseState === 'rejected') {
                // 12.then方法内的回调是异步执行的
                setTimeout(() => {
                    callback(onRejected);
                });
            }
            // 7.executor中（异步），先执行then（状态仍然为pending）
            if (this.PromiseState === 'pending') {
                // 7.等到状态改变后，再执行then中的回调
                // 这里需要保存回调，供上面使用
                // 8.当存在多个回调。状态改变时，都需要执行，需要使用数组
                this.callBacks.push({
                    onResolved: function () {
                        // 12.then方法内的回调是异步执行的
                        setTimeout(() => {
                            callback(onResolved)
                        });
                    },
                    onRejected: function () {
                        // 12.then方法内的回调是异步执行的
                        setTimeout(() => {
                            callback(onRejected)
                        });
                    },
                })
            }
        })
    }

    catch(onRejected) {
        return this.then(undefined, onRejected)
    }

    static resolve(value) {
        return new Promise((resolve, reject) => {
            if (value instanceof Promise) {
                value.then(v => {
                    resolve(v)
                }, j => {
                    reject(j)
                })
            } else {
                resolve(value);
            }
        })
    }

    static reject(value) {
        return new Promise((resolve, reject) => {
            reject(value);
        })
    }

    static all(array) {
        let count = 0;
        let result = [];
        return new Promise((resolve, reject) => {
            for (const iterator of array) {
                iterator.then(v => {
                    count++;
                    result.push(v);
                    if (count === array.length) {
                        resolve(result);
                    }
                }, j => {
                    reject(j)
                })
            }
        })
    }

    static race(array) {
        return new Promise((resolve, reject) => {
            for (const iterator of array) {
                // 最先执行完的，最先执行then中的回调
                iterator.then(v => {
                    resolve(v);
                }, j => {
                    reject(j)
                })
            }
        })
    }
}