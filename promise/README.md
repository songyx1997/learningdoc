<table>
    <tr>
        <td>title：promise</td>
        <td>author：songyx</td>
        <td>date：2024/02/07</td>
    </tr>
</table>
#### 基本流程

##### PromiseState

 实例对象中的一个属性，包含以下三种情况：

1. `pending`未决定的
2. `resolved / fullfilled`成功 
3. `rejected`失败

一个`promise`对象**只能改变一次**，成功的结果数据一般称为`value`，失败的结果数据一般称为`reason`。

##### PromiseResult

实例对象中的另一个属性，保存着异步任务成功/失败的结果。

`resolve`和`reject`对`PromiseResult`进行赋值。

##### 流程图

<div style="margin:0 auto">
    <img src=".\promise的基本流程.png">
</div>

封装`fs`读取文件

```javascript
const fs = require('fs');
function myReadFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) {
                // 将PromiseState修改为rejected
                // 将PromiseResult赋值为err
                reject(err);
            } else {
                // 将PromiseState修改为resolved
                // 将PromiseResult赋值为data
                resolve(data);
            }
        })
    })
}
// 成功回调
let onResolved = (value) => {
    console.log(value.toString());
}
// 失败回调
let onRejected = (reason) => {
    console.log(reason);
}
myReadFile('./README.md').then(onResolved, onRejected);
```

`Node.js`中的`util.promisify`，可将`(err, value) => ...`风格的回调函数，返回`promise`的版本。

```javascript
const fs = require('fs');
const util = require('util');

let myReadFile = util.promisify(fs.readFile);
```

#### API

##### 构造函数

`new Promise((resolve, reject) => {})`，其中`(resolve, reject) => {}`被称为`executor`。

`executor`会在`Promise`内部**立即同步调用**，异步操作在`executor`中执行。

##### Promise.prototype.catch

`catch`只接收`onRejected`回调。

```javascript
myReadFile('./README.m').then(onResolved).catch(onRejected);
```

无论是`then`还是`catch`，返回都是一个新的`Promise`对象。

##### Promise.resolve

1. 传入参数为非`Promise`对象，则返回结果为成功`Promise`对象。
2. 传入参数为`Promise`对象，则返回结果取决于参数的结果。

##### Promise.reject

无论入参如何，返回结果都为失败`Promise`对象。

##### Promise.all

接收入参为`Promise`对象数组，执行结果类似于**且运算**。

<div style="margin:0 auto">
    <img src=".\promiseAll.png">
</div>

##### Promise.race

接收入参为`Promise`对象数组，执行结果取决于数组中最先执行结束的`Promise`对象的结果。

```javascript
let p1 = Promise.resolve(new Promise((resolve, reject) => {
    setTimeout(() => {
        reject('a')
    }, 1000);
}));
let p2 = Promise.resolve('b');
// 返回为成功的Promise对象
let p3 = Promise.race([p1, p2]);
```

#### 关键问题

`then`方法内的回调是异步执行的。

```javascript
<script>
    let p = new Promise((resolve, reject) => {
        resolve('yes');
        console.log(1);
    })
    p.then(value => {
        console.log(2);
    })
    console.log(3);
    // 输出结果为1、3、2
</script>
```
------
宏任务与微任务

`js`中可以把**异步任务**分为宏任务和微任务。宏任务由宿主（浏览器、`Node`）发起，比如：`script`代码块、`DOM`事件、`Ajax`、定时器。微任务由`js`引擎发起，比如`process.nextTick`、`Promise.then`、`Async/Await`、`Object.observe`。

`js`代码的执行顺序，首先执行`js`执行栈中的同步代码，然后借助**事件循环**，将微任务队列（先进先出）中的代码压入执行栈，之后执行宏任务队列。

```javascript
<script>
    console.log(1);
    setTimeout(function () {
        console.log(2);
    }, 0);
    const p = new Promise((resolve, reject) => {
        console.log(3);
        resolve(4);
        console.log(5);
    })
    p.then((value) => {
        console.log(value);
    })
    console.log(6);
    // 1、3、5、6、4、2
</script>
```

需要注意的是，**宏任务的优先级是高于微任务的，且每个宏任务执行完，都需要清空微任务队列**。所以上述代码中，`<script>`作为第一个宏任务，其执行结束，需要保证微任务队列中的`promise.then`执行完，再执行下一个宏任务`setTimeout`。

------
多个`then`方法，都会调用吗？

当`PromiseState`改变之后，都会调用。

```javascript
<script>
    const p = new Promise((resolve, reject) => {
        reject('ok');
    });
    p.then(null, (reason) => {
        console.log(reason)
    })
    p.catch((reason) => {
        alert(reason);
    })
</script>
```

------

改变`promise`状态与`then`方法谁先谁后？

1. 当`executor`中的代码为同步任务，先改变状态，后调用`then`。

2. 当`executor`中的代码为异步任务，先调用`then`，后改变状态。

上述两种方式中的任何一种，`then`内部的回调都是状态改变后执行的。区别只是，前者是状态改变后，`then`调用时立即执行，后者是先调用`then`，等待状态改变后，执行`then`内部的回调。

------

`then`的返回结果是什么？

返回结果为新的`Promise`对象，但该对象的`PromiseState`和`PromiseResult`，由内部回调函数的执行结果决定。

1. 内部回调抛出异常。（`PromiseState`为`rejected`、`PromiseResult`为异常的文本）
2. 内部回调无返回。（`PromiseState`为`resolved`、`PromiseResult`为`undefined`）
3. 内部回调返回非Promise对象。（`PromiseState`为`resolved`、`PromiseResult`为该对象）
4. 内部回调返回为Promise对象。（`PromiseState`和`PromiseResult`与该对象保持一致）

------

为什么可以实现链式调用？

因为`then`的返回结果为新的`Promise`对象。

------

异常穿透

`then`的链式调用后，在最后的位置指定失败的回调。

------

如何中断`Promise`链？

在`then`内部的回调函数中返回`pending`状态的`Promise`对象。

#### 自定义

```javascript
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
```

#### async与await

ES8的新特性

##### async

对函数添加该修饰符后，该函数的返回结果与`then`的返回结果一样。返回结果为新的`Promise`对象，但该对象的`PromiseState`和`PromiseResult`，由内部的执行结果决定。

##### await

1. 其右侧为`promise`对象，返回值为状态成功时的结果。若状态为失败，则需要通过`try-catch`进行处理。
2. 其右侧为非`promise`对象，返回值为该对象（很少使用）。