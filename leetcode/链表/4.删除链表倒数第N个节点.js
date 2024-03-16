// 核心思路是使用双指针，一个快指针，一个慢指针，慢指针先移动n+1！！
// 当快指针指向null时，慢指针就指向了倒数第n个节点的前一个节点
const ListNode = require('./ListNode');
const LinkedList = require('./LinkedList');

const removeNthFromEnd = function (head, n) {
    let virtualNode = new ListNode();
    virtualNode.next = head;
    let fast = virtualNode;
    let slow = virtualNode;
    while (fast) {
        if (n >= 0) {
            n--;
        } else {
            slow = slow.next;
        }
        fast = fast.next;
    }
    // 此时slow指向的就是倒数第n+1个节点
    // 删除节点
    slow.next = slow.next.next;
    return virtualNode.next;
};

const array = [1, 2, 3, 4];
const linkedList = new LinkedList();
for (let i = 0; i < array.length; i++) {
    linkedList.addAtTail(array[i]);
}
console.log(removeNthFromEnd(linkedList.head, 2));