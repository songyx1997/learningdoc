// 每次循环，新生成的left和right，需要保证新的[left, right)还是合法的
const search = function (nums, target) {
    let left = 0;
    let right = nums.length - 1;
    // 比如[1, 1)是不合法的，因此这里只能是小于
    while (left < right) {
        // 注意js计算时存在精度损失
        let middle = Math.floor((left + right) / 2);
        // 可以确定middle不是命中的索引
        if (nums[middle] > target) {
            // 因为右侧为开区间，因此右侧为middle并不影响结果
            right = middle;
        } else if (nums[middle] < target) {
            left = middle + 1;
        } else {
            return middle;
        }
    }
    return -1;
};