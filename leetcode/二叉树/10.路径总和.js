const BinaryTree = require('./BinaryTree');

class Result {
    constructor() {
        this.sum = 0;
        this.flag = false;
    }
}

// 找路径，从根节点开始，使用前序遍历
const hasPathSum = function (root, targetSum, result) {
    if (!result) {
        result = new Result();
    }
    if (root) {
        result.sum += root.val;
        if (targetSum === result.sum && root.left === null && root.right === null) {
            result.flag = true;
        } else if (root.left === null && root.right === null) {
            // 回溯
            result.sum -= root.val;
        } else {
            hasPathSum(root.left, targetSum, result);
            hasPathSum(root.right, targetSum, result);
            // 回溯
            result.sum -= root.val;
        }
    }
    return result.flag;
};

let binaryTree = new BinaryTree();
binaryTree.buildTreeFromArray([5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1]);
console.log(hasPathSum(binaryTree.root, 22));