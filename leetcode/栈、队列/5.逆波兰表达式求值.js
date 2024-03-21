// 栈非常适合于做相邻字符的消除操作！！！

// 以["4", "13", "5", "/", "+"]为例
// 总体的规则是：遇到数字就入栈。遇到运算符，出栈两个数字进行运算，将运算结果重新压栈
// 最后栈内只剩一个数字，就是运算结果

// 注意这里没有使用eval()处理，比如eval('1+2')结果确实是3，但是eval('1--2')则会无法处理而报错。

const evalRPN = function (tokens) {
    const stack = [];
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (isNumber(token)) {
            stack.push(parseInt(token));
        } else {
            const num2 = stack.pop();
            const num1 = stack.pop();
            if (token === '+') {
                stack.push(num1 + num2);
            } else if (token === '-') {
                stack.push(num1 - num2);
            } else if (token === '*') {
                stack.push(num1 * num2);
            } else if (token === '/') {
                // 向零截断
                stack.push(num1 / num2 > 0 ? Math.floor(num1 / num2) : Math.ceil(num1 / num2));
            }
        }
    }
    return stack.pop();
};

const isNumber = function (token) {
    return !isNaN(parseInt(token));
};

console.log(evalRPN(["2", "1", "+", "3", "*"]));