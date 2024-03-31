function sum(b, c) {
    console.log(this.a + b + c);
}

// 创建并绑定一个新函数
let obj = { a: 1 };
// 这里的入参被当作b
const newSum = sum.bind(obj, 2);
// 这里的入参被当作c
console.log('原生bind');
newSum(3);

Function.prototype.myBind = function (obj) {
    // 收集非对象的入参
    let args1 = [...arguments].slice(1);
    // 缓存该函数自身
    let fn = this;
    // 返回值是新的函数
    return function () {
        // 该函数调用时也可以传参，继续收集
        let args2 = [...arguments];
        fn.apply(obj, [...args1, ...args2]);
    }
}

console.log('手写bind');
const myNewSum = sum.myBind(obj, 2);
myNewSum(3);