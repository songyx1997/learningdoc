// 使用双指针法，但是实现的效果类似于滑动窗口
// 关键是：双指针一开始都在0的位置，并思考好start和end自增的条件都是什么
// end自增的条件很简单，只要窗口内的数值和比target小，那就自增
// 当窗口内元素和比target小，我们需要自增start，让窗口变小！！

// 对于数组[2, 3, 1, 2, 4, 3]，窗口内的元素依次为
// [2]
// [2, 3]
// [2, 3, 1]
// [2, 3, 1, 2]
// [3, 1, 2]
// [3, 1, 2, 4]
// [1, 2, 4]
// [2, 4]
// [2, 4, 3]
// [4, 3]

const minSubArrayLen = function (target, nums) {
    let start = 0;
    let sum = 0;
    let size = 0;
    for (let end = 0; end <= nums.length;) {
        if (sum >= target) {
            sum -= nums[start];
            if (size === 0) {
                size = end - start;
            } else {
                size = Math.min(size, end - start);
            }
            start++;
        } else {
            if (end === nums.length) {
                break;
            }
            sum += nums[end];
            end++;
        }
    }
    return size;
};

console.log(minSubArrayLen(7, [2, 3, 1, 2, 4, 3]));