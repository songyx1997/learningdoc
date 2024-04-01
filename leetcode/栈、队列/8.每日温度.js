// 单调栈常常用于寻找
// 当前元素左边或者右边，第一个比他大/小的元素

// 输入: temperatures = [30, 20, 50, 50]
// 输出: [2, 1, 0, 0]

// 本题目求的是比当前元素大的元素位置，因此应该使用单调（递增）栈

// 数组             单调栈
// 30               30
// 20               20 30
// 50               50
// 50               50 50

class MyStack {
    constructor(arr) {
        this.arr = arr;
        this.indices = [];
        this.result = new Array(arr.length).fill(0);
    }
    peek() {
        return this.indices[this.indices.length - 1];
    }
    push(i) {
        // 比栈顶元素大
        // 说明栈顶元素已经找到了匹配的结果，应当将栈顶出栈，将当前元素压栈
        while (this.arr[i] > this.arr[this.peek()]) {
            let index = this.indices.pop();
            this.result[index] = i - index;
        }
        this.indices.push(i);
    }
}

// 该题目输出为下标差，因此单调栈存放下标更为方便
const dailyTemperatures = function (temps) {
    const stack = new MyStack(temps);
    for (let t = 0; t < temps.length; t++) {
        stack.push(t);
    }
    return stack.result;
};

console.log(dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73]));