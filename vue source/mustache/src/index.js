import parseTemplate from '@/js/parseTemplate';
import nestedTokens from '@/js/nestedTokens';
import renderTemplate from '@/js/renderTemplate';

function render(template, data) {
    // 将模板解析为tokens
    let tokens = parseTemplate(template);
    // 利用栈和引用将tokens转换为嵌套的tokens
    let finalTokens = nestedTokens(tokens);
    // 将嵌套的tokens转换为dom字符串
    let domStr = renderTemplate(finalTokens, data);
    document.getElementById('app').innerHTML = domStr;
}

let template =
    `<div>
        <div>年级：{{school.grade}}；班级：{{school.class}}</div>
        <ol>
            {{#students}}
            <li>
                学生{{name}}的爱好是
                <ol>
                    {{#hobbies}}
                    <li>{{.}}</li>
                    {{/hobbies}}
                </ol>
            </li>
            {{/students}}
        </ol>
    </div>`;
let data = {
    school: {
        grade: '高一',
        class: '33班'
    },
    students: [
        {
            name: '张三',
            hobbies: ['吃', '喝', '打游戏']
        },
        {
            name: '李四',
            hobbies: ['打高尔夫', '骑车']
        }
    ]
}
render(template, data);