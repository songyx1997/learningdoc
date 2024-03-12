// 对于a:{b:''}，通过data[a.b]是无法获取对应的属性值的，因此引入lookup函数
// keyName的格式为a、a.b、a.b.c等
const lookup = function (obj, keyName) {
    if (keyName) {
        let keys = keyName.split('.');
        // 可以使用递归，也可以使用临时变量存储
        let tmp = obj;
        for (let i = 0; i < keys.length; i++) {
            tmp = tmp[keys[i]];
        };
        return tmp;
    }
}

// 测试
let obj = {
    a: {
        b: {
            c: 'text'
        }
    }
}
console.log(lookup(obj, 'a.b.c'));

module.exports = lookup;