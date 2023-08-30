<table>
    <tr>
        <td>title：jQuery源码阅读</td>
        <td>author：songyx</td>
        <td>date：2021/09/09</td>
        <td>version：1.8.3</td>
    </tr>
</table>


#### 1. 构造器概述

通过调用jQuery.fn.init解析 $(selector, context)中传入的参数，构造jQuery对象。context可选，规定了查找的范围（DOM元素集、jQuery对象、document对象 ），jQuery支持的参数输入大致可分为以下几种类型。

<div style="margin:0 auto;width:70%">
    <img src=".\选择器参数类型.png">
</div>

jQuery定义了[正则表达式](https://deerchao.cn/tutorials/regex/regex.htm#mission)，用于检查字符串是HTML还是ID。

```javascript
rquickExpr = "/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/"
```

```
(?:exp)	匹配exp,不捕获匹配的文本，也不给此分组分配组号。
\s*匹配空白字符（重复次数为0~n）。
<[\w\W]+>匹配<开头，任意字符（重复次数为1~n），>结尾。
[^>]*匹配除>以外的任意字符（重复次数为0~n）。
#([\w-]+)匹配#开头，字母或数字或下划线或汉字或-（重复次数为1~n）。
```

```javascript
RegExpObject.exec(string);
```

用于检索字符串中正则表达式的匹配。如果exec()找到了匹配的文本，则返回一个结果数组，否则返回 null。此数组的第0个元素是与正则表达式相匹配的文本，第1个元素是与 RegExpObject 的第1个子表达式相匹配的文本（如果有的话），第2个元素是与RegExpObject的第2个子表达式相匹配的文本（如果有的话），依此类推。


##### 1.1 $("#id")

```javascript
if (typeof selector === "string") {
    if (selector[0] === "<" && selector[selector.length - 1] === ">" &&
        selector.length >= 3) {
        //字符串的开头与结尾为<>，因此是复杂HTML，跳过正则校验
        match = [null, selector, null];
    } else {
        match = rquickExpr.exec(selector);
    }
    //true：是HTML对上下文无要求、是ID但要求上下文为空。
    if (match && (match[1] || !context)) {
        //是HTML？
        if (match[1]) {
            ...
        } else {
            elem = document.getElementById(match[2]);
            if (elem) {
                this[0] = elem;
                this.length = 1;
            }
            return this;
        }
    }
    ...
}
```

举例说明：

```html
<div class="fruit" id="1-2">apple</div>
<script>
    var obj = $("#1-2");
    console.log(obj);
    obj.html("苹果");
    console.log(obj[0]);
</script>
```

<div style="margin:0 auto;width:35%">
    <img src=".\apple.png">
</div>

document.getElementById，IE7及以前的版本存在按名称而不是ID返回的情况。

<div style="margin:0 auto;width:70%">
    <img src=".\document.getElementById返回值.png">
</div>

老版本jQuery可兼容，采用的方式为：

```javascript
if ( elem ) {
    //处理IE7及以前的版本兼容性问题
    if ( elem.id !== match[2] ) {
        //从DOM树的根向下遍历，直至找到相匹配的jQuery对象
        return rootjQuery.find( selector );
    }
    this.length = 1;
    this[0] = elem;
}
```

##### 1.2 $("html")

根据正则表达式，html应当是以**'<'**开头的字符串。

HTML DOM 中, 每个东西都是节点。

<div style="margin:0 auto;width:80%">
    <img src=".\对象之间的关系.png">
</div>

jQuery对象中包含DOM元素对象。

<div style="margin:0 auto;width:25%">
    <img src=".\jQuery对象.png">
</div>

parseHTML使用原生的DOM元素创建函数把HTML字符串转换为一个DOM元素集，接受三个参数。

| **参数**      | 必输 | 描述                                                         |
| ------------- | ---- | :----------------------------------------------------------- |
| *htmlString*  | 是   | String类型 需要解析并转为DOM节点数组的HTML字符串             |
| *context*     | 否   | Element类型 指定在哪个Document中创建元素，默认为当前文档的document |
| *keepScripts* | 否   | Boolean类型 指定传入的HTML字符串中是否包含脚本，默认为false  |

<div style="margin:0 auto;width:40%">
    <img src=".\parseHTML.png">
</div>

nodeType属性返回以数字值返回指定节点的节点类型，节点类型共有12种。举例：如果节点是Element，则nodeType属性将返回1；如果节点是Text，则nodeType属性将返回3；如果节点是Document，则nodeType属性将返回9。

merge( first, second ) 合并两个数组内容到第一个数组。

```javascript
if (typeof selector === "string") {
    if (match && (match[1] || !context)) {
        //处理$(html) -> $(array)
        if (match[1]) {
            //若为jQuery对象，转换为element对象
            context = context instanceof jQuery ? context[0] : context;
            //ownerDocument是节点对象的一个属性，返回的是某个元素的根节点document对象
            jQuery.merge(this, jQuery.parseHTML(match[1], context && context.nodeType ?
                context.ownerDocument || context : document, true
            ));
            //处理$(html, props)，isPlainObject判断参数是否为纯粹的对象。
            if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
                for (match in context) {
                    if (isFunction(this[match])) {
                        this[match](context[match]);
                    } else {
                        this.attr(match, context[match]);
                    }
                }
            }
            return this;
        }
        ...
    }
    ...
}
```

举例说明：

```html
<span class="color-green">banana</span>
<script>
    var obj = $('<span>', { 'class': 'color-green' });
    console.log(obj);
    obj.html("香蕉");
    console.log(obj[0]);
</script>
```

<div style="margin:0 auto;width:35%">
    <img src=".\banana.png">
</div>

调用html()方法为何失败？猜测：创建了新的JQuery对象，与html中的并非同一个。

##### 1.3 其他

```javascript
//$("字符串表达式")
return jQuery.fn.init[document].find(".class");
//$("字符串表达式", context)
return jQuery.fn.init[context].find(".class");
//字符串表示式可以是：（1）.class（2）div p（3）div.class等。
```

总而言之，单个DOM元素$(ID)，直接把DOM元素作数组传递给this对象。多个DOM元素，集合形式，通过CSS选择器jQuery.find(selector)过滤，构建数据结构。

#### 2. Sizzle选择器引擎

CSS选择器jQuery.find(selector)过滤，最终进入Sizzle()中处理。

##### 2.1 概述

一个element节点与其他element节点之间的关系有四种：祖宗与后代、父与子、临近兄弟、普通兄弟，对应的字符分别为：**空格**、**>**、**+**、**~**。

Sizzle里有一个对象是记录跟选择器相关的属性以及操作：Expr。它有以下属性：

```javascript
relative: {
    ">": { dir: "parentNode", first: true },
    " ": { dir: "parentNode" },
    "+": { dir: "previousSibling", first: true },
    "~": { dir: "previousSibling" }
},
```

待处理html

```html
<div>
    <p>
        <input type="hidden" />
    </p>
    <div class="price">
        <input type="text" value="" /><label>*指导价</label>
    </div>
</div>
```

选择器语句

```javascript
var obj = $("div > p + div.price input[type='text']");
```

从左往右解析：首先选择父元素为**div**的所有子元素**p**，之后选择紧挨着**p**元素的属性为**price**的所有**div**元素，最后选择**div.price**元素内部的类型为**text**的所有**input**元素。

从右往左解析(Sizzle选择器)：首先查找到所有类型为**text**的**input**元素，从右往左依次校验。DOM树中，一个元素可能有若干子元素，而一个子元素只有一个父元素，因此从右往左检索效率更高。

##### 2.2 词法分析

首先，Sizzle中的tokenize处理器将字符串分解，分解出如下的Token格式，这个过程被称为词法分析。

```css
Token：{  
   value:'匹配到的字符串', 
   type:'对应的Token类型', 
   matches:'正则匹配到的一个结构'
}
```

上述字符串的分解结果如下：

<div style="margin:0 auto;width:55%">
    <img src=".\token序列.png">
</div>
完整源码分析如下：

```javascript
function tokenize( selector, parseOnly ) {
    // soFar是表示目前还未分析的字符串剩余部分
    // groups是最终的返回结果
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ expando ][ selector + " " ];
    
    // 检查缓存中是否有，有的话直接获取
	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

    // 初始化
 	soFar = selector;
	groups = [];
    
    // 预处理器对匹配到的Token适当做一些调整
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// 以第一个逗号切割选择符，然后去掉前面的部分，处理字符串组合[语句1,语句2,...]
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

        // 处理特殊的Token ： >, +, 空格, ~
		if ( (match = rcombinators.exec( soFar )) ) {
			tokens.push( matched = new Token( match.shift() ) );
			soFar = soFar.slice( matched.length );

			// 剩余还未分析的字符串需要减去这段已经分析过的
			matched.type = match[0].replace( rtrim, " " );
		}

		// 处理以下几种Token：TAG,ID,CLASS,ATTR,CHILD,PSEUDO,NAME
        // 依次用ID,TAG,CLASS,ATTR,CHILD,PSEUDO这些正则进行匹配
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {

				tokens.push( matched = new Token( match.shift() ) );
				soFar = soFar.slice( matched.length );
				matched.type = type;
				matched.matches = match;
			}
		}

        // 如果到了这里都还没matched到，那么说明这个选择器在这里有错误，中断词法分析
		if ( !matched ) {
			break;
		}
	}

    // 如果只需要这个接口检查选择器的合法性，直接就返回soFar的剩余长度，倘若是大于零，说明选择器不合法，抛出异常
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
            // 放入缓存
			tokenCache( selector, groups ).slice( 0 );
}
```

##### 2.3 解析原理

词法分析器tokenize分解对应的规则后，引入seed - 种子合集。当搜索器搜到符合条件的标签时，将其放入到这个初始集合seed中。

对于Token序列，一些类型可以通过Expr.find匹配，包括以下四种类型：

```css
Expr.find = {
    'ID'    : context.getElementById,
    'CLASS' : context.getElementsByClassName,
    'NAME'  : context.getElementsByName,
    'TAG'   : context.getElementsByTagName
}
```

完整源码分析如下：

```javascript
function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector ),
		j = match.length;
	if ( !seed ) {
		// 不含逗号，也就是单个选择器的情况
		if ( match.length === 1 ) {

			// 取出选择器token序列
			tokens = match[0] = match[0].slice( 0 );
            
            // 如果第一个选择器是id，设置context进行快速查找
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
                // 去掉第一个id选择器
				selector = selector.slice( tokens.shift().value.length );
			}

			// 判断是否有伪类，如有则需要用另一种方式过滤，否则从右往左开始，先找出seed集合
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
            
            // 从右往左
			while ( i-- ) {
				token = tokens[i];

				// 如果遇到了> + ~ " "，则中止
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
                
                // 对于伪类，比如:first-child。由于没有对应的搜索器，因此会向前提取前一条token
				if ( (find = Expr.find[ type ]) ) {
					// 尝试一下能否通过这个搜索器搜到符合条件的初始集合seed
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// 搜索到则去除最后一条规则
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
                        // 校验剩余选择器是否为空，若是则返回结果
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}
                        // 已经找到了符合条件的seed集合，break跳出
						break;
					}
				}
			}
		}
	}
    // 调用compile过滤seed，完成最后的编译
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}
```

上述字符串解析后，从循环中跳出的结果如下：

<div style="margin:0 auto;width:60%">
    <img src=".\解析结果.png">
</div>

##### 2.4 编译函数

编译函数源码分析如下：

```javascript
// 通过传递进来的selector和match生成匹配器
compile = Sizzle.compile = function( selector, group ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];
    // 查询缓存
	if ( !cached ) {
        // 校验是否进行了词法解析
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
        // 从右往左匹配
		while ( i-- ) {
            // 生成对应Token的匹配器，分两种类型
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// 通过matcherFromGroupMatchers这个函数来生成最终的匹配器
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
    // 将终极匹配器返回到select函数中
	return cached;
};
```

上述字符串经过编译后，得到的两组匹配器（setMatchers、elementMatchers）如下：

<div style="margin:0 auto;width:60%">
    <img src=".\编译结果.png">
</div>

打开第二个值，会发现里面还嵌套着很多闭包，闭包里面又有闭包。

将这两组匹配器传入matcherFromGroupMatchers函数进行superMatcher(超级匹配)。根据参数seed 、expandContext、context确定起始的查询范围。其中context也就是$(selector, context)的第二个参数！

#### 3. 选择器优化

（1）更多使用ID选择器 ，或者继承它。

jquery对仅含id选择器的处理方式是直接使用了浏览器的内置函数document.getElementById()，所以其效率是非常之高的。

```javascript
$('#id')
$('#id p')
```

（2）避免直接使用Class选择器。

使用复合选择器，例如使用tag.class代替.class。jquery中class选择器是最慢的，因为在IE浏览器下它会遍历所有的DOM节点。

```javascript
$('.class') // NO
$('div.class') // YES
```

（3）更多使用父子关系，而非嵌套关系。

因为">"是child选择器，只从子节点里匹配，不需要递归。而" "是后代选择器，递归匹配所有子节点及子节点的子节点。

```javascript
$('parent child') // NO
$('parent > child') // YES
```

（4）缓存jquery对象

如果选出结果不发生变化的话，不妨缓存jQuery对象，这样就可以提高系统性能。

```javascript
// NO
for (i = 0 ; i < 10000; i ++ ) {   
    var a= $( ' .class' );   
    a.append(i);   
}
// YES
var a= $( ' .class' );
for (i = 0 ; i < 10000; i ++ ) {   
    a.append(i);   
}
```
