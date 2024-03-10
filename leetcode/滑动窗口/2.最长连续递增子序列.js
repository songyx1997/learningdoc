/* 输入: nums = [1, 3, 5, 4, 7]
输出: 3
解释: 最长连续递增序列是[1, 3, 5], 长度为3
尽管[1, 3, 5, 7]也是升序的子序列, 但它不是连续的, 因为5和7在原数组里被4隔开 */

const findLengthOfLCIS = function (nums) {
    let window = [];
    let max = 0;
    for (let i = 0; i < nums.length; i++) {
        if (window.length === 0) {
            window.push(nums[i]);
        } else {
            if (window[window.length - 1] < nums[i]) {
                window.push(nums[i]);
            } else {
                window = [nums[i]];
            }
        }
        max = window.length > max ? window.length : max;
    }
    return max;
};

console.log(findLengthOfLCIS([1, 3, 5, 4, 7]));