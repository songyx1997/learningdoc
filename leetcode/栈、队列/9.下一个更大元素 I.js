// 输入：nums1 = [4,1,2], nums2 = [1,3,4,2].
// 输出：[-1,3,-1]
// 解释：nums1 中每个值的下一个更大元素如下所述：
// - 4 ，用加粗斜体标识，nums2 = [1,3,4,2]。不存在下一个更大元素，所以答案是 -1 。
// - 1 ，用加粗斜体标识，nums2 = [1,3,4,2]。下一个更大元素是 3 。
// - 2 ，用加粗斜体标识，nums2 = [1,3,4,2]。不存在下一个更大元素，所以答案是 -1 。

class MyStack {
    constructor(nums1, nums2) {
        this.nums1 = nums1;
        this.nums2 = nums2;
        this.stack = [];
        this.result = new Array(nums1.length).fill(-1);
    }
    peek() {
        return this.stack[this.stack.length - 1];
    }
    push(el) {
        // 比栈顶元素大
        // 说明栈顶元素已经找到了匹配的结果，应当将栈顶出栈，将当前元素压栈
        while (el > this.peek()) {
            let value = this.stack.pop();
            let index = this.nums1.indexOf(value);
            if (index >= 0) {
                this.result[index] = el;
            }
        }
        this.stack.push(el);
    }
}

// 此题目和8.每日温度是差不多的，但是要明确两点
// 1.结果数组的大小和nums1一致
// 2.遍历nums2建立单调栈，当出栈时去找该元素在nums1中的位置
const nextGreaterElement = function (nums1, nums2) {
    let stack = new MyStack(nums1, nums2);
    for (let i = 0; i < nums2.length; i++) {
        stack.push(nums2[i]);
    }
    return stack.result;
};

console.log(nextGreaterElement([2, 4], [1, 2, 3, 4]));