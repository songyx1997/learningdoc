const _completeDeepClone = (obj, hash = new WeakMap()) => {
    // 在此补全代码
    // 1.第一种情况obj为空
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    // 2.其他类型
    if (/^(Date|RegExp|Map|Set)$/i.test(obj.constructor.name)) {
        return new obj.constructor(obj);
    }
    // 3.function
    if (typeof obj === 'function') {
        return new Function('return ' + obj.toString())();
    }
    // 4.数组
    if (obj instanceof Array) {
        let newArr = [];
        for (let i = 0; i < obj.length; i++) {
            // 递归处理，避免循环引用
            newArr[i] = _completeDeepClone(obj[i]);
        }
        return newArr;
    }
    // 5.Object类型
    if (obj instanceof Object) {
        let newObj = {};
        for (let key in obj) {
            newObj[key] = _completeDeepClone(obj[key]);
        }
        return newObj;
    }
}