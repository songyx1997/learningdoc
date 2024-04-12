/* 给定一个字符串s，请你找出其中不含有重复字符的最长子串的长度。
核心思想：利用滑动窗口。 */
let lengthOfLongestSubstring = function (str) {
    let window = [];
    let max = 0;
    for (const s of str) {
        let index = window.indexOf(s);
        if (index != -1) {
            window = window.slice(index + 1);
        }
        window.push(s);
        if (max < window.length) {
            max = window.length
        }
    }
    return max;
};

/* [ 'a', 'd', 'v' ]
当数组中添加新元素d时，出现了重复，窗口需要进行滑动，并将新元素添加进数组
最终变为[ 'v', 'd' ] */
lengthOfLongestSubstring('advdf');