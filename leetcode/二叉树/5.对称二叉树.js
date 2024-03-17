// 当需要收集孩子的信息并往上一层返回，则使用后序遍历
const isSymmetric = function (root) {
    return fun(root.left, root.right);
};

const fun = function (left, right) {
    if (left === null && right !== null) {
        return false;
    } else if (left !== null && right === null) {
        return false;
    } else if (left === null && right === null) {
        return true;
    } else {
        if (left.val !== right.val) {
            return false;
        } else {
            // 以下代码的执行顺序，要求必须为后序遍历
            let a = fun(left.left, right.right);
            let b = fun(left.right, right.left);
            return a & b;
        }
    }
}