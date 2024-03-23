function Person(name, age, hobby) {
    this.name = name;
    this.age = age;
    this.hobby = hobby;
}

Person.prototype.increase = function () {
    this.age++;
}

Person.prototype.grades = [];

let one = new Person('li', 60, ['高尔夫']);
let two = new Person('zhang', 20, ['游泳', '骑车']);
one.grades.push('小学');
two.increase();
// false、true、true
console.log(two.hobby === one.hobby);
console.log(two.increase === one.increase);
console.log(two.grades === one.grades);