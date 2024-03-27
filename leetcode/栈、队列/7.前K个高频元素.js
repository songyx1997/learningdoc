// 本题应该使用堆（小顶堆-根节点的元素最小）。但是js中没有堆，因此直接给map排序
function topKFrequent(nums, k) {
    const map = new Map();
    for (let num of nums) {
        map.set(num, (map.get(num) || 0) + 1);
    }
    // map.entries()
    // 结果为
    // [1, 3]
    // [2, 2]
    // [3, 1]
    // 降序排列
    const resultMap = [...map.entries()].sort((a, b) => b[1] - a[1]);
    resultMap.splice(k);
    const result = resultMap.map((el) => el[0]);
    return result;
};

console.log(topKFrequent([1, 1, 1, 2, 2, 3], 2));