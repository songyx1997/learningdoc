import lookup from '@/js/lookup';
import parseArray from '@/js/parseArray';

// 将tokens数组变成dom字符串
const renderTemplate = function (tokens, data) {
    let str = '';
    for (let i = 0; i < tokens.length; i++) {
        switch (tokens[i][0]) {
            case 'text':
                str += tokens[i][1];
                break;
            case 'name':
                // 获取data中的属性值
                // 对于a:{b:''}，通过data[a.b]是无法获取对应的属性值的，因此引入lookup函数
                str += lookup(data, tokens[i][1]);
                break;
            case '#':
                // 对于数组，进行特殊解析
                str += parseArray(tokens[i], data);
                break;
            default:
                break;
        }
    }
    return str;
}

export default renderTemplate;