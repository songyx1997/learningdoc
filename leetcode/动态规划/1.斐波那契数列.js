/* i的含义: 第i个斐波那契数
dp[i]的含义: 第i个斐波那契数的值
递推公式: dp[i] = dp[i - 1] + dp[i - 2];
初始化: dp[0] = 0; dp[1] = 1;
遍历顺序：从左往右 */
const fib = function (n) {
    const dp = [];
    // 初始化
    dp[0] = 0;
    dp[1] = 1;
    const modulus = 1000000007;
    if (n <= 1) {
        return dp[n];
    } else {
        // 继续初始化
        for (let i = 2; i <= n; i++) {
            // 从左往右遍历
            dp[i] = dp[i - 1] + dp[i - 2];
            dp[i] = dp[i] % modulus;
        }
        return dp[n];
    }
}