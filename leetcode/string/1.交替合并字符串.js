/* 给你两个字符串word1和word2。请你从word1开始，通过交替添加字母来合并字符串。
如果一个字符串比另一个字符串长，就将多出来的字母追加到合并后字符串的末尾。
返回合并后的字符串。
双指针法，而不是嵌套遍历。
如果posOne没有超出word1的范围，就将word1[posOne]加入答案，并且将posOne移动一个位置。
如果posTwo没有超出word2的范围，就将word2[posTwo]加入答案，并且将posTwo移动一个位置。 */
const mergeAlternately = function (word1, word2) {
    let posOne = 0;
    let posTwo = 0;
    let lengthOne = word1.length;
    let lengthTwo = word2.length;
    let result = '';
    while (posOne < lengthOne || posTwo < lengthTwo) {
        if (posOne < lengthOne) {
            result += word1[posOne++];
        }
        if (posTwo < lengthTwo) {
            result += word2[posTwo++];
        }
    }
    return result;
};