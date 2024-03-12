// 前缀：包含首字母，不包含尾字母的子串
// 后缀：包含尾字母，不包含首字母的子串

// 前缀表：最长相等前后缀，以abababab为例
// 0   a
// 0   ab
// 1   aba          ab与ba不相等，但a与a相等，最长相等前后缀长度为1
// 2   abab         aba与bab不相等，但ab与ab相等，最长相等前后缀长度为2
// 3   ababa        abab与baba不相等，但aba与aba相等，最长相等前后缀长度为3
// 4   ababab       ababa与babab不相等，但abab与abab相等，最长相等前后缀长度为4
// 5   abababa      ababab与bababa不相等，但ababa与ababa相等，最长相等前后缀长度为5
// 6   abababab     abababa与bababab不相等，但ababab与ababab相等，最长相等前后缀长度为6
// 这里的[0, 0, 1, 2, 3, 4, 5, 6]就是前缀表

// 如何使用前缀表
// 文本串：aabaabaaf
// 模式串：aabaaf
// 前缀表：01012
// 文本串aabaab与模式串aabaaf匹配到b和f时发生了冲突
// 我们去找模式串f之前的子串（aabaa）的最长公共前后缀长度，也就是2。因此跳到模式串下标为2的位置重新匹配，下标为2的位置为b。
// aabaa|baaf的baaf和aa|baaf的baaf开始匹配

// 根据模式串获取next数组
const getNext = function (str) {
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

console.log(getNext('aabaaf'));