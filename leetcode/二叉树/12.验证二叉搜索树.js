class Result {
    constructor() {
        this.val = undefined;
        this.flag = true;
    }
}

// 二叉搜索树的特性：节点左子树的节点都比该节点小，节点右子树的节点都比该节点大。
// 因此我们可以很直观的想到，使用中序遍历，获取到的数组如果是单调递增的，那么一定是二叉搜索树！！
const isValidBST = function (root, result) {
    if (!result) {
        result = new Result();
    }
    if (root) {
        isValidBST(root.left, result);
        if (result.val !== undefined && root.val <= result.val) {
            result.flag = false
        } else {
            result.val = root.val;
        }
        isValidBST(root.right, result);
    }
    return result.flag;
};