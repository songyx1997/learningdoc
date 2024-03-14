const LinkedList = require('./LinkedList');

const reverseList = function (head) {
    if (!head || !head.next) {
        return head;
    }
    // 使用双指针，cur指向当前节点，pre指向当前节点的上一个节点
    // 初始化很重要！
    let cur = head;
    let pre = null;
    // cur为null说明遍历已结束
    while (cur) {
        let tmp = cur.next;
        cur.next = pre;
        // 注意下面两条语句的顺序，若先给cur赋值，则就无法给pre赋值了
        pre = cur;
        cur = tmp;
    }
    return pre;
};

const array = [1, 2, 3, 4, 5];
const linkedList = new LinkedList();
for (let i = 0; i < array.length; i++) {
    linkedList.addAtTail(array[i]);
}
console.log(reverseList(linkedList.head));