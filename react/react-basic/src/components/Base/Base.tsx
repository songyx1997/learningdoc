import React, { useState } from 'react';

function Base() {
  // 根据React的Hook规则，Hooks只能在函数组件的顶层或者自定义Hook中调用
  // 数组的解构赋值
  const [hobby, setHobby] = useState([
    { id: 1000, text: '骑车' },
    { id: 1001, text: '健身' },
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

  const name = 'songyx';
  const getAge = function () {
    return 26;
  };
  const red = '#c1242a';
  const list = [
    { id: 1001, name: '张三', age: 20 },
    { id: 1002, name: '李四', age: 30 },
    { id: 1003, name: '王五', age: 40 },
  ];
  let flag = 1;
  const change = function (flag: number) {
    switch (flag) {
      case 0:
        return <span>为0</span>;
      case 1:
        return <span>为1</span>;
      default:
        return <span>既非0，也非1</span>;
    }
  };
  // 三种定义方式均可
  function baseEvent(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    console.log('基础绑定，输出事件对象（可选）', e);
  }
  const printParam = function (param: string) {
    console.log('输出参数', param);
  };
  const printParamAndEvent = (
    param: string,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    console.log('输出参数和事件', param, e);
  };

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
          return (
            <li key={item.id}>
              姓名：{item.name}、年龄：{item.age}
            </li>
          );
        })}
      </ul>
      <p>条件渲染</p>
      {/* 逻辑与 */}
      <div>{flag === 1 && <span>flag为{flag}，显示文本</span>}</div>
      {/* 三目运算符 */}
      <div>{flag === 0 ? <span>为0</span> : <span>非0</span>}</div>
      {/* 函数封装 */}
      <div>{change(2)}</div>
      <p>事件绑定，基本遵循驼峰式命名</p>
      <div>
        <button onClick={baseEvent}>基础绑定，输出事件对象（可选）</button>
        <button onClick={() => printParam('param')}>输出参数</button>
        <button onClick={(e) => printParamAndEvent('param', e)}>
          输出参数和事件
        </button>
      </div>
      <p>useState：展示兴趣爱好</p>
      <ul>
        {hobby.map(function (item) {
          return <li key={item.id}>{item.text}</li>;
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
