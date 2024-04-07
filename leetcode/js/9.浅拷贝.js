function shallowCopy(obj) {
    if (obj === null || typeof obj !== 'object') {
        // 当对象为null或者不是Object类型时，直接返回
        return obj;
    }
    let newObj = Array.isArray(obj) ? [] : {};
    // for-in会遍历原型链上的属性
    for (let key in obj) {
        // object.hasOwnProperty(propertyName)
        // 当调用该方法时，它会检查给定的propertyName是否存在于object的实例属性中，而不是在其原型链上。
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            // 使用call调用原生方法，避免对象自身定义了hasOwnProperty方法，影响对属性的正确检查。
            newObj[key] = obj[key];
        }
    }
    return newObj;
}

let obj = [1, 2, 3, { a: 1, b: 2, c: { d: 4 } }];
let newObj = shallowCopy(obj);
obj[3].c.d = 777;
console.log(obj);
console.log(newObj);