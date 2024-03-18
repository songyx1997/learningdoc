class Result {
    constructor() {
        // 计算相邻两个节点的差值，使用双指针
        this.pre = undefined;
        this.cur = undefined;
        this.diff = undefined;
    }
}

// 二叉搜索树的特性：节点左子树的节点都比该节点小，节点右子树的节点都比该节点大。
// 中序遍历
const getMinimumDifference = function (root, result) {
    if (!result) {
        result = new Result();
    }
    if (root) {
        getMinimumDifference(root.left, result);
        result.pre = result.cur;
        result.cur = root;
        if (result.pre) {
            let diff = Math.abs(root.val - result.pre.val);
            if (!result.diff) {
                result.diff = diff;
            } else {
                result.diff = Math.min(diff, result.diff);
            }
        }
        getMinimumDifference(root.right, result);
    }
    return result.diff;
};