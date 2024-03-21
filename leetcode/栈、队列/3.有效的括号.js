// 该题目是用栈解决的经典题目

// 括号不匹配的情况总共有三种
// ([{}]：有多余的左括号
// [{}])：有多余的右括号
// ([{]])：括号类型不匹配
// 处理的原则：碰到左括号，当作右括号入栈。碰到右括号，则与栈顶进行比对，若比对成功，则栈顶出栈。

// 栈非常适合于做相邻字符的消除操作！！！

const isValid = function (str) {
    let stack = [];
    let map = new Map();
    map.set('{', '}');
    map.set('[', ']');
    map.set('(', ')');
    for (let i = 0; i < str.length; i++) {
        if (map.has(str[i])) {
            // 遇到左括号，将右括号入栈
            stack.push(map.get(str[i]));
        } else {
            // 遇到右括号，则和栈顶比较
            if (stack.length === 0) {
                // 直接判定为：有多余的右括号
                return false;
            }
            if (str[i] === stack.pop()) {
                // 和栈顶相等，弹栈
            } else {
                // 判定为：括号类型不匹配
                return false;
            }
        }
    }
    // 当字符串遍历完毕，但是栈内还存在括号，则判定为：有多余的左括号
    if (stack.length > 0) {
        return false;
    }
    return true;
};