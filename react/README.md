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

#### 事件绑定

```jsx
function Base() {
    // 三种定义方式均可
    function baseEvent(e) {
        console.log('基础绑定，输出事件对象（可选）', e);
    }
    const printParam = function (param) {
        console.log('输出参数', param);
    }
    const printParamAndEvent = (param, e) => {
        console.log('输出参数和事件', param, e);
    }

    return (
        <div>
            <p>事件绑定，基本遵循驼峰式命名</p>
            <div>
                <button onClick={baseEvent}>基础绑定，输出事件对象（可选）</button>
                <button onClick={() => printParam('param')}>输出参数</button>
                <button onClick={(e) => printParamAndEvent('param', e)}>输出参数和事件</button>
            </div>
        </div>
    );
}

export default Base;
```

#### 组件

`React`中的组件，就是首字母大写的函数。

仅在单个组件内部使用的辅助函数或计算逻辑，可以在组件内部定义，以保持组件的**封装性**和**独立性**。

#### useState

`useState` 是一个`React`内置`hook`，可让你将**状态变量**添加到组件中。

当修改局部变量时，存在两个问题：

1. 局部变量不会在渲染之间持续存在。当`React`第二次渲染此组件时，它会从头开始渲染。
2. 对局部变量的更改不会触发渲染，`React`没有意识到需要用新数据再次渲染组件。

```jsx
// state解决第一个问题、setState解决第二个问题。
const [state, setState] = useState(initialState)
```

```jsx
import React, { useState } from 'react';

function Base() {
    // 根据React的Hook规则，Hooks只能在函数组件的顶层或者自定义Hook中调用
    // 数组的解构赋值
    const [hobby, setHobby] = useState([
        { id: 1000, text: '骑车' },
        { id: 1001, text: '健身' }
    ]);
    function addDirect() {
        // 局部变量变化，但是页面渲染不变
        hobby.push({ id: 1002, text: '徒步' });
        console.log(hobby);
    }
    function addBySet() {
        let tmp = [...hobby, { id: 1002, text: '徒步' }];
        // 状态的行为类似于快照。更新状态，则执行渲染。
        // hobby仍然为旧值（注意：并不是不变，而且为旧值！）
        setHobby(tmp);
        console.log(hobby);
    }

    return (
        <div>
            <ul>
                {hobby.map(function (item) {
                    return <li key={item.id}>{item.text}</li>
                })}
            </ul>
            <div>
                <button onClick={addDirect}>直接添加</button>
                <button onClick={addBySet}>借助set添加</button>
            </div>
        </div>
    );
}

export default Base;
```

#### classnames

一个`JS`库，通过条件动态控制`class`类名。

```shell
npm install classnames
```

```tsx
import classNames from 'classnames';

const buttonClass = classNames(
  // 基础类名
  'button',
  // 如果isActive为true，则添加'button--active'类
  { 'button--active': isActive }
);
```

`classnames`也可以和`css module`结合，写法上有所变化。

```tsx
<a
  className={classNames({ [styles.commentLinkActive]: sortType })}
  onClick={() => sortByPraiseNum()}
/>
```

#### 受控表单绑定

类似于`Vue`中的双向绑定，但实现方式略有不同。

```tsx
import React, { useState } from 'react';

function Base() {
  const [address, setAddress] = useState('成都');

  return (
    <div>
      <div>当前所在地：{address}</div>
      <div><input value={address} onChange={(e) => setAddress(e.target.value)} /></div>
    </div>
  );
}

export default Base;
```

#### 获取DOM

借助于钩子函数`useRef`，给`DOM`节点添加标记，建立起隔离，和`Vue3`中的`ref`是非常相似的。

```tsx
import React, { useRef } from 'react';

function Comment() {
  // 创建ref对象，以绑定至DOM，初始值为null
  // 指定类型为HTMLInputElement，避免ts报错
  const commentRef = useRef<HTMLInputElement>(null);

  function publicComment() {
    let input = commentRef.current;
    if (input && input.value && input.value.trim()) {
      // ...
    }
  }

  return (
    <div>
      <input ref={commentRef} />
    </div>
  );
}

export default Comment;
```

#### 组件通信

##### 父传子

`props`可以传递任意类型的数据：数字、字符串、布尔值、数组、对象、函数、`JSX`。

```tsx
{/* 父组件 */}
<CommentItem item={item} tips={<span>测试</span>} />
```

```tsx
// 子组件
function Component(props: { item: CommentItemEntity; tips: ReactElement }) {
  return <div>{props.tips}</div>;
}
```

上述实现，也可以借助`props.children`属性，与`Vue`的默认插槽很像。

```tsx
{/* 父组件 */}
<CommentItem item={item}>
  <span>测试</span>
</CommentItem>
```

```tsx
// 子组件
function Component(props: { item: CommentItemEntity; children: ReactElement }) {
  return <div>{props.children}</div>;
}
```

和`Vue`中一样，`props`是只读的，通信是单向的。

##### 子传父

核心思路：在子组件中调用父组件中的函数，并将子组件中的数据作为入参。

```tsx
// 父组件
function getComments(comments: Array<string>) {
  console.log('子组件包括以下评论', comments);
}

function Comment() {
  // 传递方法
  return <CommentItem onGetComments={getComments} />;
}
```

```tsx
// 子组件
const comments = ['text'];
function Component(props: { onGetComments: Function }) {
  // 调用，入参
  return <div onClick={() => props.onGetComments({ comments })}>获取</div>;
}
```