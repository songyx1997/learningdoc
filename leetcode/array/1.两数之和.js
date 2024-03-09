/* 给定一个整数数组nums和一个整数目标值target，请你在该数组中找出和为目标值target的那两个整数，并返回它们的数组下标。
你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。
你可以按任意顺序返回答案。
推荐：创建map（哈希表）存储结果，避免以下情况
nums=[3, 2, 4], target=6
返回结果应当为[1, 2]，而不是[0, 0] */
const twoSum = function (nums, target) {
    let map = new Map();
    for (let index = 0; index < nums.length; index++) {
        let el = nums[index];
        if (map.has(target - el)) {
            return [map.get(target - el), index];
        } else {
            map.set(el, index);
        }
    }
};