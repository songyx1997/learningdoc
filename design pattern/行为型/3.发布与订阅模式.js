// 发布者
class Publisher {
    constructor() {
        // 订阅者列表，使用对象，可以
        this.list = {};
    }
    subscribe(type, sub) {
        if (this.list[type]) {
            this.list[type].push(sub);
        } else {
            this.list[type] = [sub];
        }
    }
    unSubscribe(type, sub) {
        if (this.list[type]) {
            if (sub) {
                this.list[type] = this.list[type].filter(item => item !== sub);
            } else {
                // 所有该类型的订阅者均被取消
                // 数组引用被断开，垃圾回收器会在合适的时机回收其占用的内存
                delete this.list[type];
            }
        }
    }
    publish(type) {
        if (this.list[type]) {
            // 直接调用订阅者
            this.list[type].forEach(item => item());
        }
    }
}

// 订阅者
function type_A_fun1() {
    console.log('A类方法一被调用');
}
function type_A_fun2() {
    console.log('A类方法二被调用');
}
function type_B_fun1() {
    console.log('B类方法一被调用');
}

const publisher = new Publisher();
// 订阅
publisher.subscribe('A', type_A_fun1);
publisher.subscribe('A', type_A_fun2);
publisher.subscribe('B', type_B_fun1);
// 发布
publisher.publish('A');
publisher.publish('B');
// 取消订阅
publisher.unSubscribe('A', type_A_fun1);
publisher.unSubscribe('B');
// 发布
publisher.publish('A');
publisher.publish('B');