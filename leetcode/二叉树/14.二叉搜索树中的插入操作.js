const TreeNode = require('./TreeNode');

// 二叉搜索树的特性：节点左子树的节点都比该节点小，节点右子树的节点都比该节点大。
// 该题的简化思路，只往叶子节点插！！
// 替换节点就会导致复杂。所以插值只在叶子节点，仍然满足二叉搜索树的特性。

// 迭代法，双指针
const insertIntoBST = function (root, val) {
    if (!root) {
        return new TreeNode(val);
    }
    let pre;
    let cur;
    cur = root;
    while (cur !== null) {
        if (cur.val < val) {
            pre = cur;
            cur = cur.right;
        } else if (cur.val > val) {
            pre = cur;
            cur = cur.left;
        } else {
            // 该节点已存在，不需要再插入
            break;
        }
    }
    let node = new TreeNode(val);
    if (pre.val < val) {
        pre.right = node;
    }
    if (pre.val > val) {
        pre.left = node;
    }
    return root;
};