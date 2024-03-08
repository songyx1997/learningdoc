<table>
    <tr>
        <td>title：vue source</td>
        <td>author：songyx</td>
        <td>date：2024/03/08</td>
    </tr>
</table>

#### mustache

首先将模板字符串转换为`基础tokens`，借助于`scanner.js、parseTemplate.js`。

```html
<div>
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
</div>
```

```shell
[
  [ 'text', '<div><ol>' ],
  [ '#', 'students' ],
  [ 'text', '<li>学生' ],
  [ 'text', 'item.name' ],
  [ 'text', '的爱好是<ol>' ],
  [ '#', 'item.hobbies' ],
  [ 'text', '<li>' ],
  [ 'text', '.' ],
  [ 'text', '</li>' ],
  [ '/', 'item.hobbies' ],
  [ 'text', '</ol></li>' ],
  [ '/', 'students' ],
  [ 'text', '</ol></div>' ]
]
```

之后将`基础tokens`转换为`嵌套tokens`。

这里使用的栈结构，而不是递归。