class Queue {
    constructor() {
        // 使用数组来存储队列中的元素
        this.items = [];
    }

    // 添加元素到队尾
    enqueue(element) {
        this.items.push(element);
    }

    // 移除并返回队头元素
    dequeue() {
        if (this.isEmpty()) {
            throw new Error('Cannot dequeue from an empty queue.');
        }
        return this.items.shift();
    }

    // 查看但不移除队头元素
    front() {
        if (this.isEmpty()) {
            throw new Error('Queue is empty.');
        }
        return this.items[0];
    }

    // 判断队列是否为空
    isEmpty() {
        return this.items.length === 0;
    }

    // 获取队列的长度
    size() {
        return this.items.length;
    }

    // 清空队列
    clear() {
        this.items = [];
    }
}

module.exports = Queue;