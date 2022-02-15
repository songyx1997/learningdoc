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

##### ☆浮动☆

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
/* 既可以解决高度塌陷（after+全部三行），又可以解决外边距重叠（before+前两行）。 */
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
        /*水平居中*/
        margin: auto;
        /*垂直居中*/
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
</style>
```