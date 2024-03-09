/* 对于字符串s和t，只有在s = t + t + t + ... + t + t（t自身连接1次或多次）时，我们才认定“t 能除尽 s”。
给定两个字符串str1和str2。返回最长字符串x，要求满足x能除尽str1且x能除尽str2。 */
const gcdOfStrings = function (str1, str2) {
    // 性质一：如果str1和str2拼接后等于str2和str1拼接起来的字符串（注意拼接顺序不同），那么一定存在符合条件的字符串x
    if (str1 + str2 !== str2 + str1) {
        return '';
    }
    // 性质二：如果存在一个符合要求的字符串x，那么它的长度为str1和str2长度的最大公约数
    let len = 0;
    if (str1.length <= str2.length) {
        len = gcd(str2.length, str1.length);
    } else {
        len = gcd(str1.length, str2.length);
    }
    return str1.substring(0, len);
};

function gcd(a, b) {
    if (b == 0) {
        return a;
    } else {
        return gcd(b, a % b);
    }
}