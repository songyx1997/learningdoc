<table>
    <tr>
        <td>title：react</td>
        <td>author：songyx</td>
        <td>date：2024/04/21</td>
    </tr>
</table>

### 基础

#### JSX

`JS`的语法扩展，在大括号`{}`中编写`JS表达式`，如变量、函数和方法调用、`JS`对象。

```jsx
const name = 'songyx';
const getAge = function () {
    return 26;
}
const red = '#c1242a';

function App() {
    return (
        <div>
            {/* 变量 */}
            <div>{name}</div>
            {/* 函数调用 */}
            <div>{getAge()}</div>
            {/* 方法调用 */}
            <div>{new Date().getFullYear()}</div>
            {/* JS对象，常用于内联样式 */}
            <div style={{ color: red }}>深红色</div>
        </div>
    );
}
```

#### 列表渲染

列表渲染使用的原生`JS`中数组的`Map`方法。

```jsx
const list = [
    { id: 1001, name: '张三', age: 20 },
    { id: 1002, name: '李四', age: 30 },
    { id: 1003, name: '王五', age: 40 }

]

function App() {
    return (
        <div>
            <ul>
                {list.map(function (item) {
                    return <li key={item.id}>姓名：{item.name}、年龄：{item.age}</li>
                })}
            </ul>
        </div>
    );
}
```

#### 条件渲染

条件渲染可以使用逻辑与`&&`、三目运算符。

```jsx
let flag = 1;

function App() {
    return (
        <div>
            {/* 逻辑与 */}
            <div>{flag === 1 && <span>flag为{flag}，显示文本</span>}</div>
            {/* 三目运算符 */}
            <div>{flag === 0 ? <span>为0</span> : <span>非0</span>}</div>
        </div>
    );
}
```

当条件渲染过于复杂时，应该使用函数封装，`if-else`或者`switch`。

```jsx
const change = function (flag) {
    switch (flag) {
        case 0:
            return <span>为0</span>;
        case 1:
            return <span>为1</span>;
        default:
            return <span>既非0，也非1</span>;
    }
}

function App() {
    return (
        <div>
            <div>{change(2)}</div>
        </div>
    );
}
```