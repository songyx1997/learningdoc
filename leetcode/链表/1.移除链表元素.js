const ListNode = require('./ListNode');
const LinkedList = require('./LinkedList');

// 使用虚拟头节点，这样不会有针对头节点的特殊处理
const removeElements = function (head, val) {
    let virtualNode = new ListNode();
    virtualNode.next = head;
    let current = virtualNode;
    while (current.next != null) {
        if (current.next.val === val) {
            current.next = current.next.next;
        } else {
            current = current.next;
        }
    }
    return virtualNode.next;
};

const array = [1, 2, 6, 3, 4, 5, 6];
const linkedList = new LinkedList();
for (let i = 0; i < array.length; i++) {
    linkedList.addAtTail(array[i]);
}
removeElements(linkedList.head, 6);