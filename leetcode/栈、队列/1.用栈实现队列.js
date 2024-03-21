// 用栈实现队列
const Stack = require('./stack');

// 实现 MyQueue 类
// void push(int x) 将元素 x 推到队列的末尾
// int pop() 从队列的开头移除并返回元素
// int peek() 返回队列开头的元素
// boolean empty() 如果队列为空，返回 true ；否则，返回 false

class MyQueue {
    constructor() {
        this.pushStack = new Stack();
        this.popStack = new Stack();
    }

    // 入队列操作就是入栈操作
    push(x) {
        this.pushStack.push(x);
    }

    // 出队列操作很不同，需要满足先进先出
    // 将pushStack除了栈底的数据全部弹出，并压入popStack
    pop() {
        while (this.pushStack.length > 0) {
            let el = this.pushStack.pop();
            this.popStack.push(el);
        }
        let result;
        if (!this.popStack.isEmpty()) {
            result = this.popStack.pop();
        }
        while (this.popStack.length > 0) {
            let el = this.popStack.pop();
            this.pushStack.push(el);
        }
        return result;
    }

    peek() {
        while (this.pushStack.length > 0) {
            let el = this.pushStack.pop();
            this.popStack.push(el);
        }
        let result;
        if (!this.popStack.isEmpty()) {
            result = this.popStack.peek();
        }
        while (this.popStack.length > 0) {
            let el = this.popStack.pop();
            this.pushStack.push(el);
        }
        return result;
    }

    empty() {
        return this.pushStack.length === 0;
    }
}