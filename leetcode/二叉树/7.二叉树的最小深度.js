// 最小深度是从根节点到最近叶子节点的最短路径上的节点数量。
// 求深度，正常的思维是采用前序遍历，当遍历到叶子节点时，就返回。

// 前序遍历的实现较为复杂，要考虑到子节点非空的影响
// const minDepth = function (root) {
//     let depth = 0;
//     if (root !== null) {
//         depth++;
//         // 该节点为叶子节点
//         if (root.left === null && root.right === null) {
//             return depth;
//             // 该节点不是叶子节点，继续遍历，遍历时只去遍历非空的子节点
//         } else if (root.left !== null && root.right === null) {
//             return depth + minDepth(root.left);
//         } else if (root.left === null && root.right !== null) {
//             return depth + minDepth(root.right);
//         } else {
//             return depth + Math.min(minDepth(root.left), minDepth(root.right));
//         }
//     }
//     return depth;
// };

// 此题等价于求根节点的最小高度，因此可以使用后序遍历！！
const minDepth = function (root) {
    let depth = 0;
    if (root !== null) {
        let leftDepth = minDepth(root.left);
        let rightDepth = minDepth(root.right);
        if (root.left === null && root.right === null) {
            return 1;
        } else if (root.left !== null && root.right === null) {
            return 1 + leftDepth;
        } else if (root.left === null && root.right !== null) {
            return 1 + rightDepth;
        } else {
            return 1 + Math.min(leftDepth, rightDepth);
        }
    }
    return depth;
};

// 可以看出，前序和后序的区别：一个是1+min，另一个是depth+min