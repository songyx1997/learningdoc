// 显然是使用双指针法
const reverseString = function (str) {
    let head = 0;
    let tail = str.length - 1;
    while (head < tail) {
        let tmp = str[head];
        str[head] = str[tail];
        str[tail] = tmp;
        head++;
        tail--;
    }
    return str;
};

console.log(reverseString(['h', 'e', 'l', 'l', 'o']));