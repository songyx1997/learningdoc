// 使用栈、引用的思想
const nestedTokens = function (tokens) {
    const nestedTokens = [];
    // 收集器
    let collector = nestedTokens;
    // 栈
    const sections = [];
    for (let token of tokens) {
        switch (token[0]) {
            case '#':
                collector.push(token);
                // 入栈
                sections.push(token);
                // 清空收集器，并将收集器放在当前token中
                collector = token[2] = [];
                break;
            case '/':
                // 出栈
                sections.pop();
                // 改变收集器为栈顶
                collector = sections.length > 0 ? sections[sections.length - 1][2] : nestedTokens;
                break;
            default:
                collector.push(token);
                break;
        }
    }
    return nestedTokens;
}

export default nestedTokens;