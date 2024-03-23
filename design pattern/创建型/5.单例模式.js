// 1.构造函数创建
class Subject {
    static instance = null;
    // 空构造函数
    constructor() {
    }
    static getInstance(name, time) {
        if (!Subject.instance) {
            let obj = new Subject();
            obj.name = name;
            obj.time = time;
            Subject.instance = obj;
        }
        return Subject.instance;
    }
}

let math = Subject.getInstance('math', 3);
let english = Subject.getInstance('english', 2);
// true
console.log(math === english);

// 2.闭包创建
const Person = (function () {
    let instance = null;
    function createInstance(name, age) {
        const object = {
            name: name,
            age: age
        };
        return object;
    }
    return {
        getInstance: function (name, age) {
            if (!instance) {
                instance = createInstance(name, age);
            }
            return instance;
        }
    };
})();

const zhang = Person.getInstance('zhang', 20);
const li = Person.getInstance('li', 60);
// true
console.log(zhang === li);