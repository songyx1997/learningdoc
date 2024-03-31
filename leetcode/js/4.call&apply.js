const obj = {
    val: '2024'
}
function testCall(a, b) {
    console.log(this.val);
    if (a && b) {
        console.log(a + b);
    }
}

// 大致思路
// 1.给obj添加一个属性
// const obj = {
//     val: '2024',
//     fn: testCall,
// }
// 2.调用
// obj.fn();
// 3.删除属性
// delete obj.fn;

// 函数调用myCall，因此是在Function的原型上添加方法
Function.prototype.myCall = function (obj) {
    // 1.添加属性{fn:testCall}
    obj.fn = this;
    // 2.获取其他入参
    let args = [...arguments].slice(1);
    // 3.调用
    obj.fn(...args);
    // 4.删除
    delete obj.fn;
}

console.log('原生call');
testCall.call(obj, 2, 3);
console.log('手写call');
testCall.myCall(obj, 2, 3);

// apply基本与call相同，除了入参方式存在差异
Function.prototype.myApply = function (obj) {
    // 1.添加属性{fn:testCall}
    obj.fn = this;
    // 2.获取其他入参
    let args = arguments[1];
    // 3.调用
    obj.fn(...args);
    // 4.删除
    delete obj.fn;
}

console.log('原生apply');
testCall.apply(obj, [2, 3]);
console.log('手写apply');
testCall.myApply(obj, [2, 3]);