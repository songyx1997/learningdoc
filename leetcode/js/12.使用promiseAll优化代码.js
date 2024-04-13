function funA() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(1);
        }, 1000);
    })
}
function funB() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(2);
        }, 2000);
    })
}
function funC() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(3);
        }, 3000);
    })
}
async function execute() {
    let start = Date.now();
    let a = await funA();
    let b = await funB();
    let c = await funC();
    let end = Date.now();
    console.log(`执行耗时: ${(end - start) / 1000} 秒`);
    return a + b + c;
}
execute();

// 使用promiseAll进行上述代码的优化
async function newExecute() {
    let start = Date.now();
    let result = await Promise.all([funA(), funB(), funC()])
    let end = Date.now();
    console.log(`执行耗时: ${(end - start) / 1000} 秒`);
    return result[0] + result[1] + result[2];
}
newExecute();