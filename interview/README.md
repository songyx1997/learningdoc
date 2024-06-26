#### 什么是`CSRF`？如何避免？

`CSRF`攻击的大致方式如下：某用户登录了A网站，认证信息保存在`cookie`中。当用户访问攻击者创建的B网站时，攻击者通过在B网站发送一个伪造的请求提交到A网站服务器上，让A网站服务器误以为请求来自于自己的网站，于是执行响应的操作。

除了使用`token`外，可采用的方式：

1. 基于用户交互的验证：敏感操作，需要验证码，或者进行二次认证。
1. 敏感请求使用`post`：因为`GET`请求很容易被嵌入到链接或图片标签中发起。
1. 检查`Referer`头：服务器可以根据此头判断请求是否来自于预期的域名。但是这种方法并不十分可靠，因为`Referer`头可能被浏览器设置、隐私插件或中间代理所屏蔽或篡改，并且不能用于保护`HTTPS`到`HTTP`的请求（因为这些请求默认不会携带`Referer`头）。
1. 检查`Origin`头：对于支持`CORS（跨源资源共享）`的现代浏览器，可以通过检查`Origin`头来确定请求的来源域是否与预期相符。
1. 使用`Cookie`的`SameSite`属性：将该属性设置为`Strict`，可以阻止浏览器在跨域请求中携带这些`Cookie`。

#### 什么是三次握手？

1. 客户端发送`SYN`。
2. 服务端发送`SYN+ACK`（`ACK`是客户端的`SYN`+1，这样客户端收到`ACK`时，`-1`就可以知道自己发送的`SYN`是否得到响应）。
3. 客户端发送`ACK`（因为服务端无法确认自己发送的`ACK`是否被客户端接收了，需要客户端再发送一次请求，建立连接，其值为服务端序号+1）。

**确认号`ACK`都是根据序号`SYN`+1得到的。**

<div style="margin:0 auto;border:2px solid #42b883">
    <img src=".\三次握手.png">
</div>

#### 什么是四次挥手？

TCP连接是双向的，即全双工通信，因此关闭连接时需要独立地关闭连接的两个方向，这就是为什么需要四次挥手而非两次的原因。

1. 客户端发送`FIN+ACK`。
2. 服务端响应`ACK`（表示确认收到了客户端的关闭请求，此时从客户端到服务器的方向已经停止数据传输）。
3. 服务端发送`FIN+ACK`（表示服务器也完成了数据发送任务）。
4. 客户端响应`ACK`。

<div style="margin:0 auto;border:2px solid #42b883">
    <img src=".\四次挥手.png">
</div>

#### 什么是XSS攻击？如何避免？

`XSS`攻击被称为跨站脚本攻击，包括三种类型：

1. 反射型：黑客`URL` > 用户检索该`URL` > 服务器无过滤，不保存 > 服务器反射信息 > 执行脚本。由于`URL`的一部分被展示在页面中，如果服务器没有对`URL`进行过滤，当`URL`中包含`js`脚本时，就会被执行。
2. 存储型：常见于可以发表评论的网站。恶意脚本作为评论 > 服务器无过滤，存储 > 每个用户正常访问，都被迫看到有恶意代码的评论 > 浏览器执行恶意代码。
3. `DOM`型：黑客寻找源码中是否有可操作的**属性**与**方法**。在`URL`中添加脚本修改操作该属性的方法。

如何避免？

1. 对**用户输入**进行过滤，过滤非法字符。
2. `html`转义，如`JavaScript`的`encodeURI()`，`encodeURIComponent()`。
3. 限制输入长度。
4. `cookie`设置`HttpOnly`和`SameSite`。

#### for-in和for-of的区别？

`for-in`会遍历对象的所有可枚举`（enumerable：true）`属性（包括**原型链**上的属性），并且属性名的顺序是不确定的。

如果你只想遍历对象的自身属性，可以使用 `Object.keys()` 方法来获取对象的所有键名，然后使用 `for-of` 循环来遍历这些键名对应的值。

