<table>
    <tr>
        <td>title：design pattern</td>
        <td>author：songyx</td>
        <td>date：2024/03/23</td>
    </tr>
</table>
#### 创建型

创建型，就是指**创建对象**的方式。

##### 原型模式

让所有实例**共享**原型对象的属性和方法。

存在的问题：

1. 引用类型值属性会被所有的实例共享并修改。
2. 实例的属性值无法单独设置

```javascript
function Person(name, age, hobby) {
    Person.prototype.name = name;
    Person.prototype.age = age;
    Person.prototype.hobby = hobby;
    Person.prototype.increase = increase;
}

function increase() {
    Person.prototype.age += 1;
}

let one = new Person('li', 60, ['高尔夫']);
let two = new Person('zhang', 20, ['游泳', '骑车']);
one.hobby.push('打游戏');
two.increase();
```

上述代码中`one`和`two`的属性值始终是一致的。

##### 构造器模式

```javascript
function Person(name, age, hobby) {
    this.name = name;
    this.age = age;
    this.hobby = hobby;
    this.increase = function () {
        this.age++;
    };
}

let one = new Person('li', 60, ['高尔夫']);
let two = new Person('zhang', 20, ['游泳', '骑车']);
one.hobby.push('打游戏');
two.increase();
// false
console.log(two.increase === one.increase);
```

实例的共同点（都有`name、age、hobby、increase`属性/方法）。

不同点，属性值各个实例不同。

存在的问题：公共方法`increase`被重复创建，浪费内存空间。

##### 组合模式

将原型模式与构造器模式结合，在构造器中定义**实例对象**的**属性**和**方法**，在**原型**上定义公有的**属性**和**方法**。

```javascript
function Person(name, age, hobby) {
    this.name = name;
    this.age = age;
    this.hobby = hobby;
}

Person.prototype.increase = function () {
    this.age++;
}

Person.prototype.grades = [];

let one = new Person('li', 60, ['高尔夫']);
let two = new Person('zhang', 20, ['游泳', '骑车']);
one.grades.push('小学');
two.increase();
// false、true、true
console.log(two.hobby === one.hobby);
console.log(two.increase === one.increase);
console.log(two.grades === one.grades);
```

##### 工厂模式

场景：不同的用户使用不同的菜单。首先不使用工厂模式

```javascript
// 普通用户
class Ordinary {
    constructor(name) {
        this.name = name;
        this.role = 'ordinary'
        this.menus = ['menu1', 'menu2'];
    }
}

// 管理员
class Admin {
    constructor(name) {
        this.name = name;
        this.role = 'admin'
        this.menus = ['menu1', 'menu2', 'menu3', 'menu4'];
    }
}

// 给一份清单，用于批量分配菜单
function handle(users) {
    let result = [];
    for (const user of users) {
        let { name, role } = user;
        if (role === 'ordinary') {
            result.push(new Ordinary(name));
        } else if (role === 'admin') {
            result.push(new Admin(name));
        }
    }
    return result;
}

let users = [
    { name: 'zhang', role: 'ordinary' },
    { name: 'li', role: 'admin' }
];

console.log(handle(users));
```

上述代码，如果不同权限的用户持续增多，就要实现很多个构造函数。

而且构造函数的属性是相同的，因此可以使用工厂模式优化。

```javascript
class User {
    constructor(name, role, menus) {
        this.name = name;
        this.role = role;
        this.menus = menus;
    }
}

function factory(name, role) {
    switch (role) {
        case 'ordinary':
            return new User(name, role, ['menu1', 'menu2']);
        case 'admin':
            return new User(name, role, ['menu1', 'menu2', 'menu3', 'menu4']);
        default:
            break;
    }
}

let users = [
    { name: 'zhang', role: 'ordinary' },
    { name: 'li', role: 'admin' }
];

function handle(users) {
    let result = [];
    for (const user of users) {
        let { name, role } = user;
        result.push(factory(name, role));
    }
    return result;
}
```

**工厂模式封装了创建对象的过程**。

##### 单例模式

单例模式，**一个类只能有一个实例**。**`Vuex`和`VueRouter`都是单例模式**。

比如`springboot`框架中，`service`就是单例的。当有多个同名`service`时，项目无法启动。

 **在一个应用中需要全局唯一的实例，就使用单例模式**

在`java`中，单例模式的创建，包括饿汉式（类加载时创建）和懒汉式（使用时创建）。

在`js`中，都是在使用时创建，只是一种是构造函数创建，一种是闭包创建（借助于立即执行函数）。

构造函数创建

```javascript
// 1.构造函数创建
class Subject {
    static instance = null;
    // 空构造函数
    constructor() {
    }
    static getInstance(name, time) {
        if (!Subject.instance) {
            let obj = new Subject();
            obj.name = name;
            obj.time = time;
            Subject.instance = obj;
        }
        return Subject.instance;
    }
}

let math = Subject.getInstance('math', 3);
let english = Subject.getInstance('english', 2);
// true
console.log(math === english);
```

