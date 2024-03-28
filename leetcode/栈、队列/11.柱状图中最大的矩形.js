// 核心思想，求矩形的宽和高
// 高就是当前柱子的高度
// 宽是（比当前柱子矮的左右柱子的间距）

// 为了简化难度，排除掉左边没有柱子、右边没有柱子的特殊情况，在数组的前后均加入0;

class MyStack {
    constructor(nums) {
        this.nums = nums;
        this.max = 0;
        // 单调栈
        this.stack = [];
    }
    peer() {
        return this.stack[this.stack.length - 1];
    }
    empty() {
        return this.stack.length === 0;
    }
    push(index) {
        let right = this.nums[index];
        while (!this.empty() && right < this.nums[this.peer()]) {
            let cur = this.nums[this.pop()];
            // 高就是当前柱子的高度
            let height = cur;
            if (!this.empty()) {
                let width = index - this.peer() - 1;
                this.max = Math.max(height * width, this.max);
            }
        }
        this.stack.push(index);
    }
    pop() {
        return this.stack.pop();
    }
}

const largestRectangleArea = function (nums) {
    nums = [0, ...nums, 0];
    let stack = new MyStack(nums);
    for (let i = 0; i < nums.length; i++) {
        stack.push(i);
    }
    return stack.max;
};

console.log(largestRectangleArea([2, 1, 5, 6, 2, 3]));