// 输入: g = [1,2], s = [1,2,3]
// 输出: 2
// 解释: 
// 你有两个孩子和三块小饼干，2个孩子的胃口值分别是1,2。
// 你拥有的饼干数量和尺寸都足以让所有孩子满足。
// 所以你应该输出2.

// 贪心
// 由局部最优推导出全局最优
// 局部最优：将最大的饼干分配给胃口最大的孩子

const findContentChildren = function (g, s) {
    // 均降序排列
    g.sort((a, b) => b - a);
    s.sort((a, b) => b - a);
    // 将饼干喂给孩子，遍历孩子
    let j = 0;
    let result = 0;
    for (let i = 0; i < g.length; i++) {
        if (j >= s.length) {
            break;
        }
        if (s[j] >= g[i]) {
            j++;
            result++;
        }
    }
    return result;
};

console.log(findContentChildren([1, 2], [1, 2, 3]));