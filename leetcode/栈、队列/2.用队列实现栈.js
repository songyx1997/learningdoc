const Queue = require('./queue');

// 用一个队列就可以实现栈，如队列[1,2,3]，依次将1、2出队列，然后再追加入队列，结果为[3,1,2]

// void push(int x) 将元素 x 压入栈顶。
// int pop() 移除并返回栈顶元素。
// int top() 返回栈顶元素。
// boolean empty() 如果栈是空的，返回 true ；否则，返回 false 。

class MyStack {
    constructor() {
        this.queue = new Queue();
    }

    push(x) {
        this.queue.enqueue(x);
    }

    pop() {
        let result;
        for (let i = 0; i < this.queue.size() - 1; i++) {
            let el = this.queue.dequeue();
            this.queue.enqueue(el);
        }
        if (this.queue.size() > 0) {
            result = this.queue.dequeue();
        }
        return result;
    }

    top() {
        let result;
        for (let i = 0; i < this.queue.size() - 1; i++) {
            let el = this.queue.dequeue();
            this.queue.enqueue(el);
        }
        if (this.queue.size() > 0) {
            result = this.queue.dequeue();
            this.queue.enqueue(result);
        }
        return result;
    }

    empty() {
        return this.queue.size() === 0;
    }
}