// 输入：s = "aaa"
// 输出：6
// 解释：6个回文子串: "a", "a", "a", "aa", "aa", "aaa"

// dp[i][j]的含义: 如果从[i, j]的字符串是回文子串, 则为1, 否则为0

// 递推公式需要分类讨论, 前提是s[i] === s[j], 若二者不相等, 显然dp[i][j] === 0;
// 1.i === j或者j === i + 1, 也就是j <= i + 1, 显然dp[i][j]是回文子串
// 2.j > i + 1, 也就是[i, j]的字符串长度大于2, 如果dp[i + 1][j - 1]是回文子串, 则dp[i][j]是回文子串

// s       aaa       s
// i  dp[i+1][j-1]   j

// 遍历顺序: 确定二维数组的遍历顺序时, 不妨画图确认
// +------------+------------+
// |            |  dp[i][j]  |
// +------------+------------+
// |dp[i+1][j-1]|            |
// +------------+------------+
// dp[i][j]的值依赖于dp[i + 1][j - 1], 因此需要先获得dp[i + 1][j - 1]的值, 因此需要从下往上, 从左往右遍历

const countSubstrings = function (str) {
    let dp = new Array(str.length).fill(0).map(() => new Array(str.length).fill(0));
    // 回文子串的数目
    let num = 0;
    for (let i = str.length - 1; i >= 0; i--) {
        // 注意这里初始化j=i，因为j始终是大于等于i的，基于[i,j]字符串
        for (let j = i; j < str.length; j++) {
            if (str[i] === str[j]) {
                if (j <= i + 1) {
                    dp[i][j] = 1;
                    num++;
                } else {
                    if (dp[i + 1][j - 1] === 1) {
                        dp[i][j] = 1;
                        num++;
                    }
                }
            }
        }
    }
    return num;
};

// 另外一个变种:最长回文子串
const longestPalindrome = function (str) {
    let dp = new Array(str.length).fill(0).map(() => new Array(str.length).fill(0));
    let start = 0;
    let end = 0;
    let maxLength = 0;
    for (let i = str.length - 1; i >= 0; i--) {
        for (let j = i; j < str.length; j++) {
            if (str[j] === str[i]) {
                if (i === j || j === i + 1) {
                    dp[i][j] = 1;
                    if (j - i + 1 > maxLength) {
                        maxLength = j - i + 1;
                        start = i;
                        end = j;
                    }
                } else if (j > i + 1) {
                    if (dp[i + 1][j - 1] === 1) {
                        dp[i][j] = 1;
                        if (j - i + 1 > maxLength) {
                            maxLength = j - i + 1;
                            start = i;
                            end = j;
                        }
                    }
                }
            }
        }
    }
    return str.substring(start, end + 1);
};

console.log(longestPalindrome('babad'));