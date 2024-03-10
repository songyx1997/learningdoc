/* 双指针的思路
明显，一个指针指向头，一个指针指向尾
双指针主要是自增/自减的条件
只有当指向的元素是最大的，才会自增/自减 */

const sortedSquares = function (nums) {
    let head = 0;
    let tail = nums.length - 1;
    let result = [];
    // 注意这里包含了等于，防止元素被落下
    for (; head <= tail;) {
        let a = Math.pow(nums[head], 2);
        let b = Math.pow(nums[tail], 2);
        if (a < b) {
            result.push(b);
            tail--;
        } else if (a >= b) {
            result.push(a);
            head++;
        }
    }
    return result.reverse();
};

console.log(sortedSquares([-7, -3, 2, 3, 11]));