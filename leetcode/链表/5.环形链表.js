const ListNode = require('./ListNode');
const LinkedList = require('./LinkedList');

// 同样采用双指针的思路
// 快指针移动两步，慢指针移动一步
// 若存在环，快指针和慢指针一定会在环中相遇，因为快指针相对于慢指针快一步
// 若不存在环，则fast一定会先遍历完整个链表

const hasCycle = function (head) {
    let virtualNode = new ListNode();
    virtualNode.next = head;
    let fast = virtualNode;
    let slow = virtualNode;
    while (fast !== null && fast.next !== null) {
        fast = fast.next.next;
        slow = slow.next;
        if (fast === slow) {
            return true;
        }
    }
    return false;
};

const array = [3, 2, 0, -4];
const linkedList = new LinkedList();
for (let i = 0; i < array.length; i++) {
    linkedList.addAtTail(array[i]);
}
linkedList.getNode(3).next = linkedList.getNode(1);
console.log(hasCycle(linkedList.head));