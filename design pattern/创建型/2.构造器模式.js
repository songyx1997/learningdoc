function Person(name, age, hobby) {
    this.name = name;
    this.age = age;
    this.hobby = hobby;
    this.increase = function () {
        this.age++;
    };
}

let one = new Person('li', 60, ['高尔夫']);
let two = new Person('zhang', 20, ['游泳', '骑车']);
one.hobby.push('打游戏');
two.increase();
// false
console.log(two.increase === one.increase);