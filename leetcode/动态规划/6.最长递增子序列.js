/* 输入：nums = [10, 9, 2, 5, 3, 7, 101, 18]
输出：4
解释：最长递增子序列是[2, 3, 7, 101]，因此长度为4。 */

/* i的含义: nums[i]的索引
dp[i]的含义: 以nums[i]为结尾的最长递增子序列的长度 */

/* j的范围是从[0, i), 每次遍历只要nums[j] < nums[i], 则dp[i] = dp[j] + 1
因此递推公式为dp[i] = max(dp[j] + 1, dp[i]) */

/* 初始化: dp[0] = 1; */

/* 遍历顺序:
从左至右
i从1开始遍历
j是从0到i */

const lengthOfLIS = function (nums) {
    const dp = [1];
    let max = 1;
    for (let i = 1; i < nums.length; i++) {
        dp[i] = 1;
        for (let j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                dp[i] = Math.max(dp[j] + 1, dp[i]);
            }
        }
        max = dp[i] > max ? dp[i] : max;
    }
    return max;
};

console.log(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18]));