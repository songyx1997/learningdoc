// 输入: nums = [1,2,1]
// 输出: [2,-1,2]
// 解释: 第一个 1 的下一个更大的数是 2；
// 数字 2 找不到下一个更大的数； 
// 第二个 1 的下一个最大的数需要循环搜索，结果也是 2。

// 数组是一个循环数组，最直观的思路是拼接数组，如拼接为[1, 2, 1, 1, 2, 1]，之后的处理借助于单调栈的模板
// 而取模的方式可以实现相同的效果，实际上解决成环问题，常常都是使用取模

class MyStack {
    constructor(nums) {
        this.nums = nums;
        // 单调栈
        this.stack = [];
        this.result = new Array(nums.length).fill(-1);
    }
    peek() {
        return this.stack[this.stack.length - 1];
    }
    // i为索引更为方便处理
    push(i) {
        while (!this.empty() && this.nums[i] > this.nums[this.peek()]) {
            let index = this.pop();
            this.result[index] = this.nums[i];
        }
        this.stack.push(i);
    }
    pop() {
        return this.stack.pop();
    }
    empty() {
        return this.stack.length === 0;
    }
}

const nextGreaterElements = function (nums) {
    const stack = new MyStack(nums);
    for (let i = 0; i < nums.length + nums.length; i++) {
        let j = i % nums.length;
        stack.push(j);
    }
    return stack.result;
};

console.log(nextGreaterElements([1, 2, 1]));