// 输入：nums = [1,17,5,10,13,15,10,5,16,8]
// 输出：7
// 解释：这个序列包含几个长度为 7 摆动序列。
// 其中一个是 [1, 17, 10, 13, 10, 16, 8] ，各元素之间的差值为 (16, -7, 3, -3, 6, -8) 。

// 可以画出图形，发现摆动序列的最长子序列的长度就是波峰波谷的个数
// 局部最优：遍历时除去波峰波谷中间的元素

// 设计：不是真的去删除元素，而是计数的时候将其排除掉

// 通过栈来处理
class MyStack {
    constructor() {
        this.arr = [];
    }
    peek() {
        return this.arr[this.arr.length - 1];
    }
    pop() {
        return this.arr.pop();
    }
    push(el) {
        if (!this.empty()) {
            // 避免平坡的情况
            if (el !== this.peek()) {
                if (this.size() < 2) {
                    this.arr.push(el)
                } else {
                    let cur = this.pop();
                    let left = this.peek();
                    //    17         12     16
                    // 1      4          5
                    // 将cur、right压栈
                    if ((cur - left < 0 && cur - el < 0) || (cur - left > 0 && cur - el > 0)) {
                        this.arr.push(cur);
                        this.arr.push(el);
                    } else {
                        //         9
                        //     5
                        // 1
                        // 将cur出栈，将right压栈
                        this.arr.push(el);
                    }
                }
            }
        } else {
            this.arr.push(el);
        }
    }
    empty() {
        return this.arr.length === 0;
    }
    size() {
        return this.arr.length;
    }
}

const wiggleMaxLength = function (nums) {
    let stack = new MyStack();
    for (let i = 0; i < nums.length; i++) {
        stack.push(nums[i])
    }
    console.log(stack.arr);
    return stack.arr.length;
};

console.log(wiggleMaxLength([1, 17, 5, 10, 13, 15, 10, 5, 16, 8]));