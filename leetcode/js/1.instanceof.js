// A instanceof B
// 判断B的原型对象是否再A的原型链上
const myInstanceof = function (a, b) {
    while (a != null) {
        if (a === b.prototype) {
            return true;
        }
        a = a.__proto__;
    }
    return false;
}