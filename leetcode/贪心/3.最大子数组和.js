// 给你一个整数数组 nums ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。
// 子数组是数组中的一个连续部分。

// 输入：nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
// 输出：6
// 解释：连续子数组[4, -1, 2, 1] 的和最大，为 6 。

// 1.贪心算法
// 局部最优：当计算和时，结果出现（负值），就从将计算的和舍弃（重置为0）
// -2, 1, -3, 4,-1, 2, 1,-5, 4
// -2, 1, -2, 4, 3, 5, 6, 1, 5

const maxSubArray = function (nums) {
    let max = nums[0];
    let sum = nums[0];
    for (let i = 1; i < nums.length; i++) {
        if (sum < 0) {
            // sum的取值将重新开始
            sum = nums[i];
        } else {
            sum += nums[i];
        }
        max = Math.max(max, sum);
    }
    return max;
};

// 2.动态规划
// dp[i]:以nums[i]为结尾的最大连续子数组的和。
// dp[0]=nums[0];
// dp[i]的值可以有两种情况
// 一、dp[i]=dp[i-1]+nums[i]
// 二、dp[i]=nums[i]（如果dp[i-1]为负值的情况）
// 递推公式:dp[i]=max(dp[i-1]+nums[i],nums[i]);

const maxSubArrayAno = function (nums) {
    let dp = [];
    dp[0] = nums[0];
    let max = dp[0];
    for (let i = 1; i < nums.length; i++) {
        dp[i] = Math.max(dp[i - 1] + nums[i], nums[i]);
        max = Math.max(max, dp[i]);
    }
    return max;
};

console.log(maxSubArrayAno([-2, 1, -3, 4, -1, 2, 1, -5, 4]));