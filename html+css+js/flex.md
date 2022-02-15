#### 1. Flexbox

采用 Flex 布局的元素，称为 Flex 容器。它的所有子元素自动成为容器成员，称为 Flex 项目。

容器默认存在两根轴：水平的主轴（main axis）和垂直的交叉轴（cross axis）。主轴的开始位置（与边框的交叉点）叫做main start，结束位置叫做main end；交叉轴的开始位置叫做cross start，结束位置叫做cross end。

项目默认沿主轴排列。单个项目占据的主轴空间叫做main size，占据的交叉轴空间叫做cross size。

##### 2.1 容器

```css
.box {
  display: flex;
  flex-direction: row | row-reverse | column | column-reverse;
  flex-wrap: nowrap | wrap | wrap-reverse;
}
```

通过将父元素 display 属性设置为 flex，flex 容器将可伸缩。

flex-direction 定义父元素要在哪个方向上堆叠 flex 项目，依次为：从左到右、从右到左、从上到下、从下到上。

flex-wrap 规定是否应该对 flex 项目换行，依次为：默认不换行、必要时进行换行、相反顺序换行。

```css
.box {
  display: flex;
  justify-content: flex-start | flex-end | center | space-between | space-around;
}
```

justify-content属性定义了项目在主轴（水平方向）上的对齐方式，依次为：默认左对齐、右对齐、居中、flex项目之间的间隔都相等、每个flex项目两侧的间隔相等。

```css
.box {
  display: flex;
  align-items: stretch | flex-start | flex-end | center | baseline;
}
```

align-items属性定义项目在交叉轴（竖直方向）上的对齐方式，依次为：默认占满整个容器的高度、交叉轴的起点对齐、交叉轴的终点对齐、交叉轴的中点对齐、flex项目的第一行文字的基线对齐。

完美居中的flex项目

```css
.box {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

```CSS
.box {
  display: flex;
  flex-wrap: wrap
  align-content: flex-start | flex-end | center | space-between | space-around | stretch;
}
```

由于换行产生了多条水平轴线，align-content属性定义了多根轴线的对齐方式，依次为：与交叉轴的起点对齐、与交叉轴的终点对齐、与交叉轴的中点对齐、轴线之间的间隔平均分布、每根轴线两侧的间隔都相等、默认轴线占满整个交叉轴。

##### 2.2 项目

```css
.item {
  order: 2;
  flex-grow: 4;
}
```

order 属性定义项目的排列顺序。数值越小，排列越靠前，默认为0。

flex-grow 属性规定某个 flex 项目相对于其余 flex 项目将增长多少，默认为0。

```css
.item {
  flex-shrink: 6;
}
```

flex-shrink 属性规定某个 flex 项目相对于其余 flex 项目将收缩多少，默认为1。如果一个项目的 flex-shrink 属性为0，其他项目都为1，则空间不足时，前者不缩小。

```css
.item {
  flex-basis: 300px
}
```

flex-basis 属性规定 flex 项目的初始长度，默认值为auto，即项目的本来大小。

```css
.item {
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```

align-self 属性允许单个项目有与其他项目不一样的对齐方式，可覆盖 align-items 属性。默认值为auto，表示继承父元素的 align-items 属性，如果没有父元素，则等同于stretch。
