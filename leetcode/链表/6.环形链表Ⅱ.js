const ListNode = require('./ListNode');
const LinkedList = require('./LinkedList');

// 同样采用双指针的思路
// 快指针移动两步，慢指针移动一步
// 若存在环，快指针和慢指针一定会在环中相遇，因为快指针相对于慢指针快一步
// 在此基础上，这道题主要是数学证明
// 从初始节点到入口的长度为x
// 从入口到环内相遇点的长度为y
// 从相遇点再次回到入口的长度为z
// 快指针行走圈数为n，显然n>=1
// 因此快指针移动距离为 x + n * (y + z)
// 慢指针移动距离为 x + y
// 因此 2 * (x + y) == x + n * (y + z)
// 因此 x = (n - 1) * (y + z) + z

const detectCycle = function (head) {
    let virtualNode = new ListNode();
    virtualNode.next = head;
    let fast = virtualNode;
    let slow = virtualNode;
    while (fast !== null && fast.next !== null) {
        fast = fast.next.next;
        slow = slow.next;
        if (fast === slow) {
            // 从相遇点出发一个新指针，从初始点出发一个新指针，最终二者一定会在入口相遇
            let one = fast;
            let two = virtualNode;
            while (one !== two) {
                one = one.next;
                two = two.next;
            }
            return one;
        }
    }
    return null;
};

const array = [3, 2, 0, -4];
const linkedList = new LinkedList();
for (let i = 0; i < array.length; i++) {
    linkedList.addAtTail(array[i]);
}
linkedList.getNode(3).next = linkedList.getNode(1);
console.log(detectCycle(linkedList.head));