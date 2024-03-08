const parseTemplate = require('./parseTemplate');
const nestedTokens = require('./nestedTokens');

function render(template, data) {
    let tokens = parseTemplate(template);
    let finalTokens = nestedTokens(tokens);
}

let template =
    `<div>
        <ol>
            {{#students}}
            <li>
                学生{{item.name}}的爱好是
                <ol>
                    {{#item.hobbies}}
                    <li>{{.}}</li>
                    {{/item.hobbies}}
                </ol>
            </li>
            {{/students}}
        </ol>
    </div>`
render(template);
