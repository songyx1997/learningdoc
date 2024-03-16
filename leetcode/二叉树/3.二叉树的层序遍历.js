// 即广度优先算法，使用队列
const levelOrder = function (root) {
    if (!root) {
        return [];
    }
    let nodes = [root];
    let result = [];
    let size = 1;
    while (nodes.length > 0) {
        // 需要注意，当每一层遍历结束后，需要记录该层的元素数目
        // 这个记录的数目就是队列应该弹出的元素个数
        let newSize = 0;
        let arr = [];
        for (let i = 0; i < size; i++) {
            let node = nodes.shift();
            if (node) {
                arr.push(node.val);
            }
            if (node.left) {
                nodes.push(node.left);
                newSize++;
            }
            if (node.right) {
                nodes.push(node.right);
                newSize++;
            }
        }
        size = newSize;
        result.push(arr);
    }
    return result;
};