function deepClone(obj) {
    // WeakMap的键必须是对象，且为弱引用
    // 这意味着如果没有任何其他强引用指向键对象，则垃圾回收器会在下次运行时回收该键对象，即使它还在WeakMap中
    // 使用WeakMap避免了obj=null时，map中的obj无法回收，造成内存泄漏
    const map = new WeakMap();
    function _deepClone(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        if (map.has(obj)) {
            return map.get(obj);
        }
        let newObj = Array.isArray(obj) ? [] : {};
        map.set(obj, newObj);
        for (let key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                // 递归
                newObj[key] = _deepClone(obj[key]);
            }
        }
        return newObj;
    }
    return _deepClone(obj);
}

let obj = {
    name: 'songyx',
    hobby: ['骑车', '打游戏', '健身'],
};
// 制造循环引用
obj.sub = obj;
obj.hobby.push(obj);
let newObj = deepClone(obj);
// 均为true
console.log(obj.hobby !== newObj.hobby);
console.log(obj.sub !== newObj.sub);
console.log(newObj.hobby[3] !== obj);