<table>
    <tr>
        <td>title：html+css+js</td>
        <td>author：songyx</td>
        <td>date：2022/02/10</td>
    </tr>
</table>

#### 1. HTML

##### 基本结构

乱码：编码与解码所采用的字符集不同。

```html
<!-- 文档声明用于告诉浏览器当前网页的版本 -->
<!DOCTYPE html>
<!-- 规定网页的语言 -->
<html lang="zh">
    <head>
        <!-- 告知浏览器网页的字符集，避免乱码 -->
        <meta charset="utf-8">
        <!-- 搜索引擎通过title判断网页主要内容，搜索结果的超链接 -->
        <title>网页的标题</title>
    </head>
    <!-- 网页的主体 -->
    <body></body>
</html>
```

##### 实体

用于书写特殊符号（不换行空格：`&nbsp`、大于：`&gt`、小于：`&lt`）。

##### meta

```html
<meta name="keywords" content="网站的关键字">
<meta name="description" content="搜索引擎的搜索结果">
```

##### block、inline

行内元素一般放在块元素内部。`<p>`中不能放入任何块元素。`<a>`中可以放入除自身外的任何元素。

块元素总会独占一行，即使规定了宽和高。默认宽度为父元素全部，默认高度为子元素最高高度，垂直方向会发生外边距合并。

行内元素不支持设置宽度和高度，垂直方向的内边距、外边距、边框并不影响布局。

##### a

```html
<a href="" target="_self">默认值，在当前页面中打开链接</a>
<a href="" target="_blank">在新标签页中打开链接</a>
<a href="#">回到当前页面的顶部</a>
<a href="#id">跳转到指定元素的位置</a>
```

##### img

```html
<img src="" alt="图片描述，加载失败时显示，搜索引擎通过该字段查询">
```

##### audio、video

```html
<!-- 音频（可控、自动播放、循环播放） -->
<audio src="" controls autoplay loop></audio>
<!-- 浏览器不兼容时可显示替换文本 -->
<audio controls>
    <source src="" type="">
    请升级浏览器
</audio>
```

`<video>`使用方式基本与`audio`相同。

#### 2. CSS

##### CSS样式表

多文件引用该样式表，由于浏览器的缓存机制，只需加载一次。

##### 选择器

| 类型                                                         | 说明                                                     |
| ------------------------------------------------------------ | -------------------------------------------------------- |
| *                                                            | 通配选择器，选中页面的全部元素                           |
| （element1element2）                                         | 交集选择器                                               |
| （element1，element2）                                       | 并集选择器                                               |
| （'空格'，'>'，'+'，'~'）                                    | 关系选择器，祖宗与后代、父与子、临近兄弟、普通兄弟       |
| [属性名]，[属性名=属性值]，[属性名^=属性值]，[属性名$=属性值]，[属性名*=属性值] | 属性选择器，指定值、指定值开头、指定值结尾、指定值为子串 |

##### 伪类

描述一个元素的特殊状态。

排序伪类：`:nth-child(1)`(所有元素排序)、`:nth-of-type`(同类型元素排序)。

否定伪类：`:not(selector)`，如`:not(:nth-of-type(3))`(除了同类型的第3个元素)。

超链接伪类：`:link`(未访问)、`:visited`(已访问、只能修改颜色)、`:hover`(鼠标悬停)、`:active`(已选择)。hover 必须在 CSS 定义中的 link 和 visited 之后，才能生效。active 必须在 CSS 定义中的 hover 之后才能生效。伪类名称对大小写不敏感。

##### 伪元素

设置元素指定部分的样式。`::before`与`::after`中必须包含`content`。

##### 优先级

内联>id>类和伪类>元素>*>继承的样式。背景相关的，布局相关的样式等无法被继承。

背景相关的，布局相关的样式等无法被继承（inherited）。选择器优先级：内联>id>类和伪类>元素>*>继承的样式

```css
.son {
    /* 获取到最高的优先级 */
    background-color: red !important;
}
```

##### em、rem

em（1em=1fontSize）是相对于字体大小来计算，rem相对于根元素的字体大小。常用于移动端大小适配。

##### 盒子模型

