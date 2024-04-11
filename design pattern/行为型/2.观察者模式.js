class Subject {
    constructor() {
        this.observers = [];
    }
    add(observer) {
        this.observers.push(observer);
    }
    remove(observer) {
        this.observers = this.observers.filter((item) => {
            return item !== observer;
        })
    }
    notify() {
        this.observers.forEach((item) => {
            item.show('the observer name is ');
        })
    }
}

class Observer {
    constructor(name) {
        this.name = name;
    }
    show(prefix) {
        console.log(prefix + this.name);
    }
}

const sub = new Subject();
// 添加观察者
const zhang = new Observer('zhang');
const li = new Observer('li');
sub.add(zhang);
sub.add(li);
// 触发通知
sub.notify();