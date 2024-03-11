// strs = ['flower', 'flow', 'flight']
// 'fl'
// 采用纵向扫描法
// f|l|ower
// f|l|ow
// f|l|ight
const longestCommonPrefix = function (strs) {
    if (!strs[0]) {
        return '';
    }
    for (let i = 0; i < strs[0].length; i++) {
        let s = strs[0][i];
        for (let j = 1; j < strs.length; j++) {
            if (!strs[j][i] || strs[j][i] !== s) {
                return strs[0].substring(0, i);
            }
        }
    }
    return strs[0];
};

console.log(longestCommonPrefix(['flower', 'flow', 'flight']));