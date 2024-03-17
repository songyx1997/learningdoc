// 求所有路径，一般都是从根出发，因此使用前序遍历

const binaryTreePaths = function (root, path, result) {
    if (!path) {
        path = [];
    }
    if (!result) {
        result = [];
    }
    if (root) {
        path.push(root.val);
        if (root.left === null && root.right === null) {
            // 该路径已经遍历结束
            result.push(convert(path));
            // 已找到路径，回溯
            path.pop();
        } else {
            binaryTreePaths(root.left, path, result);
            binaryTreePaths(root.right, path, result);
            // 左右子树均处理完，回溯
            path.pop();
        }
        // 进行回溯，这里很关键！
        // 以[1, 2, 3, null, 5]为例
        // 当path为[1, 2, 5]时，路径已找到，将结果放入result，之后就弹出5。
        // 此时2的左右子树均已处理完，再次执行弹出，弹出2。
        // 1的左子树处理完毕，但是右子树还未处理，继续处理！
    }
    return result;
};

const convert = function (path) {
    return path.join('->');
}