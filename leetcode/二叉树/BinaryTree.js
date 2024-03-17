const TreeNode = require('./TreeNode');

class BinaryTree {
    constructor() {
        this.root = null;
    }

    // 根据层次遍历数组构建二叉树
    buildTreeFromArray(arr) {
        if (!Array.isArray(arr) || arr.length === 0) return null;
        let rootVal = arr.shift();
        if (!rootVal) return null;
        let root = new TreeNode(rootVal);
        let queue = [root];
        while (arr.length > 0) {
            let node = queue.shift();
            let leftVal = arr.shift();
            if (leftVal) {
                node.left = new TreeNode(leftVal);
                queue.push(node.left);
            }
            let rightVal = arr.shift();
            if (rightVal) {
                node.right = new TreeNode(rightVal);
                queue.push(node.right);
            }
        }
        this.root = root;
    }
}

module.exports = BinaryTree;