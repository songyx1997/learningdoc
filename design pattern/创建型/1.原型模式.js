function Person(name, age, hobby) {
    Person.prototype.name = name;
    Person.prototype.age = age;
    Person.prototype.hobby = hobby;
    Person.prototype.increase = increase;
}

function increase() {
    Person.prototype.age += 1;
}

let one = new Person('li', 60, ['高尔夫']);
let two = new Person('zhang', 20, ['游泳', '骑车']);
one.hobby.push('打游戏');
two.increase();