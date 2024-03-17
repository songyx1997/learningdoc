// 平衡二叉树要求：每一个节点的左子树与右子树的高度差在[-1, 1]
// 求高度差，因此使用后序遍历
const isBalanced = function (root) {
    return getHeight(root) !== -1;
}

const getHeight = function (node) {
    let height = 0;
    if (node) {
        let leftHight = getHeight(node.left);
        let rightHight = getHeight(node.right);
        if (leftHight !== -1 && rightHight !== -1 && leftHight - rightHight <= 1 && leftHight - rightHight >= -1) {
            return 1 + Math.max(leftHight, rightHight);
        } else {
            return -1;
        }
    }
    return height;
}