`for-of`用于遍历可迭代对象的每一个元素。

#### 为什么需要虚拟DOM？

<div style="margin:0 auto;border:2px solid #42b883">
    <img src=".\虚拟DOM.png">
</div>

从上图可以看出，使用原生js的效率是否更高？

当数据变化时，原生`js`无法确切知道是哪一块发生了变化，会去重新生成全部真实`DOM`，完成更新。

1. 框架设计。使用框架时，当数据发生变化。为了确定应该修改哪个`DOM`。框架全量生成新的虚拟`DOM`树，与之前的虚拟`DOM`树使用`diff`算法，计算出需要更新的真实`DOM`。
2. 跨平台。虚拟`DOM`是一个普通对象来表达`UI`界面，最后根据平台生成真实`DOM`。

#### JS中的计时是否精确？

1. 浏览器，浏览器本身不会计时，而是调用操作系统的计时接口。也就是说，计时在操作系统层面的实现就存在差异。
2. `W3C`标准，当计时的嵌套`>=5`时，即使将时间间隔均设置为`0`，最小仍然是`4ms`。
3. 事件循环，回调函数被加入宏任务，当到达时间时，按理说需要执行。但是执行的前提，需要将执行栈中的代码全部执行完毕。

#### 性能优化指标？

1. 首屏加载时间`(FCP-First Contentful Paint)`：首次内容绘制时间，指浏览器首次绘制页面中至少一个元素的时间。
2. 最大内容绘制时间`(LCP-Largest Contentful Paint)`：最大内容绘制时间，指页面上最大的可见元素绘制完成的时间。

#### 首屏加载优化？

1. `CDN`（内容分发网络）加速，利用`CDN`缓存静态资源。当前端项目采用微前端时，每一个项目都会使用`Vue`、`vuex`、`vue-router`，如果都打包会造成重复，而且这些依赖的打包体积较大。这些资源就可以放在`CDN`上，这样当访问应用的不同微前端模块时，就可以公用同一份，且这一份是存在缓存的。
2. 图片懒加载、路由懒加载（`webpack`的代码分割）。
3. 小图片的合并或编译为`Base64`格式，减少`HTTP`请求次数。
4. `webpack`代码压缩。
5. `HTTP`缓存：强缓存`(Cache-Control: max-age=3600)`、协商缓存`(Last-Modified: Wed, 21 Oct 2020 07:28:00 GMT)`。
6. 预加载`(preload)`：暗中加载当前页面的资源，存在浏览器兼容问题。
7. 首屏内容优先级标记：关键`js、css`优先加载，其他采用懒加载。并且`js`的加载使用`defer`标记，异步加载。
8. 针对低版本浏览器，`babel`常常会导致较大的打包体积。因此可以采用两份打包结果（一份高版本、一份低版本），根据用户的环境，在`HTML`中引入不同的文件。

```html
<!-- 为支持模块的现代浏览器提供ES6模块 -->
<script type="module" src="modern-browser-module.js"></script>
<!-- 为不支持模块的老式浏览器提供传统脚本 -->
<script nomodule src="legacy-browser-script.js"></script>
```

#### 交通灯问题？

设计一个红绿灯，初始化为红灯，`20s`后切换为黄灯，`3s`后切换为绿灯，`10s`后切换为黄灯，`3s`后切换为红灯，循环往复。

该问题，首先可以使用计时器，但是考虑到计时器是不准确的，因此采用**问询**的方式。

#### 为什么要使用HTTPS？

1. `HTTP`无法保证数据的机密性。使用`HTTPS`增加了中间人破解数据的难度（即使加密方式为对称加密，也比不加密要好）。
2. `HTTP`保证不了数据的完整性。假如使用了非对称加密，中间人截获了网站的公钥，并自己生成一份公钥和私钥，并将公钥发送给客户，客户将数据用中间人的公钥加密，这样中间人就可以直接解密得到客户的数据，并将数据篡改，再用网站的公钥加密，发送给网站。
<div style="margin:0 auto;border:2px solid #42b883">
    <img src=".\非对称加密的问题.png">
