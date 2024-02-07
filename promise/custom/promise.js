// 构造函数
function Promise(executor) {
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
            for (const iterator of this.callBacks) {
                iterator.onResolved(value);
            }
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
            for (const iterator of this.callBacks) {
                iterator.onRejected(err);
            }
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
const thenMethod = function (onResolved, onRejected) {
    // 6.executor中（同步），先修改状态，后执行then，同时then中的回调立即执行
    // 由于then方法由Promise实例对象调用，因此this指向实例对象
    if (this.PromiseState === 'resolved') {
        onResolved(this.PromiseResult);
    }
    if (this.PromiseState === 'rejected') {
        onRejected(this.PromiseResult);
    }
    // 7.executor中（异步），先执行then（状态仍然为pending）
    if (this.PromiseState === 'pending') {
        // 7.等到状态改变后，再执行then中的回调
        // 这里需要保存回调，供上面使用
        // 8.当存在多个回调。状态改变时，都需要执行，需要使用数组
        this.callBacks.push({
            onResolved,
            onRejected
        })
    }
};

Promise.prototype.then = thenMethod;

const catchMethod = function (onRejected) {
    this.then(null, onRejected)
}

Promise.prototype.catch = catchMethod;