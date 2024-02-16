const sum: (a: number, b: number) => number = (a, b) => a + b;
const success = Promise.resolve('success');
const fun: <T, K>(t: T, k: K) => T = (t, k) => {
    console.log(k);
    return t;
}

class Person {
    name: string;
    age: number;
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
}

class Young extends Person {
    address: string;
    constructor(name: string, age: number, address: string) {
        super(name, age);
        this.address = address
    }
}

// 泛型T必须是Person的实现类（子类）
const student: <T extends Person>(s: T) => string = (s) => {
    return `${s.name}-${s.age}-${s.toString()}`
}

export { sum, success, fun, student, Young }