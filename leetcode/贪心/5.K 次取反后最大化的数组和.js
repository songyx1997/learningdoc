// 给你一个整数数组 nums 和一个整数 k ，按以下方法修改该数组：
// 选择某个下标 i 并将 nums[i] 替换为 -nums[i] 。
// 重复这个过程恰好 k 次。可以多次选择同一个下标 i 。
// 以这种方式修改数组后，返回数组 可能的最大和 。

// 输入：nums = [3,-1,0,2], k = 3
// 输出：6
// 解释：选择下标 (1, 2, 2) ，nums 变为 [3,1,0,2] 。

// 1.当数组中有正有负
// 局部最优：将数组中的负数（绝对值较大者）进行取反。
// 2.当数组中全是正数
// 局部最优：将最小的正数取反，对该正数一直反复取反直至次数耗尽。

const largestSumAfterKNegations = function (nums, k) {
    nums.sort((a, b) => a - b);
    // 针对负数处理
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] < 0 && k > 0) {
            nums[i] = -1 * nums[i];
            k--;
        } else {
            break;
        }
    }
    // 针对全正数处理
    if (k > 0) {
        nums.sort((a, b) => a - b);
        nums[0] = nums[0] * Math.pow((-1), k);
    }
    // 数组求和
    return nums.reduce((a, c) => a + c, 0);
};

console.log(largestSumAfterKNegations([2, -3, -1, 5, -4], 2));