闭包创建

```javascript
// 2.闭包创建
const Person = (function () {
    let instance = null;
    function createInstance(name, age) {
        const object = {
            name: name,
            age: age
        };
        return object;
    }
    return {
        getInstance: function (name, age) {
            if (!instance) {
                instance = createInstance(name, age);
            }
            return instance;
        }
    };
})();

const zhang = Person.getInstance('zhang', 20);
const li = Person.getInstance('li', 60);
// true
console.log(zhang === li);
```

#### 结构型

##### 装饰器模式

在当前的`ECMAScript`标准中，装饰器仍然是实验性特性。

在`TypeScript`中，装饰器模式可以通过装饰器语法来优雅地实现。

1. 类装饰器：常用于添加新方法。
2. 方法装饰器：修改原有方法的行为。

其主要思想是：扩展原本类的功能，如**添加新方法，或者修改原有方法的行为**。该思想当然可以通过继承实现。

类装饰器

```typescript
// student.decorator.ts
export function student(target: any) {
    // 添加新方法
    target.prototype.description = function () {
        console.log(`${this.name} is a student`);
    };
}
```

```typescript
// person.ts
import { student } from './student.decorator';

@student
export class Person {
    name: string;
    age: number;
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
    getName() {
        console.log(`the name is ${this.name}`);
    }
}
```

```typescript
// 使用
import { Person } from './person';

const person = new Person('songyx', 26);
person.getName();
// @ts-ignore
person.description();
```

使用的场景：如`webpack`插件。当我们需要某个功能，但不能说给`webpack`提需求，因此`webpack`暴露了一些方式给我们扩展功能。

##### 适配器模式

**使原本因接口不匹配而不能一起工作的类能够协同工作**。

 如何axios实现的xhrAdapter。

需要的类为

```javascript
class Axios {
    get() { };
}
```

存在的类

```javascript
class XMLHttpRequest {
    open() { };
    send() { };
}
```

编写适配器

```javascript
// axios.get()将会变成config
function xhrAdapter(config) {
    return new Promise((resolve, reject) => {
        // 使用 XMLHttpRequest 进行实际的 HTTP 请求
        let xhr = new XMLHttpRequest();
        xhr.open(config.method, config.url);
        xhr.send(config.data);
        // ...
    })
}
```

##### 代理模式

不能直接访问到一个对象的属性和方法，需要一个中间人（代理）帮我们去访问，再把结果给我们。

如`webpack-dev-server`提供了内建的`HTTP`服务器，可以用来代理开发环境下的`API`请求，从而避免浏览器的同源策略限制。

```javascript
module.exports = {
    devServer: {
        port: 80,
        hot: true,
        // 添加代理配置
        proxy: {
            '/api': {
                // 跨域的目标服务器地址
                target: 'http://192.163.75.28:8001',
                // 如果目标服务器使用HTTPS但证书不受信任，则设为false（默认true）
                secure: false,
                // 是否改变原始主机头信息，设为true解决跨域问题
                changeOrigin: true,
            },
        },
    },
};
```

此外`Vue`内部的数据代理`Object.defineProperty`。

还有事件代理，当点击`div`内的`a`标签时，给每个`a`标签都添加事件，会加大性能开销。

```html
<div id="parent"> 
  <a href="#">link 1</a> 
  <a href="#">link 2</a> 
  <a href="#">link 3</a> 
  <a href="#">link 4</a> 
  <a href="#">link 5</a> 
  <a href="#">link 6</a> 
</div>
```

借助**事件冒泡**实现代理模式

```javascript
const parent = document.body.querySelectorAll('#parent')

parent.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    // ...
  }
})
```

#### 行为型

##### 策略模式

允许策略在运行时根据需要进行切换。

如针对不同的文件类型（`txt、pdf、xlsx`），进行不同处理。

```javascript
// 使用策略模式处理文件
function processFile(fileType, content) {
    const handler = getFileHandler(fileType);
    handler.handleFile(content);
}

// 工厂方法或其他方式根据文件类型获取对应的处理策略
function getFileHandler(fileType) {
    switch (fileType) {
        case 'txt':
            return new TxtFileHandler();
        case 'excel':
            return new ExcelFileHandler();
        case 'pdf':
            return new PdfFileHandler();
        default:
            throw new Error('Unsupported file type');
    }
}

// TxtFileHandler、ExcelFileHandler、PdfFileHandler内实现了各自的handleFile(content)方法
```

显然，上述代码，添加策略也是很简单的。

##### 观察者模式

目标者`(subject)`和观察者`(observer)`。

当目标者发生变化时，目标者中的所有观察者都会接收到通知，并执行观察者的方法。

