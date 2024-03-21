// 定义 Stack 类
class Stack {
    constructor() {
        // 使用数组作为底层数据存储
        this.items = [];
    }

    // 入栈操作 - 将元素添加到栈顶
    push(element) {
        this.items.push(element);
    }

    // 出栈操作 - 移除并返回栈顶元素
    pop() {
        if (this.isEmpty()) {
            throw new Error("Cannot pop from an empty stack");
        }
        return this.items.pop();
    }

    // 查看栈顶元素但不移除
    peek() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[this.items.length - 1];
    }

    // 判断栈是否为空
    isEmpty() {
        return this.items.length === 0;
    }

    // 获取栈的长度
    length() {
        return this.items.length;
    }

    // 清空栈
    clear() {
        this.items = [];
    }
}

module.exports = Stack;