</div>

3. `HTTP`无法进行身份验证。用户无法确认访问的是不是官网，而`CA`在颁发证书前会进行网站信息的检查。

#### CA数字证书的原理？

首先，网站的公钥被`CA`进行哈希运算。然后`CA`用自己的**私钥**加密哈希后的字符串，形成**数字签名**，数字证书包括数字签名和网站的公钥，`CA`将数字证书发送给客户。

<div style="margin:0 auto;border:2px solid #42b883">
    <img src=".\数字证书的原理_1.png">
</div>

客户获取数字证书后，用户使用`CA`的公钥**(预装在浏览器环境内)**对数字证书中的数字签名进行解密，得到哈希字符串，并将数字证书中网站的公钥进行哈希运算，将两个哈希字符串进行对比，若一致，则说明数字证书未被中间人修改。

<div style="margin:0 auto;border:2px solid #42b883">
    <img src=".\数字证书的原理_2.png">
</div>
#### 浏览器渲染页面的过程？

首先生成`DOM`树，通过`HTTP`请求获取到页面的内容**(字节格式)**，浏览器将其翻译为`HTML`文本。之后解析，将其转换为`token`，再转换为`DOM`节点，最后用节点生成`DOM`树。

tips：`mustache`模板引擎也是类似的方式，技术都是互通的！

<div style="margin:0 auto;border:2px solid #42b883">
    <img src=".\生成DOM树.png">
</div>

当解析`HTML`时，遇到`<link href="./style.css" rel="stylesheet">`，就会去生成`CSSOM`树，该过程与`DOM`树的生成基本一致。

当`DOM`树与`CSSOM`树生成完毕后，二者结合生成`渲染树`。因此`CSS`阻塞`HTML`解析是指`CSSOM`阻塞渲染树的生成。

渲染树生成完毕后，页面仍然为空。浏览器需要根据每个元素的盒子模型，进行`布局`。

浏览器把渲染树，进行像素`绘制`。

需要注意的是，`HTML`解析时，当遇到引入外部`js`文件时，若未设置`async(异步)`或`defer(推迟)`，则`js`会直接阻塞`HTML`解析，只有当`js`完全解析并**执行**完，`HTML`才会继续解析，才能生成`DOM`树。也就是说，未设置`async(异步)`或`defer(推迟)`的`js`会阻碍`DOM`树的创建。

<div style="margin:0 auto;border:2px solid #42b883">
    <img src=".\浏览器渲染.png">
</div>

当`js`既可以修改`DOM`，又可以修改`CSS`时，`js`下载完成并执行，就会导致最后的三步再次执行，即使之前已经完成了。这也是为什么有一种现象：页面中的元素一开始加载出来了，但是之后却消失了。解决方案就是，这种类型的`js`文件需要使用`defer`。

需要注意：`defer`脚本的执行时机确保了脚本可以在渲染过程开始前安全地操作`DOM`，但其与`CSSOM`的完整构建时间点之间的关系依赖于`CSS`的加载和解析进度。为了确保脚本能够可靠地访问`CSSOM`，最佳做法仍然是将依赖样式的脚本放在页面底部或使用`window.onload`事件来确保所有资源`(包括CSS)`都已加载完毕。

#### async和defer的区别？

相同点：二者都不影响`HTML`的解析，也就是`DOM`树的构建。

`async(异步)`，仅适合第三方脚本。因为`js`的下载和执行是未知的，可能在`DOM`构建完成之前。假如`js`中含有操作`DOM`的操作，因为`DOM`构建还未完成，就会导致操作失败。

`defer(推迟)`，当`DOM`构建完成后，`js`再执行，因此适合包含操作`DOM`的外部`js`文件。

<div style="margin:0 auto;border:2px solid #42b883">
    <img src=".\async和defer.png">
</div>
#### 图片懒加载？

##### 计算高度差

比较元素相对于视口顶部的距离`el.getBoundingClientRect().top`、视口高度`window.innerHeight`的大小。若前者小于后者，说明图片进入视口，将`data-src`修改为`src`。

