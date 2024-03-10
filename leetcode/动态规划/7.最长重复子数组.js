/* i的含义: 数组nums1的索引
j的含义: 数组nums2的索引
dp[i][j]的含义: 以nums[i - 1]为结尾的最长递增子序列的长度
为什么是i - 1, 这是因为数组nums1, nums2从0开始, 而遍历dp[i][j]时, i和j是从1开始 */

/* 递推公式为:
if (nums1[i - 1] === nums2[j - 1]) {
    dp[i][j] = dp[i - 1][j - 1] + 1;
} */

/* 初始化: dp[0][j] = dp[i][0] = 0; */

const findLength = function (nums1, nums2) {
    const dp = new Array(nums1.length + 1).fill(0).map(() => new Array(nums2.length + 1).fill(0));
    let max = 0;
    for (let i = 1; i <= nums1.length; i++) {
        for (let j = 1; j <= nums2.length; j++) {
            if (nums1[i - 1] === nums2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
                max = Math.max(dp[i][j], max);
            }
        }
    }
    return max;
};

console.log(findLength([1, 2, 3, 2, 1], [3, 2, 1, 4, 7]));