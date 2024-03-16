// 迭代法使用栈，取代递归操作

// 前序遍历
const preorderTraversal = function (root) {
    let result = [];
    let stack = [root];
    while (stack.length > 0) {
        let node = stack.pop();
        if (node !== null) {
            stack.push(node.right);
            stack.push(node.left);
            result.push(node.val);
        }
    }
    return result;
};

// 中序遍历，比较特殊，需要借助辅助指针
// 这个栈记录的就是指针访问过的节点
const inorderTraversal = function (root) {
    let result = [];
    let stack = [];
    let cur = root;
    while (cur || stack.length > 0) {
        if (cur) {
            // 指针不为空，该节点被访问了，就压栈。然后将指针指向当前节点的左孩子！！
            stack.push(cur);
            cur = cur.left;
        } else {
            // 指针为空，出栈，栈顶就是新的指针。然后将指针指向当前节点的右孩子！！
            cur = stack.pop();
            result.push(cur.val);
            cur = cur.right;
        }
    }
    return result;
};

// 后序遍历，可在前序遍历的基础上修改
const curtorderTraversal = function (root) {
    let result = [];
    let stack = [root];
    while (stack.length > 0) {
        let node = stack.pop();
        if (node !== null) {
            // 仅修改下面两条语句
            stack.push(node.left);
            stack.push(node.right);
            result.push(node.val);
        }
    }
    // 返回时将数组颠倒
    return result.reverse();
};
