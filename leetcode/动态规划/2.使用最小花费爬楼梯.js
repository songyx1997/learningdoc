/* i的含义: 第i个台阶
dp[i]的含义: 到达第i个台阶所需的最小花费

到达第i个台阶共有两种方式:
(1)从第i - 1台阶起跳, 花费cost[i - 1]
(2)从第i - 2台阶起跳, 花费cost[i - 2]
因此递推公式为: dp[i] = min(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2])

初始化: dp[0] = 0; dp[1] = 0;
遍历顺序：从左往右 */
const minCostClimbingStairs = function (cost) {
    const dp = [];
    dp[0] = 0;
    dp[1] = 0;
    if (cost.length <= 1) {
        return 0;
    } else {
        for (let i = 2; i <= cost.length; i++) {
            dp[i] = Math.min(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2]);
        }
        return dp[cost.length];
    }
};

console.log(minCostClimbingStairs([10, 15, 20]));