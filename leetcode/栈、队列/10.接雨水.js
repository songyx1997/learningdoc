class MyStack {
    constructor(nums) {
        this.nums = nums;
        this.sum = 0;
        // 单调栈
        this.stack = [];
    }
    peer() {
        return this.stack[this.stack.length - 1];
    }
    // 弹出当前栈顶后，若单调栈为空，说明不存在左侧元素，无法积水！
    // 如数组[0,1,2]
    empty() {
        return this.stack.length === 0;
    }
    push(index) {
        let right = this.nums[index];
        while (!this.empty() && right > this.nums[this.peer()]) {
            let cur = this.nums[this.pop()];
            if (!this.empty()) {
                let left = this.nums[this.peer()];
                let height = Math.min(left, right) - cur;
                let width = index - this.peer() - 1;
                this.sum += height * width;
            }
        }
        this.stack.push(index);
    }
    pop() {
        return this.stack.pop();
    }
}

const trap = function (nums) {
    let stack = new MyStack(nums);
    for (let i = 0; i < nums.length; i++) {
        stack.push(i);
    }
    return stack.sum;
};

console.log(trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]));;