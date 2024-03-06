async function test1() {
    console.log('1');
    console.log(await test2());
    console.log('2');
}
async function test2() {
    console.log('3');
    return await '4';
}
test1();
console.log('5');
setTimeout(() => {
    console.log('6');
}, 0);
new Promise((resolve) => {
    console.log('7');
    resolve();
}).then(() => {
    console.log('8');
});
console.log('9');
// 1 3 5 7 9 8 4 2 6