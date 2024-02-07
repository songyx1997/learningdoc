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

#### 自定义Promise