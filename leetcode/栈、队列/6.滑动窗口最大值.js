// 输入：nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3
// 输出：[3, 3, 5, 5, 6, 7]
// 解释：
// 滑动窗口的位置                最大值        单调队列
// --------------------         ------        -------
// [1  3  1]  2   0   5           3             [3,1]  
//  1 [3  1   2]  0   5           3             [3,2]  // 1.往队尾加入元素，若队尾的元素小于当前待加入元素，则弹出（保持队列的单调性）
//  1  3 [1   2   0]  5           2             [2,0]  // 2.窗口往右移动（窗口弹出3，这个值等于队列[3,2]的队头，队列弹出队头变成[2]）
//  1  3  1  [2   0   5]          5              [5]

// 该题目的思想是维护一个单调（递减）队列
// 从上面的单调队列可以看出，最大值就是队列的第一个元素

// 单调（递减）队列
class MyQueue {
    constructor() {
        this.arr = [];
    }
    push(el) {
        // 1.往队尾加入元素，若队尾的元素小于当前待加入元素，则弹出（保持队列的单调性）
        while (!this.empty() && el > this.back()) {
            this.arr.pop();
        }
        this.arr.push(el);
    }
    pop(el) {
        // 2.只有当窗口弹出的元素与队头元素相等时，才弹出
        if (!this.empty() && el === this.peek()) {
            this.arr.shift();
        }
    }
    peek() {
        return this.arr[0];
    }
    back() {
        return this.arr[this.arr.length - 1];
    }
    empty() {
        return this.arr.length === 0;
    }
}

const maxSlidingWindow = function (nums, k) {
    // 初始化单调队列
    const queue = new MyQueue();
    for (let i = 0; i < k; i++) {
        queue.push(nums[i]);
    }
    const result = [];
    result.push(queue.peek());
    for (let i = k; i < nums.length; i++) {
        // nums[i - k]为待出窗口的数据
        queue.pop(nums[i - k]);
        // nums[i]为待入队的元素
        queue.push(nums[i]);
        result.push(queue.peek());
    }
    return result;
};

console.log(maxSlidingWindow([1, 3, 1, 2, 0, 5], 3));