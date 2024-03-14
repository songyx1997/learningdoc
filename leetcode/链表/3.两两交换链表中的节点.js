const LinkedList = require('./LinkedList');
const ListNode = require('./ListNode');

const swapPairs = function (head) {
    // 使用双指针会加大边界判断的难度
    // 使用虚拟节点就可以解决问题
    if (!head || !head.next) {
        return head;
    }
    let virtualNode = new ListNode();
    virtualNode.next = head;
    let cur = virtualNode;
    while (cur.next != null && cur.next.next != null) {
        let tmp = cur.next;
        cur.next = tmp.next;
        tmp.next = cur.next.next;
        cur.next.next = tmp;
        cur = tmp;
    }
    return virtualNode.next;
};

const array = [1, 2, 3, 4, 5];
const linkedList = new LinkedList();
for (let i = 0; i < array.length; i++) {
    linkedList.addAtTail(array[i]);
}
console.log(swapPairs(linkedList.head));