// 遍历时常常是i++的思维
// 这里是每2k个字符进行处理，因此i += 2k
const reverseStr = function (s, k) {
    let arr = Array.from(s);
    for (let i = 0; i < arr.length; i += 2 * k) {
        if (arr.length - i < k) {
            reverse(arr, i, arr.length);
        } else {
            reverse(arr, i, i + k);
        }
    }
    return arr.join('');
};

function reverse(s, i, j) {
    let head = i;
    let tail = j - 1;
    while (head < tail) {
        let tmp = s[head];
        s[head] = s[tail];
        s[tail] = tmp;
        head++;
        tail--;
    }
}

console.log(reverseStr('abcdefg', 2));