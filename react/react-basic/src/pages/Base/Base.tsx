import React, { useEffect, useRef, useState } from 'react';
import * as styles from './Base.module.less';

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
  const [address, setAddress] = useState('成都');
  // 拖拽对象-图片
  const dragAnimesRef = useRef<HTMLDivElement>(null);
  // 待接纳拖拽对象-衣服
  const dragClothesRef = useRef<HTMLInputElement>(null);
  // 拖拽对象-背景补丁
  const backgroundRef = useRef<HTMLImageElement>(null);
  // 待接纳拖拽对象-背景
  const backgroundPatchRef = useRef<HTMLImageElement>(null);
  // 组件初始化时，添加浏览器监听，因此依赖为空数组
  useEffect(() => {
    // ----- 拖拽：mouse
    const backgroundImg = backgroundRef.current as HTMLImageElement;
    const patchImg = backgroundPatchRef.current as HTMLImageElement;
    // 背景图片左边缘到页面最左侧、上边缘到浏览器最顶部的距离是固定的
    const backgroundLeft = backgroundImg.getBoundingClientRect().left;
    const backgroundTop = backgroundImg.getBoundingClientRect().top;
    // 点击补丁时
    patchImg.addEventListener('mousedown', (e: MouseEvent) => {
      // 鼠标点击位置距离补丁左边缘和上边缘的距离也是固定的
      const patchLeft = e.pageX - backgroundLeft - patchImg.offsetLeft;
      const patchTop = e.pageY - backgroundTop - patchImg.offsetTop;
      function onMove(e: MouseEvent) {
        // 根据两个固定值，计算出图片的位置
        let left = e.pageX - patchLeft - backgroundLeft;
        let top = e.pageY - patchTop - backgroundTop;
        // 限制补丁的移动区域
        if (
          left >= 0 &&
          top >= 0 &&
          top <= backgroundImg.height - patchImg.height &&
          left <= backgroundImg.width - patchImg.width
        ) {
          patchImg.style.left = left + 'px';
          patchImg.style.top = top + 'px';
        }
      }
      // 页面添加事件，模拟拖动补丁
      document.addEventListener('mousemove', onMove);
      // 页面添加事件，拖动补丁释放
      document.addEventListener('mouseup', (e: MouseEvent) => {
        // 移除事件，释放补丁
        document.removeEventListener('mousemove', onMove);
        if (
          patchImg.offsetLeft > 282 &&
          patchImg.offsetLeft < 392 &&
          patchImg.offsetTop > 40 &&
          patchImg.offsetTop < 50
        ) {
          console.log('验证成功！');
        } else {
          console.log('验证失败！');
        }
      });
    });
    // ----- 拖拽：drag
    const animesDiv = dragAnimesRef.current as HTMLDivElement;
    const clothesDiv = dragClothesRef.current as HTMLDivElement;
    animesDiv.addEventListener('dragstart', onDragStart);
    animesDiv.addEventListener('drag', onDrag);
    animesDiv.addEventListener('dragend', onDragEnd);
    clothesDiv.addEventListener('dragenter', onDragEnter);
    clothesDiv.addEventListener('dragover', onDragOver);
    clothesDiv.addEventListener('drop', onDrop);
    let current: HTMLImageElement;
    // 元素拖拽前
    function onDragStart(e: DragEvent) {
      let el = e.target as HTMLElement;
      // 事件冒泡
      if (el.tagName === 'IMG') {
        // 浅拷贝元素，存储当前拖动的元素
        current = el.cloneNode() as HTMLImageElement;
      }
    }
    // 元素拖拽时
    function onDrag(e: DragEvent) {
      let el = e.target as HTMLElement;
      // 事件冒泡
      if (el.tagName === 'IMG') {
        el.className = styles.dragBorderRed;
        clothesDiv.className = styles.dragBorderRed;
      }
    }
    // 元素拖拽后
    function onDragEnd(e: DragEvent) {
      let el = e.target as HTMLElement;
      // 事件冒泡
      if (el.tagName === 'IMG') {
        el.className = styles.dragBorderGreen;
        clothesDiv.className = '';
      }
    }
    // 元素进入区域，且进入时
    function onDragEnter(e: DragEvent) {
      let el = e.target as HTMLDivElement;
      if (el.firstChild) {
        // 避免一直展示第一次拖拽的结果
        el.removeChild(el.firstChild);
      }
    }
    // 元素进入区域，且进入后
    function onDragOver(e: DragEvent) {
      // 阻止浏览器默认行为
      e.preventDefault();
    }
    // 元素进入区域，并触发放置
    function onDrop(e: DragEvent) {
      // 阻止浏览器默认行为
      e.preventDefault();
      let el = e.target as HTMLDivElement;
      current.className = styles.dragImg;
      el.appendChild(current);
    }
    // ----- 图片懒加载
    const images: HTMLImageElement[] = Array.from(
      document.querySelectorAll('img[data-src]'),
    );
    // 1.创建实例
    const observer = new IntersectionObserver(callback);
    images.forEach((img) => {
      // 2.开始观察
      observer.observe(img);
    });
    function callback(entries: IntersectionObserverEntry[]) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          let img = entry.target;
          let src = img.getAttribute('data-src');
          if (src) {
            img.setAttribute('src', src);
            img.removeAttribute('data-src');
            // 3.停止观察
            observer.unobserve(img);
          }
        }
      });
    }
    return () => {
      // 4.释放资源
      observer.disconnect();
    };
  }, []);

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
      <hr />
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
      <hr />
      <p>条件渲染</p>
      {/* 逻辑与 */}
      <div>{flag === 1 && <span>flag为{flag}，显示文本</span>}</div>
      {/* 三目运算符 */}
      <div>{flag === 0 ? <span>为0</span> : <span>非0</span>}</div>
      {/* 函数封装 */}
      <div>{change(2)}</div>
      <hr />
      <p>事件绑定，基本遵循驼峰式命名</p>
      <div>
        <button onClick={baseEvent}>基础绑定，输出事件对象（可选）</button>
        <button onClick={() => printParam('param')}>输出参数</button>
        <button onClick={(e) => printParamAndEvent('param', e)}>
          输出参数和事件
        </button>
      </div>
      <hr />
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
      <hr />
      <p>受控表单绑定</p>
      <div>当前所在地：{address}</div>
      <div>
        <input value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>
      <hr />
      <p>图片懒加载</p>
      <div>
        <img className={styles.baseImg} data-src='/images/portrait.jpg' />
      </div>
      <hr />
      <p>拖拽实现：drag</p>
      <p>拖动你喜欢的图案到衣服上</p>
      <div className={styles.dragOverall}>
        <div ref={dragAnimesRef} className={styles.dragAnimes}>
          <img data-src='/images/portrait_anime_1.jpeg' />
          <img data-src='/images/portrait_anime_2.jpeg' />
          <img data-src='/images/portrait_anime_3.jpeg' />
        </div>
        <div className={styles.dragClothes}>
          <div ref={dragClothesRef}></div>
          <img data-src='/images/t-shirt.jpg' />
        </div>
      </div>
      <hr />
      <p>拖拽实现：mouse</p>
      <p>拖拽图片完成验证</p>
      <div className={styles.mouseOverall}>
        <img
          draggable='false'
          ref={backgroundRef}
          className={styles.mouseBackground}
          data-src='/images/background.png'
        />
        <img
          draggable='false'
          ref={backgroundPatchRef}
          className={styles.mouseBackgroundPatch}
          data-src='/images/background_patch.png'
        />
      </div>
    </div>
  );
}

export default Base;
