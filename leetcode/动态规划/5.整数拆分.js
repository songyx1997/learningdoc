/* 10 = 3 + 3 + 4, 3 × 3 × 4 = 36 */

/* i的含义: 就是等待被拆分的整数
dp[i]的含义: 拆出的整数的最大乘积 */

/* 对i拆分有两种方式, 这里的巧妙之处是固定了拆分出的j
(1)拆分成两个, 乘积为j * (i - j)
(2)拆分成多个, 乘积为j * dp[i - j]
因此递推公式为: dp[i] = max(j * (i - j), j * dp[i - j]) */

/* 初始化: dp[0] = dp[1] = 0; dp[2] = 1; */

/* 遍历顺序:
从左至右
i从3开始遍历
j是从1到i */
const integerBreak = function (n) {
    const dp = [];
    dp[0] = 0;
    dp[1] = 0;
    dp[2] = 1;
    // 从i到n,给dp[i]赋值.因为0,1,2都已经有值了,因此从3开始
    for (let i = 3; i <= n; i++) {
        dp[i] = 0;
        // 当处理到一半时，就已经得出结果
        for (let j = 1; j <= i / 2; j++) {
            // 每一次遍历j都会得到dp[i]的值,最终需要的是最大值
            dp[i] = Math.max(j * (i - j), j * dp[i - j], dp[i]);
        }
    }
    return dp[n];
};
console.log(integerBreak(4));