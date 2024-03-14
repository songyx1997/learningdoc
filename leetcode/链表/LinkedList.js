const ListNode = require('./ListNode');

class LinkedList {
    constructor() {
        this.head = null;
        // 链表长度
        this.length = 0;
    }

    get(index) {
        if (index < 0 || index >= this.length) {
            return -1;
        }
        let virtualNode = new ListNode();
        virtualNode.next = this.head;
        let current = virtualNode;
        while (index > 0 && current !== null) {
            current = current.next;
            index--;
        }
        return current.next.val;
    }

    addAtHead(val) {
        let newNode = new ListNode(val);
        newNode.next = this.head;
        this.head = newNode;
        this.length++;
        return this.head;
    }

    addAtTail(val) {
        let newNode = new ListNode(val);
        if (this.head === null) {
            this.head = newNode;
        } else {
            // 注意这里的初始化和比较条件
            let current = this.head;
            while (current.next !== null) {
                current = current.next;
            }
            current.next = newNode;
        }
        this.length++;
    }

    addAtIndex(index, val) {
        if (index >= 0 && index < this.length) {
            let virtualNode = new ListNode();
            virtualNode.next = this.head;
            let current = virtualNode;
            while (index > 0 && current !== null) {
                current = current.next;
                index--;
            }
            let newNode = new ListNode(val);
            newNode.next = current.next;
            current.next = newNode;
            this.length++;
            this.head = virtualNode.next;
        } else if (index === this.length) {
            this.addAtTail(val);
        }
    }

    deleteAtIndex(index) {
        if (index >= 0 && index < this.length) {
            let virtualNode = new ListNode();
            virtualNode.next = this.head;
            let current = virtualNode;
            while (index > 0 && current !== null) {
                current = current.next;
                index--;
            }
            current.next = current.next.next;
            this.length--;
            this.head = virtualNode.next;
        }
    }
}

module.exports = LinkedList;