```less
// Base.module.less
.baseBackground {
  // 将高度填满，便于计算元素位置
  height: 400px;
  border-radius: 5px;
}

.baseImg {
  height: 300px;
  border-radius: 5px;
  margin-top: 5px;
}
```

```tsx
import React, { useEffect } from 'react';
import * as styles from './Base.module.less';
import throttle from '@/utils/throttle';

function Base() {
  // 组件初始化时，添加浏览器监听，因此依赖为空数组
  useEffect(() => {
    const images: HTMLImageElement[] = Array.from(
      document.querySelectorAll('img[data-src]'),
    );
    function lazyLoad() {
      images.forEach((img: HTMLImageElement) => {
        // 元素相对于视口顶部的距离
        let imgTop = img.getBoundingClientRect().top;
        if (imgTop <= window.innerHeight) {
          // 说明图片进入视口
          let src = img.getAttribute('data-src');
          if (src) {
            img.setAttribute('src', src);
            img.removeAttribute('data-src');
          }
        }
      });
    }
    // 先调用一次。即初始化时，图片已位于视口中
    lazyLoad();
    // 使用节流
    const throttledLazyLoad = throttle(lazyLoad, 150);
    window.addEventListener('scroll', throttledLazyLoad);
    return () => {
      // 组件销毁时，移除事件监听
      window.removeEventListener('scroll', throttledLazyLoad);
    };
  }, []);

  return (
    <div>
      <div>
        <img
          className={styles.baseBackground}
          data-src='/images/background.png'
        />
      </div>
      <div>
        <img className={styles.baseImg} data-src='/images/portrait.jpg' />
      </div>
    </div>
  );
}

export default Base;
```

缺点：即使使用了节流，浏览器滚动时，仍然会触发事件，造成资源浪费。

##### IntersectionObserver

`intersection`意为交叉点。

在`Can I use`中，`96.92%`的浏览器支持该`API`，注意`IE`完全不支持。

```tsx
useEffect(() => {
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
```

#### 拖拽？

##### drag

`HTML5`引入了原生的拖放`API`，存在浏览器兼容问题。

将元素`A`拖动至目标元素`B`中。

针对`A`，拖动时的事件如下：

`dragstart(开始)`，当元素`A`存在多个时，可在该事件中进行拷贝记录。

```typescript
let current: HTMLImageElement;
function onDragStart(e: DragEvent) {
  let el = e.target as HTMLElement;
  // 事件冒泡
  if (el.tagName === 'IMG') {
    // 浅拷贝元素，存储当前拖动的元素
    current = el.cloneNode() as HTMLImageElement;
  }
}
```

`drag(进行中)`，拖动元素`A`时，进行区域标记。

```typescript
function onDrag(e: DragEvent) {
  let el = e.target as HTMLElement;
  // 事件冒泡
  if (el.tagName === 'IMG') {
    el.className = styles.dragBorderRed;
    clothesDiv.className = styles.dragBorderRed;
  }
}
```

`drag(结束)`，拖动元素`A`结束时，取消区域标记。

针对`B`，当元素`A`进入区域`B`时。

`dragenter(进入时)`，当元素`A`存在多个时，对于已经放入区域`B`的元素`A`进行清除。

```typescript
function onDragEnter(e: DragEvent) {
  let el = e.target as HTMLDivElement;
  if (el.firstChild) {
    // 避免一直展示第一次拖拽的结果
    el.removeChild(el.firstChild);
  }
}
```

`dragover(进入后)`，需清除浏览器默认事件。

```typescript
function onDragOver(e: DragEvent) {
  // 阻止浏览器默认行为
  e.preventDefault();
}
```

`dragleave(离开)`

`drop(放置)`，将元素`A`放入区域`B`。

```typescript
function onDrop(e: DragEvent) {
  // 阻止浏览器默认行为
  e.preventDefault();
  let el = e.target as HTMLDivElement;
  current.className = styles.dragImg;
  el.appendChild(current);
}
```

##### mouse