```javascript
class Subject {
    constructor() {
        this.observers = [];
    }
    add(observer) {
        this.observers.push(observer);
    }
    remove(observer) {
        this.observers = this.observers.filter((item) => {
            return item !== observer;
        })
    }
    notify() {
        this.observers.forEach((item) => {
            item.show('the observer name is ');
        })
    }
}

class Observer {
    constructor(name) {
        this.name = name;
    }
    show(prefix) {
        console.log(prefix + this.name);
    }
}

const sub = new Subject();
// 添加观察者
const zhang = new Observer('zhang');
const li = new Observer('li');
sub.add(zhang);
sub.add(li);
// 触发通知
sub.notify();
```

优点：目标者与观察者，功能耦合度降低。观察者被动接收更新，时间上解耦。

缺点：无法对事件进行细分管控，触发方式只有`notify`。

##### 发布订阅模式

<div style="margin:0 auto;border:2px solid #42b883;width:80%">
    <img src=".\发布与订阅.png">
</div>

发布者不直接触及到订阅者、而是由统一的第三方来完成实际的通信的操作。

`Vue`中的全局事件总线，就是发布者。比如实现多个购物车页面。当存在多个购物车页面时，在商品页面添加商品，每个购物车内都会加入该商品。当触发一个购物车内某个商品的删除，所有购物车都清除该商品。

```js
// main.js
Vue.prototype.$bus = this;
```

```vue
<script>
// 商品页面
export default {
    name: 'product-detail',
    data() {
        return {
            productName: '百事可乐',
            price: '3元'
        }
    },
    methods: {
        // 发布事件
        onAddToCart() {
            this.$bus.$emit('addToCart', { productName: this.productName, price: this.price });
        }
    }
}
</script>
```

```vue
<script>
// 购物车页面
export default {
    name: 'my-student',
    data() {
        return {
            products: []
        }
    },
    mounted() {
        // 订阅事件
        this.$bus.$on('addToCart', (item) => {
            this.products.push(item)
        });
        this.$bus.$on('deleteFromCart', (item) => {
            let index = this.products.indexOf(item);
            this.products.splice(index, 1);
        });
    },
    beforeDestroy() {
        // 解除订阅
        this.$bus.$off('addToCart');
        this.$bus.$off('deleteFromCart');
    },
    methods: {
        onDelete(item) {
            // 发布
            this.$bus.$emit('deleteFromCart', item);
        }
    }
}
</script>
```

其他发布与订阅模式的应用

1. `Vuex`状态管理：`Store`作为发布者，组件作为订阅者，通过`Vuex`的`API`实现状态的发布与订阅。
2. `Vue`的响应式系统：`Vue`内部使用观察者模式（一种特殊的发布与订阅模式）来实现数据响应式。数据对象作为发布者，当其属性值发生变化时，会通知依赖这些属性的组件（订阅者）进行视图更新。

##### 手写全局事件总线

```js
class EventHub {
    constructor() {
        this._events = {};
    }

    /**
     * 订阅事件
     * @param {string} eventType 事件类型
     * @param {function} handler 事件处理器
     */
    on(eventType, handler) {
        if (this._events[eventType]) {
            this._events[eventType].push(handler);
        } else {
            this._events[eventType] = [handler];
        }
    }

    /**
     * 取消订阅事件
     * @param {string} eventType 事件类型
     * @param {function} handler 事件处理器（可选，如果不传，则取消该类型的所有订阅）
     */
    off(eventType, handler) {
        if (!handler) {
            delete this._events[eventType];
            return;
        }
        if (this._events[eventType]) {
            this._events[eventType] = this._events[eventType].filter(item => item !== handler);
        }
    }

    /**
     * 发布事件
     * @param {string} eventType 事件类型
     * @param {...*} args 传递给事件处理器的参数
     */
    emit(eventType, ...args) {
        if (this._events[eventType]) {
            this._events[eventType].forEach(handler => handler(...args));
        }
    }

    /**
     * 一次性订阅事件（订阅一次后自动取消）
     * @param {string} eventType 事件类型
     * @param {function} handler 事件处理器
     */
    once(eventType, handler) {
        const onceHandler = (...args) => {
            // 1.全部取消
            this.off(eventType, onceHandler);
            // 2.执行一次
            handler.apply(this, args);
        };
        this.on(eventType, onceHandler);
    }
}

// 使用示例
const eventHub = new EventHub();

// 订阅事件
eventHub.on('productAdded', (productId, productName) => {
    console.log(`产品 ${productId} (${productName}) 加入购物车`);
});

// 一次性订阅事件
eventHub.once('productRemoved', (productId, productName) => {
    console.log(`产品 ${productId} (${productName}) 移出购物车`);
});

// 发布事件
eventHub.emit('productAdded', 3, '可乐');
eventHub.emit('productRemoved', 3, '可乐');
// 再次发布相同的事件，不再输出，因为之前的一次性订阅已经取消
eventHub.emit('productRemoved', 3, '可乐');
```