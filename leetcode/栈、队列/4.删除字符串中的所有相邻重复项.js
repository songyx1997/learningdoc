// "abbaca" 中，我们可以删除 "bb" 由于两字母相邻且相同，这是此时唯一可以执行删除操作的重复项。
// 之后我们得到字符串 "aaca"，其中又只有 "aa" 可以执行重复项删除操作，所以最后的字符串为 "ca"。

// 使用栈，即可实现连续消消乐！！
// 栈非常适合于做相邻字符的消除操作！！！

const removeDuplicates = function (str) {
    let stack = [];
    for (let i = 0; i < str.length; i++) {
        if (peek(stack) === str[i]) {
            stack.pop();
        } else {
            stack.push(str[i]);
        }
    }
    return stack.join('');
};

const peek = function (arr) {
    if (arr.length > 0) {
        return arr[arr.length - 1];
    }
}

console.log(removeDuplicates('abbaca'));