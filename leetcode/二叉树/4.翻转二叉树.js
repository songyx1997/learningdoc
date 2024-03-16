// 可以使用先序、后序、中序，但是中序有所不同

// 后序遍历，最好理解
// const invertTree = function (node) {
//     if (node === null) {
//         return null;
//     }
//     let left = invertTree(node.left);
//     let right = invertTree(node.right);
//     node.left = right;
//     node.right = left;
//     return node;
// };

// 中序遍历也是可以的，但是需要注意
const invertTree = function (node) {
    if (node === null) {
        return null;
    }
    let left = invertTree(node.left);
    node.left = node.right;
    node.right = left;
    // 因为节点交换发生在遍历右子树之前，当遍历右子树时，左子树已经和右子树发生了交换
    // 所以入参应该为node.left，而非node.right
    invertTree(node.left);
    return node;
};