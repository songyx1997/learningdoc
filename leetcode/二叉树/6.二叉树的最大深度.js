// 深度：二叉树任意一个节点到根节点的距离。根节点的深度为1。
// 高度：二叉树任意一个节点到叶子节点的距离。叶子节点的高度为1。
// 计算高度和深度，都是逐渐加1的过程。
// 从根节点出发，逐渐加一，使用前序遍历。
// 从叶子节点出发，逐渐加一，使用后序遍历。

// 由于根节点的高度就是树的最大深度，因此该题目使用后序遍历。

const maxDepth = function (root) {
    let depth = 0;
    if (root != null) {
        // 后序遍历
        let leftDepth = maxDepth(root.left);
        let rightDepth = maxDepth(root.right);
        depth = Math.max(leftDepth, rightDepth) + 1;
    }
    return depth;
}