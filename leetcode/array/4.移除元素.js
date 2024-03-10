// 使用双指针，快指针一直自增，慢指针满足条件时自增。
// 条件：快指针指向的元素，并非待删除的元素。
const removeElement = function (nums, val) {
    let fast = 0;
    let slow = 0;
    for (; fast < nums.length; fast++) {
        if (nums[fast] != val) {
            // 不使用额外的数组空间
            nums[slow++] = nums[fast];
        }
    }
    return slow;
};

console.log(removeElement([0, 1, 2, 2, 3, 0, 4, 2], 2));