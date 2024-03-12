// 以abababab举例
// ababab|ab
// ab|ababab
// 最长相等前后缀为ababab
// 重复的子串就是原本的字符串-最长相等前后缀
const repeatedSubstringPattern = function (s) {
    let next = getNext(s);
    if (next[next.length - 1] != 0) {
        return s.length % (s.length - next[next.length - 1]) === 0
    } else {
        return false;
    }
};

function getNext(str) {
    // i表示后缀的末尾
    // j表示最长公共前后缀的值
    // next数组的元素也是最长公共前后缀的值
    // 初始化：j = next[0] = 0
    // 为了便于理解，可以将0~j理解为模式串，0~i理解为文本串
    const pattern = Array.from(str);
    const next = [0];
    let j = 0;
    for (let i = 1; i < pattern.length; i++) {
        while (j > 0 && pattern[i] !== pattern[j]) {
            // 当模式串当前位置与前缀不匹配时，回溯到next[j]
            // 这是一个持续回退的过程
            j = next[j - 1];
        }
        if (pattern[i] === pattern[j]) {
            // 如果匹配，则移动到下一个字符继续比较
            j++;
        }
        next[i] = j;
    }
    return next;
}