[外边距合并问题](https://www.w3school.com.cn/css/css_margin_collapse.asp)、[盒子模型](https://www.w3school.com.cn/css/css_boxmodel.asp)

```css
.son {
    /* 水平偏移量，垂直偏移量，阴影的模糊半径，阴影颜色 */
    box-shadow: 10px -20px 5px rgba(0, 0, 0, 0.2);
    /* 圆形 */
    border-radius: 50%;
}
```

##### 浮动

脱离文档流的特点：不独占一行、宽高可设置、默认宽高取决于内容（无论块元素与行内元素）。

清除浮动：清除浮动元素对当前元素的影响。原理：设置清除浮动后，浏览器会自动为元素添加上外边距。

```html
<html>
<body>
    <div class="father"></div>
    <div class="uncle"></div>
</body>
</html>
<style>
    .father {
        float: left;
        width: 200px;
        height: 200px;
        background-color: red;
    }
    .uncle {
        /* 元素未上移 */
        clear: left;
        width: 300px;
        height: 300px;
        background-color: skyblue;
    }
</style>
```

高度塌陷：浮动布局中，父元素高度默认由子元素撑开。当子元素浮动后，父元素高度丢失，父元素之后的元素上移。

```html
<html>
<body>
    <div class="father">
        <div class="son"></div>
    </div>
    <div class="uncle"></div>
</body>
</html>
<style>
    .father {
        border: 10px orange solid;
    }
    .son {
        float: left;
        width: 200px;
        height: 200px;
        background-color: red;
    }
    .uncle {
        width: 300px;
        height: 300px;
        background-color: skyblue;
    }
</style>
```

BFC：块级格式化环境。

开启BFC的元素的特征：不会被浮动元素所覆盖、与父元素外边距不重叠、可包含浮动的子元素。

```css
.father {
    border: 10px orange solid;
    /* 父元素不可见宽消失，下方元素上移 */
    float: left;
    /* 父元素不可见宽消失，下方元素未上移 */
    display: inline-block;
    /* 最佳方式 */
    overflow: hidden;
}
```

除启动BFC外，最完美的方式为（伪类+清除浮动）。

```css
/* 既可以解决高度塌陷（after+全部三行），又可以解决外边距重叠（before+前两行） */
.father::before,
.father::after {
    content: '';
    display: table;
    clear: both;
}
```

##### 定位

包含块（containing block）：离自己最近的开启了定位的祖先元素，初始包含块为`<HTML>`。

绝对定位元素相对于其包含块进行定位，因此相对定位常用于作为绝对定位的参考系使用。

```html
<html>
<body>
    <div class="father">
        <div class="son"></div>
    </div>
</body>
</html>
<style>
    .father {
        width: 400px;
        height: 400px;
        background-color: orange;
        position: relative;
    }
    .son {
        width: 100px;
        height: 100px;
        background-color: red;
        position: absolute;
        /* 水平居中 */
        margin: auto;
        /* 垂直居中 */
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
</style>
```

##### 字体

字体类别：`serif`（衬线字体）、`sans-serif`（非衬线字体）、`monospace`（等宽字体）。一般放于`font-family`最后，用于兜底。

单行文字垂直居中：`line-height=height`。

字体的垂直对齐：`vertical-align`（top、bottom、middle），也可用于元素垂直居中（不常用）。

```html
<html>
<body>
    <div class="father">
        <div class="son"></div>
    </div>
</body>
</html>
<style>
    .father {
        width: 400px;
        height: 400px;
        background-color: orange;
        /* 垂直居中 */
        display: table-cell;
        vertical-align: middle;
    }
    .son {
        width: 100px;
        height: 100px;
        background-color: red;
        /* 水平居中 */
        margin: 0auto;
    }
</style>
```

文字溢出时显示为省略号，四种属性缺一不可。

```css
.father {
    width: 100px;
    /* 空白处理：不换行 */
    white-space: nowrap;
    overflow: hidden;
    /* 文字溢出显示方式：省略号 */
    text-overflow: ellipsis;
}
```

`text-decoration`用于设置或删除文本装饰。`text-transform`用于指定文本中的大写和小写字母。`text-shadow`为文本添加阴影，依次为水平阴影、垂直阴影、模糊效果、阴影颜色。`font-style`主要用于指定斜体文本。

```css
p {
    text-decoration: underline;
    text-transform: uppercase;
    text-shadow: 2px 2px 5px red;
    font-style: italic;
}
```

##### 背景

```css
body {
    background-image: url("tree.png");
    /* 不重复（no-repeat）、水平重复（repeat-x）、垂直重复（repeat-y） */
    background-repeat: no-repeat;
    /* 不随页面滚动（fixed）、随页面滚动（scroll） */
    background-attachment: fixed;
    /* 铺满元素（cover）、在元素中完整显示图片（contain），类似于img中的object-fit */
    background-size: contain;
    /* 指定位置（水平偏移、垂直偏移），常用于雪碧图。也可以指定方位：左上（left top） */
    background-position: 50px 100px;
}
```

##### 宽度

`max-width`窗口缩小至指定宽度内时，元素宽度随着窗口大小变化。`min-width`窗口缩小至指定宽度内时，元素宽度保持不变，出现水平滚动条。

##### transition

鼠标悬停时元素的显示效果。

```css
.div {
    /* 属性名、持续时间、速度曲线、延迟时间 */
    transition: property duration timing-function delay;
}
```

##### animation

```css
div {
    /* 关键帧、持续时间、速度曲线、延迟时间、播放次数（数值n、无限infinite）、是否反向播放（默认否normal、是alternate） */
    animation: name duration timing-function delay iteration-count direction;
}
```

动画实现：雪碧图宽度为456px，包括四个动作。因此宽度为114px、速度曲线为steps(4)。

```html
<html>
<body>
    <div class="box"></div>
</body>
</html>
<style>
    .box {
        width: 114px;
        height: 138px;
        background-image: url('./sprite.jpg');
        animation: example 1s steps(4) infinite;
    }
    @keyframes example {
        from {
            background-position: 0 0;
        }
        to {
            background-position: -456px 0;
        }
    }
</style>
```

##### transform

`transform: translate(50px,100px)`从其当前位置向右移动50个`px`，并向下移动100个`px`。

绝对定位使元素水平垂直居中存在的问题：子元素若未定义宽高，宽高通过内部元素填充获得，则该方法失效。但可以通过转换进行优化。

```html
<html>
<body>
    <div class="father">
        <div class="son">通过内部元素填充宽高</div>
    </div>
</body>
</html>
<style>
    .father {
        width: 400px;
        height: 400px;
        background-color: orange;
        position: relative;
    }
    .son {
        background-color: red;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>
```

`rotateX()`绕`x`轴旋转。`rotateY()`绕`y`轴旋转。`rotateZ()`括号内为正则顺时针旋转，括号内为负则逆时针旋转。

实现时钟动画效果。

```html
<html>
<body>
    <div class="panel">
        <div class="second-box">
            <div class="second"></div>
        </div>
    </div>
</body>
</html>
<style>
    .panel {
        width: 300px;
        height: 300px;
        margin: 100px auto;
        border: 5px solid black;
        border-radius: 50%;
        position: relative;
    }
    .panel > div {
        margin: auto;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
    .second-box {
        width: 100%;
        height: 100%;
        animation: run 60s steps(60)infinite;
    }
    .second {
        width: 2px;
        height: 50%;
        margin: 0 auto;
        background-color: red;
    }
    @keyframes run {
        from {
            transform: rotateZ(0);
        }
        to {
            transform: rotateZ(360deg);
        }
    }
</style>
```

`scale(2,3)`元素增大为其原始宽度的两倍和其原始高度的三倍，可用于实现按钮、图片放大。

```html
<html>
<body>
    <div class="box">BUY!</div>
</body>
</html>
<style>
    .box {
        margin: 100px;
        width: 60px;
        font-size: 20px;
        background-color: #d2e395;
        border-radius: 10px;
        text-align: center;
        vertical-align: middle;
        transition: transform 2s, background-color 1s;
        cursor: pointer;
        /* 指定变形的原点，默认为center */
        transform-origin: 0 0;
    }
    .box:hover {
        transform: scale(2, 2);
        background-color: #22c9e2;
    }
</style>
```

##### flex

容器相关：

`flex-direction`定义父元素要在哪个方向上堆叠 flex 项目，依次为：从左到右、从右到左、从上到下、从下到上。

`flex-wrap`规定是否应该对 flex 项目换行，依次为：默认不换行、必要时进行换行、相反顺序换行。

```css
.box {
    display: flex;
    flex-direction: row | row-reverse | column | column-reverse;
    flex-wrap: nowrap | wrap | wrap-reverse;
}
```

`justify-content`定义了项目在主轴（水平方向）上的对齐方式，依次为：默认左对齐、右对齐、居中、项目之间的间隔都相等、每个项目两侧的间隔相等。

```css
.box {
    display: flex;
    justify-content: flex-start | flex-end | center | space-between | space-around;
}
```

`align-items`定义项目在交叉轴（竖直方向）上的对齐方式，依次为：默认占满整个容器的高度、交叉轴的起点对齐、交叉轴的终点对齐、交叉轴的中点对齐、项目的第一行文字的基线对齐。

```css
.box {
    display: flex;
    align-items: stretch | flex-start | flex-end | center | baseline;
}
```

由于换行产生了多条水平轴线，`align-content`定义了多根轴线的对齐方式，依次为：与交叉轴的起点对齐、与交叉轴的终点对齐、与交叉轴的中点对齐、轴线之间的间隔平均分布、每根轴线两侧的间隔都相等、默认轴线占满整个交叉轴。

```CSS
.box {
    display: flex;
    flex-wrap: wrap align-content: flex-start | flex-end | center | space-between | space-around | stretch;
}
```

项目相关：

`order` 定义项目的排列顺序。数值越小，排列越靠前，默认为0。

`flex-grow` 规定某个项目相对于其余项目将增长多少，默认为0。

`flex-shrink` 规定某个项目相对于其余项目将收缩多少，默认为1。如果一个项目的 flex-shrink 属性为0，其他项目都为1，则空间不足时，前者不缩小。

`flex-basis`规定项目的初始长度，默认值为`auto`，即项目的本来大小。

`flex: 1`或者`flex: auto`相当于`flex-grow: 1; flex-shrink: 1; flex-basis: auto`。

```css
.item {
    width: 200px;
    height: 200px;
    order: 2;
    flex: 1 1 auto;
}
```

`align-self`允许单个项目有与其他项目不一样的对齐方式，可覆盖`align-items`。默认值为`auto`，表示继承父元素的`align-items`属性，如果没有父元素，则等同于`stretch`。

```css
.item {
    align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```

##### viewport

默认情况下，移动端的网页都会将视口`viewport`设置为980像素。如果网页设置宽度超过了980像素，移动端则会对网页进行缩放以完整显示网页。

```html
<!-- 将网页视口设置为完美视口，无该设置则为默认情况，移动端适配必须设置完美视口 -->
<meta name="viewport" content="width=device-width,initial-scale=1.0">
```

移动端设计图纸宽度为750px，通过`vw`适配，(100vw/750px)*100=13.333，为了方便编写，可借助`less`。

```html
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
</head>
<body>
    <div class="box"></div>
</body>
<style>
    html {
        font-size: 13.333vw;
    }
    .box {
        width: 7.5rem;
        height: 100px;
        background-color: orange;
    }
</style>
```

#### 3. LESS

##### 变量

变量的使用遵循就近原则。

```less
@basewidth: 100px;
@basewidth: 200px;
@mkdir: myImgs;

div {
    width: @basewidth;
    height: 200px;
    line-height: $height;
    background-image:url('/@{mkdir}/img1.jpg');
}
```

##### 嵌套

`&`表示当前选择器的父级。

```less
.box {
    color: black;
    >a {
        color: red;
        &:hover {
            color: orange;
        }
    }
    &-subBox {
        color: pink;
    }
}
```

##### extend

```less
.father {
    width: 100px;
    height: 100px;
}
.mother {
    color: red;
    font-size: 16px;
}
.son:extend(.father, .mother) {
    margin: 0 auto;
}
```

##### mixins

```less
.father {
    color: red;
}
.son {
    .father;
    margin: 0 auto;
}
```

混合函数可以定义参数，并可设置参数默认值。

```less
.standard-box(@width, @height, @backgroundColor: red) {
    width: @width;
    height: @height;
    background-color: @backgroundColor;
}
.box {
    margin: 0 auto;
    .standard-box(100px, 200px);
}
```

##### 运算

算术运算符`+`、`-`、`*`、`/`可以对任何数字、颜色或变量进行运算。计算的结果以最左侧操作数的单位类型为准。

##### 导入

使用其他文件中的变量与函数，如果导入的文件是`.less`扩展名，则可以将扩展名省略掉。

#### 4. JS

##### 变量

声明的变量不能以数字开头，采用驼峰式命名法。仅声明的变量，其值与类型为`undefined`。

`typeof`用于得到变量的类型，`null`是`Object`对象。

浮点运算可能得到不精确的结果。

`null` 和`undefined`没有`toString()`方法。

`parseInt`和`parseFloat`可以得到字符串中有效的整数和小数。

```javascript
// 输出为233
parseInt('233str');
// 输出为NaN（Not a Number）
parseInt('str233str');
```

`&&`第一个值为`true`则返回第二个值；第一个值为`false`，直接返回第一个。

`||`第一个值为`false`则返回第二个值；第一个值为`true`，直接返回第一个。

`NaN`不和任何值相等，包括本身。可以通过`isNaN(n)`判断。

`===`比较时不会做类型转换，类型不同则直接返回`false`。

```javascript
// true
'1' == 1
// false
'1' === 1
```