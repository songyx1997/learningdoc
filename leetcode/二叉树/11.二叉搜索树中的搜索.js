const BinaryTree = require('./BinaryTree');

// 二叉搜索树的特性：节点左子树的节点都比该节点小，节点右子树的节点都比该节点大。
// 递归法
// const searchBST = function (root, val) {
//     // 当root为null时，说明全部节点都不匹配
//     if (root === null || root.val === val) {
//         return root;
//     } else {
//         if (root.val < val) {
//             return searchBST(root.right, val);
//         } else {
//             return searchBST(root.left, val);
//         }
//     }
// };

// 迭代法
const searchBST = function (root, val) {
    while (root !== null) {
        if (root.val < val) {
            root = root.right;
        } else if (root.val > val) {
            root = root.left;
        } else {
            break;
        }
    }
    return root;
};

let binaryTree = new BinaryTree();
binaryTree.buildTreeFromArray([4, 2, 7, 1, 3]);
console.log(searchBST(binaryTree.root, 2));