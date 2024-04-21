import React from 'react';

const name = 'songyx';
const getAge = function () {
    return 26;
}
const red = '#c1242a';
const list = [
    { id: 1001, name: '张三', age: 20 },
    { id: 1002, name: '李四', age: 30 },
    { id: 1003, name: '王五', age: 40 }

]
let flag = 1;
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
            {/* 变量 */}
            <div>{name}</div>
            {/* 函数调用 */}
            <div>{getAge()}</div>
            {/* 方法调用 */}
            <div>{new Date().getFullYear()}</div>
            {/* JS对象，常用于内联样式 */}
            <div style={{ color: red }}>深红色</div>
            <p>列表渲染</p>
            {/* ES5 */}
            <ul>
                {list.map(function (item) {
                    return <li key={item.id}>姓名：{item.name}、年龄：{item.age}</li>
                })}
            </ul>
            <p>条件渲染</p>
            {/* 逻辑与 */}
            <div>{flag === 1 && <span>flag为{flag}，显示文本</span>}</div>
            {/* 三目运算符 */}
            <div>{flag === 0 ? <span>为0</span> : <span>非0</span>}</div>
            {/* 函数封装 */}
            <div>{change(2)}</div>
        </div>
    );
}

export default App;