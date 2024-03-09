/* 
+-----+-----+-----+
|     |     |     |
+-----+-----+-----+
|     |     | ΔΔΔ |
+-----+-----+-----+
|     |     |     |
+-----+-----+-----+ */

/* i的含义: x轴坐标
j的含义: y轴坐标
dp[i][j]的含义: 从[0, 0]到达[i, j]有多少种路径(注意是路径数, 而不是步数) */

/* 到达[i, j]共有两种方式:
(1)从[i, j - 1]出发，向下走一步，但是路径数不变。
(2)从[i - 1, j]出发，向右走一步，但是路径数不变。
因此递推公式为: dp[i][j] = dp[i, j - 1] + dp[i - 1, j];
但是由于存在障碍, 递推公式变成了
dp[k][t] = dp[k - 1][t] * reverse(obs[k][t]) + dp[k][t - 1] * reverse(obs[k][t]); */

/* 初始化: dp[i][0] = dp[0][j] = 1;
但是由于存在障碍, 如dp[0][k]是障碍。
dp[0][0]~dp[0][k - 1]为1, dp[0][k]~dp[0][j]为0。 */

/* 遍历顺序:先从左至右,再从上到下
也可以:先从上到下,再从左至右 */
const uniquePathsWithObstacles = function (obs) {
    let i = obs.length;
    let j = obs[0].length;
    // 终点或起点有障碍，直接返回
    if (obs[0][0] || obs[i - 1][j - 1]) {
        return 0;
    }
    const dp = new Array(i).fill(0).map(() => new Array(j).fill(0));
    // 初始化
    for (let k = 0; k < j; k++) {
        if (obs[0][k] === 1) {
            break;
        } else {
            dp[0][k] = 1;
        }
    }
    for (let k = 0; k < i; k++) {
        if (obs[k][0] === 1) {
            break;
        } else {
            dp[k][0] = 1;
        }
    }
    // 流程处理
    for (let k = 1; k < i; k++) {
        for (let t = 1; t < j; t++) {
            dp[k][t] = dp[k - 1][t] * reverse(obs[k][t]) + dp[k][t - 1] * reverse(obs[k][t]);
        }
    }
    return dp[i - 1][j - 1];
};

// 将1转换为0，将0转换为1
function reverse(n) {
    return n === 1 ? 0 : 1;
}
console.log(uniquePathsWithObstacles([[0, 0, 0], [0, 1, 0], [0, 0, 0]]));