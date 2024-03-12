const parseTemplate = require('./parseTemplate');
const nestedTokens = require('./nestedTokens');
const renderTemplate = require('./renderTemplate');

function render(template, data) {
    let tokens = parseTemplate(template);
    let finalTokens = nestedTokens(tokens);
    let domStr = renderTemplate(finalTokens, data);
    console.log(finalTokens);
    console.log(domStr);
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
                    <li>{{type}}是{{evaluate}}</li>
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
            hobbies: [
                { type: '吃', evaluate: 'good' },
                { type: '喝', evaluate: 'good' },
                { type: '打游戏', evaluate: 'bad' }
            ]
        },
        {
            name: '李四',
            hobbies: [
                { type: '打高尔夫', evaluate: 'bad' },
                { type: '骑车', evaluate: 'good' }
            ]
        }
    ]
}
render(template, data);