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

之后将`基础tokens`转换为`嵌套tokens`，借助于`nestedTokens.js`。

这里巧妙的使用栈和引用，而不是递归。

核心操作包括：

1. 初始化收集器(`collector`)，`collector`初始化为结果数组，栈(`sections`)。
2. 遇见`#`入栈，并清空`collector`，将其放入当前`token`。
3. 遇见`/`出栈，并将`collector`置于栈顶。

获取到嵌套数组后，借助`renderTemplate.js`将其渲染为`dom`字符串，其入参为`tokens`数组和数据。

生成字符串时，根据`#、/、数组`分类讨论。

针对数组，调用`parseArray.js`，其入参为单个`token`和数据。其生成的字符串内容取决于提供的数据，遍历数据时调用`renderTemplate.js`，将单个`token`中的数组再次往后传递。

`renderTemplate.js`与`parseArray.js`的互相调用实现了递归！！