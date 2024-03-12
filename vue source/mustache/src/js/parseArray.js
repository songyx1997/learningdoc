import lookup from '@/js/lookup';
import renderTemplate from '@/js/renderTemplate';

const parseArray = function (token, data) {
    // 遍历次数显然取决于准备的数据的大小
    // 借助之前编写lookup函数，获取待遍历的数据
    const pendingData = lookup(data, token[1]);
    let str = '';
    for (let i = 0; i < pendingData.length; i++) {
        let item = { '.': pendingData[i], ...pendingData[i] };
        // 给数据添加[.]属性，用于处理<li>{{.}}</li>
        // 递归
        str += renderTemplate(token[2], item);
    }
    return str;
}

export default parseArray;