import { sum, success } from './method';

enum Gender {
    Male = 1,
    Female = 0
}
// &表示person需要同时满足
let person: { name: string } & { gender: Gender };
person = { name: 'songyx', gender: Gender.Male };

console.log(sum(1, 2));
console.log(success);