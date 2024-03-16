// 前序遍历：先遍历根
const preorderTraversal = function (root, result) {
    if (!result) {
        result = [];
    }
    if (root !== null) {
        result.push(root.val);
        if (root.left !== null) {
            preorderTraversal(root.left, result);
        }
        if (root.right !== null) {
            preorderTraversal(root.right, result);
        }
    }
    return result;
};

// 中序遍历
const inorderTraversal = function (root, result) {
    if (!result) {
        result = [];
    }
    if (root !== null) {
        if (root.left !== null) {
            inorderTraversal(root.left, result);
        }
        result.push(root.val);
        if (root.right !== null) {
            inorderTraversal(root.right, result);
        }
    }
    return result;
};

// 后序遍历
const postorderTraversal = function (root, result) {
    if (!result) {
        result = [];
    }
    if (root !== null) {
        if (root.left !== null) {
            postorderTraversal(root.left, result);
        }
        if (root.right !== null) {
            postorderTraversal(root.right, result);
        }
        result.push(root.val);
    }
    return result;
};