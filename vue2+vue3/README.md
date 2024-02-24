<table>
    <tr>
        <td>title：vue2+vue3</td>
        <td>author：songyx</td>
        <td>date：2024/02/16</td>
    </tr>
</table>
#### Vue3

##### vite

1. 轻量快速的热重载，可以实现快速的服务启动。
2. 对`ts、jsx、css`等支持开箱即用。
3. 真正的按需编译。

`webpack`构建与`vite`构建对比如下：

<div style="margin:0 auto;width:85%;">
    <img src=".\webpack构建.png">
</div>

<div style="margin:0 auto;width:70%">
    <img src=".\vite构建.png">
</div>

##### OptionsAPI、CompositionAPI

`Vue2`采用的是`OptionsAPI`（配置项式）。

`Vue3`采用的是`CompositionAPI`（组合式）。采用函数的方式，更加优雅的组织代码，将相关功能的代码更加有有序的组织在一起。

<div style="display:flex;justify-content: center;">
    <img src=".\OptionsAPI与CompositionAPI_1.gif" style="width:48%">
    <img src=".\OptionsAPI与CompositionAPI_2.gif" style="width:48%">
</div>
##### Fragment

在`Vue3`中不需要写`<div>`根标签，内部的标签将会被包含在`Fragment`虚拟元素内。

```vue
<template>
    <!-- <Fragment> -->
        <div>数目:{{ num }}</div>
        <div>描述:{{ des }}</div>
        <div>扩大10倍的数据:{{ bigSum }}</div>
    <!-- </Fragment> -->
</template>
```

好处是减少标签层级，减少内存占用。

##### setup

组合式`API`需要编写在`setup`中。

`setup`函数中的`this`为`undefined`，`Vue3`中开始弱化`this`。

`setup`的执行时机在钩子函数`beforeCreate`之前。

`setup`的返回值是一个**渲染函数**。

```vue
<script lang="ts">
export default {
  name: 'person',
  beforeCreate() {
    console.log('beforeCreate');
  },
  setup() {
    // 先打印
    console.log('setup');
    // 数据（注意这些数据非响应式）
    let name = 'songyx';
    let age = 26;
    // 方法（name为非响应式的，修改后的值无法渲染到页面中）
    function changeName() {
      name = '牛马';
    }
    // 提交至template
    return { name, age, changeName }
  }
}
</script>
```

`setup`函数能否与`OptionsAPI`共存？

可以共存。`OptionsAPI`可以读取`setup`中的数据与方法，反之则不能。

`setup`语法糖?

更便捷的编写`setup`函数，不需要编写返回值。

```vue
<script setup lang="ts">
// 数据（注意这些数据非响应式）
let name = 'songyx';
let age = 26;
// 方法（name为非响应式的，修改后的值无法渲染到页面中）
function changeName() {
  name = '牛马';
}
</script>
```

##### ref、reactive

`ref`：可以定义**基本类型、对象类型**的响应式数据。

`reactive`：只能定义**对象类型**的响应式数据。

```vue
<script setup lang="ts">
import { ref, reactive } from 'vue';
// 基本类型数据，name转变为了RefImpl实例对象
let name = ref('songyx');
// 该数据没有变化的需求，为非响应式数据
let age = 26;
// 对象类型数据，job转变为了Proxy实例对象
let job = reactive({ work: '程序员', seniority: 3 });
// 方法
function changeName() {
  // 修改ref的响应式数据时，需要使用.value
  name.value = '牛马';
}
function changeJob() {
  job.work = '学生';
  job.seniority = 4;
}
</script>
```

当使用`ref`定义**对象类型**时，其底层仍然为`reactive`。

```typescript
// job转变为了RefImpl实例对象，但是其内部的value为Proxy实例对象
let job = ref({ work: '程序员', seniority: 3 });
function changeJob() {
  // 修改ref的响应式数据时，需要使用.value
  job.value.work = '学生';
  job.value.seniority = 4;
}
```

使用`reactive`定义**对象类型**时需要注意

```typescript
function changeJob() {
  // 整体赋值是不被允许的，将导致响应式失效
  // job = { work: '学生', seniority: 4 };
  // 使用该方法进行赋值
  Object.assign(job, { work: '学生', seniority: 4 });
}
```

而`ref`定义的**对象类型**可以直接赋值

```typescript
function changeJob() {
  // 可直接赋值
  job.value = { work: '学生', seniority: 4 };
}
```

##### toRefs、toRef

```typescript
let job = reactive({ work: '程序员', seniority: 3 });
// 解构赋值出来的数据，并非响应式，数据的变化无法反映在页面中
let { work, seniority } = job;
```

`toRefs`会将`job`的每个属性均转换为`RefImpl`实例对象。

```typescript
let newJob = toRefs(job);
let { work } = newJob;
let { seniority } = newJob;
```

`toRef`会将`job`的指定属性转换为`RefImpl`实例对象。

```typescript
let work = toRef(job.work);
```

##### 双向绑定

为什么会使用双向绑定？

当然可以用`js`代码修改页面中的信息。

但是当页面数据发生变化时，比如`input`。`js`需要获取到页面中输入的数据，因此就需要使用双向绑定。

```vue
<script setup lang="ts">
import { ref } from 'vue';
// 基本类型数据，name转变为了RefImpl实例对象
let name = ref('songyx');
</script>

<template>
  <div class="person">
    <div>姓名:<input v-model="name" /></div>
    <div>域名信息({{ name.substring(0, 1) + (Math.random() * 10000).toFixed(0) }})</div>
  </div>
</template>
```

##### computed

`Vue`要求模板应该尽量简单，因此上面的代码需要使用计算属性替代。

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
// 基本类型数据，name转变为了RefImpl实例对象
let name = ref('songyx');
// domainName为ComputedRefImpl实例对象
let domainName = computed(() => {
  // 计算时所依赖的数据发生变化，就进行重新计算
  // 计算属性是存在缓存的，而方法没有。每次修改name，计算只执行1次。但是方法会执行3次。
  console.log('执行计算');
  return name.value.substring(0, 1) + (Math.random() * 10000).toFixed(0)
})
</script>

<template>
  <div class="person">
    <div>姓名:<input v-model="name" /></div>
    <div>域名信息({{ domainName }})</div>
    <div>域名信息({{ domainName }})</div>
    <div>域名信息({{ domainName }})</div>
  </div>
</template>
```

计算属性`domainName`是**只读**的，直接赋值是不被允许的，

```typescript
domainName.value = 'mbp2024';
```

为了使计算属性可以修改，需要定义`get、set`方法。内部的`set`方法应该反向修改其依赖的数据，才具有意义。

```typescript
let domainName = computed({
  get() {
    return name.value.substring(0, 1) + (Math.random() * 10000).toFixed(0)
  },
  set(value) {
    // 只是记录日志，并没有实际意义
    console.log(value);
    // 对计算属性的赋值，反向修改其依赖的数据name，并反映在页面中，具有其意义
    name.value = value.substring(0, value.length - 4);
  }
})
```

##### watch

能监视4种数据，共5个场景。四种数据包括：

1. `ref`定义的响应式数据。
2. `reactive`定义的响应式数据。
3. 函数的返回值。
4. 上述三种数据组成的数组。

场景一：`ref`定义的**基本类型数据**

```vue
<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
let age = ref(26);
function changeAge() {
  age.value++;
}
// 新值和旧值都能够正确输出
watch(age, (newValue, oldValue) => {
  console.log(newValue);
  console.log(oldValue);
})
</script>
```

场景二：`ref`定义的**对象类型数据**

`watch`监听的其实是对象的地址值。

```typescript
let car = ref({ one: '奔驰', two: '奥迪' });
// 对象进行了重新赋值，地址值发生了变化。新值和旧值都能够正确输出。
function changeAllCar() {
  car.value = { one: 'f1', two: 'f4' };
}
watch(car, (newValue, oldValue) => {
  console.log(newValue);
  console.log(oldValue);
})
```

为了能够监听对象内部属性的变化，需要开始深度监听。但是对象内部属性的变化，并没有修改对象的地址值。因此新值和旧值将保持一致，都是新值。

```typescript
let car = ref({ one: '奔驰', two: '奥迪' });
function changeCarOne() {
  car.value.one = '雅迪';
}
function changeCarTwo() {
  car.value.two = '爱玛';
}
watch(car, (newValue, oldValue) => {
  console.log(newValue);
  console.log(oldValue);
}, { deep: true })
```

场景三：`reactive`定义的**对象类型数据**

```typescript
function changeAllCar() {
  // 该方法其实是对象的合并，因此并未修改car的地址值
  Object.assign(car, { one: 'f1', two: 'f4' });
}
watch(car, (newValue, oldValue) => {
  console.log(newValue);
  console.log(oldValue);
})
```

`watch`隐式开启了深度监听。对于对象的变化和对象内部属性的变化均能监听到，但是由于地址值均未被修改，因此新值和旧值将保持一致，都是新值。

场景四：函数的返回值

该方式用于单独监听对象的内部属性变化。

```typescript
// 即使ref修改为reactive，下面两个监听的结果也是一致的
// 监听方式为()=>person.car，监听的就是person.car的地址值变化
// 在此基础上添加深度监听，则可以监听person.car内部属性的变化
let person = ref({
  name: 'songyx',
  age: 26,
  car: { one: '奔驰', two: '奥迪' }
})
// 全部修改，才能监听到，新值和旧值均能正确输出
watch(() => person.value.car, (newValue, oldValue) => {
  console.log(newValue);
  console.log(oldValue);
})
// 添加深度监听，均能监听到。修改内部属性，新值和旧值均为新值。
watch(() => person.value.car, (newValue, oldValue) => {
  console.log(newValue);
  console.log(oldValue);
}, { deep: true })
```

场景五：上述三种数据组成的数组

```typescript
// 同时监听name和car
// 新值和旧值的输出，其实就是单独监听的结果进行组合
watch([() => person.value.name, () => person.value.car], (newValue, oldValue) => {
  console.log(newValue);
  console.log(oldValue);
})
```

`watch`方法的返回值为停止监听的方法

```typescript
let stop = watch([() => person.value.age, () => person.value.car], (newValue, oldValue) => {
  console.log(newValue);
  console.log(oldValue);
  if (person.value.age >= 30) {
    // 停止监听
    stop();
  }
})
```

##### watchEffect

```typescript
// 初始化时，就会自动执行一次
// 当需要同时监听的内容很多时，使用[]会更加冗长，可以使用watchEffect替代
let stop = watchEffect(() => {
  console.log(person);
  // 内部使用了age，因此改变age的方法的调用，都会被监听
  if (person.value.age >= 30) {
    // 停止监听
    stop();
  }
})
```

##### 标签中的ref

`HTML`标签中的`ref`

```vue
<template>
  <div id="idx" value="text2"></div>
  <Person />
</template>
```

```vue
<script setup lang="ts">
function showDOM() {
  console.log(document.getElementById('idx'));
}
</script>

<template>
  <div class="person">
    <button @click="showDOM">输出DOM对象</button>
    <div id="idx" value="text1"></div>
  </div>
</template>
```

因为`id`重复。输出时，外部的`div`干扰了内部的`div`的输出。

需要借助`ref`给节点添加标记，这样就建立起了隔离。

```vue
<script setup lang="ts">
import { ref } from 'vue';
// 创建容器存储ref
let idx = ref();
function showDOM() {
  console.log(idx.value);
}
</script>

<template>
  <div class="person">
    <button @click="showDOM">输出DOM对象</button>
    <div ref="idx" value="text1"></div>
  </div>
</template>
```

`components`标签中的`ref`

通过`defineExpose`将组件内部的元素（`name、age、job`）和方法（`changeJob`）暴露出来。

```vue
defineExpose({ name, age, job, changeJob });
```

```vue
<script setup lang="ts">
import Person from '@/components/person.vue'
import { ref } from 'vue';
let person = ref();
function getSubElement(refs: any) {
  console.log(person.value.name)
  console.log(person.value.age)
  console.log(person.value.job)
  // 调用组件内部的方法
  person.value.changeJob();
  // 当多个组件被使用时，可以通过refs获取，进行批量处理
  for (const iterator in refs) {
      console.log(refs[iterator]);
  }
}
</script>

<template>
  <Person ref="person" />
  <button @click="getSubElement($refs)">获取组件内部的数据与方法</button>
</template>
```

##### props

```vue
<script setup lang="ts">
// props内部的属性均为只读
const props = defineProps({
  name: {
    type: String,
    default: ''
  },
  age: {
    type: Number,
    default: 0
  },
  car: {
    type: Object,
    default: () => {
      return { one: '汽车一', two: '汽车二' }
    }
  }
})
</script>

<template>
  <div class="person">
    <div>姓名:{{ props.name }}</div>
    <div>年龄:{{ props.age }}</div>
    <div>汽车:{{ props.car.one }}、{{ props.car.two }}</div>
  </div>
</template>
```

```vue
<script setup lang="ts">
import Person from '@/components/person.vue';
import { reactive } from 'vue';
let car = reactive({ one: '', two: '' });
function editCar() {
  car.one = '奔驰';
  car.two = '宝马';
}
</script>

<template>
  <Person name="songyx" :age="26" :car="car" />
  <button @click="editCar">修改汽车</button>
</template>
```

##### 生命周期
| 创建-创建组件时触发                         | setup(){}               | setup(){}           |
| ------------------------------------------- | ----------------------- | ------------------- |
| 挂载-将组件放置于页面中时触发               | onBeforeMount(()=>{})   | onMounted(()=>{})   |
| 更新-钩子函数的调用次数取决于数据变化的次数 | onBeforeUpdate(()=>{})  | onUpdated(()=>{})   |
| 卸载                                        | onBeforeUnmount(()=>{}) | onUnmounted(()=>{}) |

当父组件与子组件均使用了生命周期钩子函数时，如`onMounted`。子组件挂载在父组件之前。因此`App.vue`是最后才挂载完毕的。

##### hooks

让一个功能的数据与方法贴合在一起（即封装，类似于`Vue2`中的`mixin`）。

命名规范：`use+功能名称`。如该功能是订单相关的，则该文件为`useOrder.ts`。

正是因为使用了`hooks`，才体现出`CompositionAPI`的特征。

```typescript
import { ref, computed, onMounted } from 'vue';

// 默认暴露，使用函数包裹，并提供自定义返回值
export default function () {
    // 数据
    let person = ref({
        name: 'songyx',
        age: 26,
        car: { one: '奔驰', two: '奥迪' }
    })
    // 数据（计算属性）
    let domainName = computed(() => {
        return person.value.name.substring(0, 2).toUpperCase() + (Math.random() * 1000).toFixed(0);
    })

    // 方法（钩子函数）
    onMounted(() => {
        // 进入页面，就调用一次
        changeName();
        changeAge();
    })
    // 方法
    function changeName() {
        person.value.name += '~';
    }
    function changeAge() {
        person.value.age++;
    }
    function changeCarOne() {
        person.value.car.one = '雅迪';
    }
    function changeCarTwo() {
        person.value.car.two = '爱玛';
    }
    function changeAllCar() {
        person.value.car = { one: 'f1', two: 'f4' };
    }

    return { person, domainName, changeName, changeAge, changeCarOne, changeCarTwo, changeAllCar }
}
```

在页面中调用`hooks`的函数。

```vue
<script setup lang="ts">
import usePerson from '@/hooks/usePerson';
// 解构赋值，使用hooks
const {
  person,
  domainName,
  changeName,
  changeAge,
  changeCarOne,
  changeCarTwo,
  changeAllCar
} = usePerson();
</script>
```

##### 路由

基本使用

```typescript
// 1.创建路由文件router/index.ts
import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '@/pages/home.vue';
import Person from '@/pages/person.vue';
import Help from '@/pages/help.vue';

const router = createRouter({
    // 写法与Vue2中有所差别，Vue2中为mode:'history'
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/person',
            name: 'person',
            component: Person
        },
        {
            path: '/help',
            name: 'help',
            component: Help
        }
    ]
});

export default router;
```

```typescript
// 2.在main.ts中进行全局注册
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index';

const app = createApp(App);
app.use(router)
```

```vue
<script setup lang="ts">
import Header from '@/components/header.vue';
</script>

<template>
  <div class="container">
    <Header />
    <div class="main">
      <!-- 在App.vue中使用router-view进行占位 -->
      <RouterView></RouterView>
    </div>
  </div>
</template>
```

注意：当路由切换时，之前的页面将被卸载`onUnmounted`，新的页面将被挂载`onMounted`。

路由的工作模式

`history`模式的优缺点？

优点：`url`更加美观，不带`#`。

缺点：项目上线时，需要在`ngnix`中配置重定向`try_files`。

`hash`模式的优缺点？

优点：兼容性更好，不需要服务器端处理路径。

缺点：`url`中带有`#`，且`SEO`优化方面相对较差。

后台项目更在乎稳定，常采用`hash`模式。前台项目客户使用，常采用`history`模式。

------

传参？

传参的方式，有`query`和`params`两种。

使用`query`

```typescript
function onPush(route: RouteRecordRaw) {
    if (route.name === 'person') {
        router.push({
            name: route.name,
            query: {
                money: '10w'
            }
        })
    } else {
        router.push({
            name: route.name
        })
    }
}
```

接收参数是需要使用到`useRoute`。且该方法调用后，创建的是当前页面的`Proxy`实例。

```vue
<script setup lang="ts">
import { toRefs } from 'vue';
import { useRoute } from 'vue-router';
// Proxy实例，为reactive定义的响应式对象类型
let route = useRoute();
// 解构赋值，防止丢失响应式
let { query } = toRefs(route);
</script>

<template>
  <div class="person">
    <div>薪资:{{ query.money }}</div>
  </div>
</template>
```

使用`params`

首先要在路由中配置

```typescript
{
    // id可选参数
    path: '/person/:id?/:money',
    name: 'person',
    component: Person,
},
```

传参和接收参数与`query`一致。

------

`push`和`replace`？

`push`就是将页面推入栈内。从`A`页面到`B`页面，再从`B`页面到`C`页面，依次将`A、B、C`压栈。因此可以查看历史记录。

`replace`是对页面进行了替换，因此无法查看历史记录。

------

编程式路由导航？

将`router-link`进行了替代，结合`push`和`replace`方法使用。

在`Vue2`中，编程式路由导航，重复跳转，将会报错。而在`Vue3`中则不会。

##### pinia

与`vuex`相同，都是用于集中式状态管理。

`store`是`pinia`的一个具体体现。

首先采用`OptionsAPI`的写法

```typescript
import { defineStore } from 'pinia';
// 注意命名方式
export const useCountStore = defineStore('count', {
    state() {
        return { num: 0, des: '默认描述' }
    },
    // 动作函数
    actions: {
        test(num: number, des: string) {
            // 添加封装逻辑
            console.log('调用动作函数');
        }
    },
    // 对数据进行二次加工
    getters: {
        bigSum(state) {
            return state.num * 10;
        }
    }
})
```

在`main.ts`中引入

```typescript
import { createPinia } from 'pinia';
const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
```

具体使用时，修改`state`数值的方式有三种。

```vue
<script setup lang="ts">
import { useCountStore } from '@/store/count';
import { storeToRefs } from 'pinia';
const countStore = useCountStore();
// num是ObjectRefImpl实例。但是进行解构赋值，将丧失响应式。
// let { num, des } = countStore;
// storeToRefs仅将其中的state数据转换为响应式。
let { num, des, bigSum } = storeToRefs(countStore);
function add() {
    // 方式一：不同于Vue2中的store，数据只能通过action进行修改。pinia可以直接修改。
    num.value++;
}
function divide() {
    num.value--;
}
function reset() {
    // 方式二：调用patch方法进行部分更新，或者全部更新
    countStore.$patch({
        num: 100,
        des: '重新赋值'
    })
    // 方式三：调用动作函数，函数中可对state数据进行操作
    countStore.test(num.value, des.value);
    // getters内部的方法，有些类似于计算属性
    console.log(countStore.bigSum)
}
</script>

<template>
    <div>数目:{{ num }}</div>
    <div>描述:{{ des }}</div>
    <div>扩大10倍的数据:{{ bigSum }}</div>
    <button @click="add">加</button>
    <button @click="divide">减</button>
    <button @click="reset">重新赋值</button>
</template>
```

实际开发时，更习惯将`store`编写为`CompositionAPI`的形式。

`state`转换为`ref`或者`reactive`定义的响应式数据，`actions`转换为方法，`getters`转换为计算属性。

```typescript
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useCountStore = defineStore('count', () => {
    // 数据
    let num = ref(0);
    let des = ref('默认描述')
    // 数据（计算属性）
    let bigSum = computed(() => {
        return num.value * 10;
    })
    // 方法
    function test(num: number, des: string) {
        // 添加封装逻辑
        console.log('调用动作函数');
    }
    return { num, des, bigSum, test };
})
```

`$subscribe`（每次state的变化都会被监听到）

```typescript
// 因此可以用于将数据存储到缓存中
countStore.$subscribe((mutation, state) => {
    localStorage.setItem('data', JSON.stringify(state));
})
```

##### 组件通信

方式一：`props`。

方式二：自定义事件（专门用于子传父）。

父组件

```vue
<script setup lang="ts">
import Son from '@/components/son.vue';
import { ref } from 'vue';
let str = ref('');
function saveValue(a: number, b: number) {
    str.value = `[a:${a}、b:${b}]`
}
</script>

<template>
    <div class="father">
        <div>父组件</div>
        <div>从子组件获取数据为{{ str }}</div>
        <!-- 1.父组件中绑自定义事件 -->
        <!-- 事件的命名为kebab-case。当子组件中该事件调用时，即执行回调saveValue） -->
        <Son @get-value="saveValue" />
    </div>
</template>
```

子组件

```vue
<script setup lang="ts">
// 2.声明自定义事件
const emit = defineEmits(['get-value']);
function sendData() {
    let a = Math.random();
    let b = Math.random();
    // 3.调用自定义事件，a和b为reset参数
    emit('get-value', a, b);
}
</script>

<template>
    <div class="son">子组件</div>
    <button @click="sendData">给父组件传递数据</button>
</template>
```

方式三：扩展依赖`Mitt`，可以实现任意组件之间的通信。但是注意销毁组件时，也需要销毁，防止内存泄漏。

方式四：`v-model`

`UI`组件库很多都是通过`v-model`进行组件通信的。

为什么`v-model`是双向绑定的？

```vue
<div>
    <MyInput v-model="userName" />
    <!-- 该语句等同于 -->
    <!-- <MyInput :modelValue="userName" @update:modelValue="userName = $event" /> -->
</div>
```

因此需要在组件中实现`:modelValue（defineProps）`和`@update:modelValue（defineEmits）`。

```vue
<script setup lang="ts">
// 对props进行实现
const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    }
})
// 对emit进行实现
const emit = defineEmits(['update:modelValue']);
function onInput(event: Event) {
    let el = event.target as HTMLInputElement;
    emit('update:modelValue', el.value);
}
</script>

<template>
    <input :value="modelValue" @input="onInput" />
</template>
```

甚至在一个组件中，我们可以使用多个`v-model`。

```vue
<LoginForm v-model:name="loginForm.name" v-model:password="loginForm.password" />
```

在组件中实现时

```vue
<script setup lang="ts">
// 对props进行实现
const props = defineProps({
    name: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: ''
    }
})
// 对emit进行实现
const emit = defineEmits(['update:name', 'update:password']);
function onInputName(event: Event) {
    let el = event.target as HTMLInputElement;
    emit('update:name', el.value);
}
function onInputPassword(event: Event) {
    let el = event.target as HTMLInputElement;
    emit('update:password', el.value);
}
</script>
```

方式五：`$attrs`，实现祖先与后代之间的传递，常用于组件继承。

方式六：`$refs、$parent`

`$refs`用于同时操纵多个子组件内部的数据，`$parent`用于操纵父组件内部的数据。

方式七：`provide(提供)、inject(注入)`用于隔代相互传递数据与方法。

##### 插槽

插槽有三种：默认插槽、具名插槽、作用域插槽

为什么使用`UI`组件库中的`table`时，能够通过插槽获取`row(每一行)`数据？

```vue
<template>
  <el-table :data="tableData">
    <el-table-column>
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
```

通过作用域插槽，将子组件内部的数据传递给父组件。

```vue
<script setup lang="ts">
const props = defineProps({
    dataSource: {
        type: Array<{ id: number, name: string }>,
        default: () => {
            return [];
        }
    }
})
</script>

<template>
    <div v-for="(item, index) in dataSource" :key="index">
        id:{{ item.id }}、name:{{ item.name }}
        <!-- 将每一行的数据传输给父组件 -->
        <slot name="option" :record="item"></slot>
    </div>
</template>
```

```vue
<template>
    <MyList :dataSource="list">
        <template #option="{ record }">
            <button @click="onClickRow(record)">查看</button>
        </template>
    </MyList>
</template>
```

##### 其他API

`shallowRef、shallowReactive`

数据具有浅层的响应式（常用于对大型数据结构的性能优化或是与外部的状态管理系统集成）

```typescript
let state = shallowRef({ count: 1 })
// 不会触发更改
state.value.count = 2
// 会触发更改
state.value = { count: 2 }
```

```typescript
let state = shallowReactive({
  foo: 1,
  nested: {
    bar: 2
  }
})
// 更改状态自身的属性是响应式的
state.foo++
// ...但下层嵌套对象不会被转为响应式
isReactive(state.nested) // false
// 不是响应式的
state.nested.bar++
```

`readonly、shallowReadonly`

只读代理是深层的：对任何嵌套属性的访问都将是只读的。它的`ref`解包行为与`reactive`相同，但解包得到的值是只读的。要避免深层级的转换行为，请使用`shallowReadonly`。

```typescript
const original = reactive({ count: 0 })
const copy = readonly(original)
watchEffect(() => {
  // 用来做响应性追踪
  console.log(copy.count)
})
// 更改源属性会触发其依赖的侦听器
original.count++
// 更改该只读副本将会失败，并会得到一个警告
copy.count++
```

`customRef`

常常被写在`hooks`中，`customRef`接收两个参数，分别是`track`、`trigger`。

`track`：通知`Vue`，该数据需要被跟踪。

`trigger`：通知`Vue`，该数据已经被修改。

举例：编写一个延迟显示的响应式信息。

```typescript
import { customRef } from "vue";

export default function (initValue: string, delay: number) {
    let timer: number;
    let msg = customRef((track, trigger) => {
        return {
            get: () => {
                track();
                return initValue;
            },
            set: (value: string) => {
                timer = setTimeout(() => {
                    // 每次set都会导致定时器的创建，因此需要先销毁
                    // 防抖
                    clearTimeout(timer);
                    initValue = value;
                    trigger();
                }, delay)
            }
        }
    })
    return { msg };
}
```

```vue
<script setup lang="ts">
import useCustomMsg from '@/hooks/useCustomMsg';
let { msg } = useCustomMsg('', 5000);
</script>

<template>
    <div>
        <input v-model="msg" />
        <div>{{ msg }}</div>
    </div>
</template>
```

`toRaw、markRaw`

`toRaw`，当把响应式对象暴露给第三方库时，为了确保第三方库的方法修改该响应式对象，但是不影响当前页面，暴露前使用`toRaw`将其转换为普通对象。

```typescript
const foo = {}
const reactiveFoo = reactive(foo)
console.log(toRaw(reactiveFoo) === foo) // true
```

`markRaw`，将一个对象标记，使其永远不能转换为响应式数据。比如引用第三方库的数据，如`mockjs`。为了防止之后误操作将其转换为响应式，先进行标记。

`Teleport`

`<Teleport>` 是一个内置组件，它可以将一个组件内部的一部分模板传送到该组件的`DOM`结构外层的位置去。

```vue
<template>
    <!-- to指向追加到的位置 -->
    <Teleport to="body">
        <div class="help">
            <div>数目:{{ num }}</div>
            <div>描述:{{ des }}</div>
            <div>扩大10倍的数据:{{ bigSum }}</div>
            <button @click="add">加</button>
            <button @click="divide">减</button>
            <button @click="reset">重新赋值</button>
        </div>
    </Teleport>
</template>
<style scoped>
.help {
    margin-top: 100px;
    position: fixed;
    left: 50%;
}
</style>
```

`Suspense`

该组件仍然是实验性的，常用于`setup`中存在异步操作。

```vue
<script setup>
const res = await fetch(...)
const posts = await res.json()
</script>
<template>
  {{ posts }}
</template>
```

```vue
<Suspense>
  <!-- 具有深层异步依赖的组件 -->
  <Dashboard />
  <!-- 在 #fallback 插槽中显示 “正在加载中” -->
  <template #fallback>
    Loading...
  </template>
</Suspense>
```

#### Vue2 

##### MVVM

`MVVM`是`Model-View-ViewModel`的简写。

1. `M`：模型（`Model`）：`Vue`实例中`data`配置项里的数据。
2. `V`：视图（`View`）：模板。
3. `VM`：视图模型（`ViewModel`）：`Vue`实例对象。

<div style="margin:0 auto;border:2px solid #42b883">
    <img src=".\MVVM.png">
</div>

##### 数据代理

`Vue`借助`Object.defineProperty`实现数据代理，使更加方便的操纵`data`中的数据。

```html
<script type="module">
    import Vue from './vue.js';
    const vm = new Vue({
        data() {
            return {
                name: 'songyx',
                age: 26
            }
        }
    })
    vm.name = 'oldMan';
    vm.age = 80;
    console.dir(vm);
</script>
```

```typescript
function Vue(options) {
    if (options.data) {
        let data = options.data();
        this._data = data;
        // 将data添加至vm
        for (const key in data) {
            Object.defineProperty(this, key, ({
                get: () => {
                    return data[key];
                },
                set: (value) => {
                    data[key] = value;
                },
                enumerable: true,
                configurable: true
            }))
        }
    }
}
export default Vue;
```

<div style="margin:0 auto;border:2px solid #42b883">
    <img src=".\数据代理.png">
</div>

在`MVVM`模型中，`data`中数据的变化都会反映在`<template>`中，因此实现了响应式。

其他入参：
1. `value`，属性值。
2. `writable`，该属性是否可写，默认`false`。
3. `configrable`该属性是否配置，以及可否删除，默认`false`。
4. `enumerable`该属性是否可枚举，默认`false`。

用了`value/writable`其一，就不能用`get/set`了。不过`configurable`与`enumerable`这两个属性可以与上面两种属性任意搭配。

##### 事件修饰符

```vue
<template>
  <div>1.事件修饰符:prevent-防止执行预设的行为</div>
  <div>
    <a href="#" @click.prevent="onClickLink">点击，但是阻止默认跳转</a>
  </div>
  <div>2.事件修饰符:stop-阻止事件冒泡</div>
  <div @click="onClickOutside">
    outside
    <!-- 注意修饰符的添加位置 -->
    <button @click.stop="onClickInside">inside</button>
  </div>
  <div>3.事件修饰符:once-事件只执行一次</div>
  <div>
    <button @click.once="onClickOnce">只能执行一次</button>
  </div>
  <div>4.事件修饰符:capture-使用事件的捕获模式:先捕获后冒泡，捕获从外到内</div>
  <!-- 注意修饰符的添加位置 -->
  <div @click.capture="onClickOutside">
    outside
    <button @click="onClickInside">inside</button>
  </div>
  <div>5.事件修饰符:self-只有event.target是当前操作的元素时才触发事件</div>
  <!-- 同样实现了阻止冒泡的效果 -->
  <div @click.self="onClickOutside">
    outside
    <button @click="onClickInside">inside</button>
  </div>
</template>
```

此外还有`passive`事件的默认行为立即执行，无需等待事件回调执行完毕。

##### computed vs watch

1.  当`computed`与`watch`均能实现需求时，`computed`的实现更为简单。
2. `computed`中不能包含异步操作，而`watch`中可以。

```typescript
// Vue3，页面中未成功加载domainName
let domainName = computed(() => {
    let value = '';
    console.log(`name的值${name.value}发生变化，就重新计算`);
    setTimeout(() => {
        value = name.value.substring(0, 1) + (Math.random() * 10000).toFixed(0);
        console.log(value);
    }, 2000);
    return value;
})
```

##### v-for中key的原理

当对数据进行了**破坏顺序(逆序添加、逆序删除)**的操作，且使用`index`作为`key`，将可能会出现`BUG`。

<div style="margin:0 auto">
    <img src=".\key原理示例.png">
</div>

虚拟`DOM`对比算法，比较时遍历新的虚拟`DOM`列表，以`key`为基准。
<div style="margin:0 auto">
    <img src=".\key原理.png">
</div>
##### 数据监测

数据代理给属性添加`getter`和`setter`，当`setter`被调用，`<template>`中的数据就发生变化。

对于对象，`Vue2`会递归给每个属性都添加上`getter`和`setter`。

对于数组，`Vue2`则不会。

```typescript
data() {
    return {
        name: 'songyx',
        age: 26,
        hobby: ['game', 'bicycle'],
        info: {
            address: 'chengdu',
            job: '牛马'
        }
    }
},
methods: {
    onChangeHobby() {
        // 每个元素上并不存在getter/setter方法
        // 不生效
        // this.hobby[0] = '打游戏';
        // this.hobby[1] = '骑行';
        // 整个对象上存在getter/setter方法，因此生效
        this.hobby = ['打游戏', '骑行'];
    }
}
```

<div style="margin:0 auto;border:2px solid #42b883">
    <img src=".\监测数据.png">
</div>

```typescript
onChangeHobby() {
    // 此外，Vue2封装了数组的操作方法
    // 封装：首先调用数组自带的方法，然后继续渲染虚拟DOM等操作
    // 生效
    this.hobby.splice(1, 1, '骑行');
},
```

`Vue.set()、this.$set()`

`Vue2`中可以借助`set`方法添加数据，这样的数据将会是响应式的。

```typescript
onAddSex() {
    // 给data内的对象添加属性，直接给data添加属性则会获得一个警告
    this.$set(this.info, 'sex', '男');
},
onAddHobby() {
    // 添加数据至数组
    this.$set(this.hobby, this.hobby.length, 'football');
},
```

##### v-model修饰符

1. `v-model.lazy`：失去焦点再收集数据。
2. `v-model.number`：输入字符串转换为有效的数字。
3. `v-model.trim`：字符串首尾空格过滤。

##### 过滤器
过滤器可以用在两个地方：双花括号插值和`v-bind`表达式。

```vue
<template>
  <div>
    <h3 :id="id | test">{{ message | test }}</h3>
  </div>
</template>
<script>
export default {
  data () {
    return {
      id: 'testId',
      message: '测试'
    }
  },
  filters: {
    test: function (value) {
      let parrern = new RegExp('^[a-zA-Z]+$')
      return parrern.test(value) ? value : value + '文本'
    }
  }
}
</script>
```

显示结果如下：`<h3 id="testId">测试文本</h3>`

此外，还有全局过滤器。

##### v-cloak

```vue
<div v-cloak>
  {{ message }}
</div>
```

```css
[v-cloak] {
  display: none;
}
```

当使用直接在`DOM`中书写的模板时，网速过慢，用户可能先看到的是还没编译完成的双大括号标签，直到挂载的组件将它们替换为实际渲染的内容。

`v-cloak` 会保留在所绑定的元素上，直到相关组件实例被挂载后才移除。

##### v-once

仅渲染元素和组件一次，并跳过之后的更新。可用于性能优化。

##### v-pre

元素内具有 `v-pre`，所有`Vue`模板语法都会被保留并按原样渲染。

最常见的用例：显示原始双大括号标签及内容。

##### 生命周期

| 创建-创建组件时触发                         | beforeCreate(){}  | created(){}   |
| ------------------------------------------- | ----------------- | ------------- |
| 挂载-将组件放置于页面中时触发               | beforeMount(){}   | mounted(){}   |
| 更新-钩子函数的调用次数取决于数据变化的次数 | beforeUpdate(){}  | updated(){}   |
| 销毁-组件销毁时触发                         | beforeDestory(){} | destoryed(){} |

<div style="margin:0 auto">
    <img src=".\生命周期.png">
</div>
##### 自定义指令

自定义指令：函数式

```vue
<body>
    <div id="app">
        <!-- 注意多词时自定义指令的写法 -->
        <div v-big-age="age"></div>
    </div>
</body>

<script>
    // 全局定义自定义指令
    Vue.directive('big-age', function (element, binding) {
        element.innerHTML = `年龄放大10倍：${binding.value * 10}`;
    })
    const vm = new Vue({
        el: '#app',
        data() {
            return {
                age: 26
            }
        },
        directives: {
            'big-age'(element, binding) {
                element.innerHTML = `年龄放大10倍：${binding.value * 10}`;
            }
        }
    })
</script>
```

自定义指令：对象式

```vue
<body>
    <div id="app">
        <label>数值:</label>
        <input v-focus="value" />
        <button @click="onChangeValue">增加数值</button>
    </div>
</body>

<script>
    const vm = new Vue({
        el: '#app',
        data() {
            return {
                value: 0
            }
        },
        methods: {
            onChangeValue() {
                this.value++
            }
        },
        directives: {
            focus: {
                // 钩子：指令与元素成功绑定时调用
                bind(element, binding) {
                    element.value = binding.value;
                },
                // 钩子：指令所造元素被插入页面时调用
                inserted(element, binding) {
                    // 获取焦点
                    element.focus();
                },
                // 钩子：指令所在模板结构被重新解析时调用
                update(element, binding) {
                    // 更新数据
                    element.value = binding.value;
                    // 重新获取焦点
                    element.focus();
                },
            }
        }
    })
</script>
```

##### 对组件的理解

```vue
<body>
    <div id="app">
        <div>{{value}}</div>
        <school />
    </div>
</body>
<script>
    let school = Vue.extend({
        template: `<div>{{address}}</div>`,
        data() {
            return {
                address: 'chengdu'
            }
        },
    })
    console.dir(school);
    const vm = new Vue({
        el: '#app',
        // data既可以是函数式，也可以是对象式
        data: {
            value: 0
        },
        components: {
            school
        }
    })
    // true
    console.log(school.prototype.__proto__ === Vue.prototype);
</script>
```

1. `Vue.extend(extendOptions)`的入参基本与`new Vue(options)`一致。但是组件中的`data`必须为函数式，后者既可以是函数式，也可以是对象式。**这是为了当组件被多次使用时，数据都是重新创建的，之间不存在相互干扰**。
2. `Vue.extend`的返回值为构造函数`function VueComponent(options) {}`。但是每次调用的返回值都是一个新的构造函数，这是由源码决定的。且当在`<template>`中使用了组件，则`Vue`会创建组件实例，即`new VueComponent()`，因此组件中的`this`指向该实例。
```javascript
Vue.extend = function (extendOptions) {
    // ...
    var Sub = function VueComponent(options) {
        this._init(options);
    };
    // ...
    return Sub
};
```
3. `VueComponent.prototype.__proto__ === Vue.prototype`。通过该关系式，借助于原型链，**使得组件的实例可以使用Vue原型对象上的数据与方法**。

<div style="margin:0 auto">
    <img src=".\组件原型链.jpg">
</div>
##### 全局事件总线

往`Vue`原型对象上添加数据或方法，则全局（包括组件内）都可以使用，都依赖于原型链。

```typescript
new Vue({
  render: h => h(App),
  // 安装全局事件总线
  beforeCreate() {
    Vue.prototype.$bus = () => {
      console.log('全局方法');
    }
  }
}).$mount('#app')
```

##### render

当引入的`vue`为不能解析`<template>`的版本，就需要`render`函数。

```javascript
import Vue from 'vue'
import App from './App.vue'
new Vue({
  // 简写方式
  // render: h => h(App),
  render(createElement) {
    // 当传入为组件时
    return createElement(App);
    // 当传入为DOM时
    // return createElement('div', 'text');
  }
}).$mount('#app')
```

##### mixin

当组件使用混入对象时，所有混入对象的选项将进入该组件本身的选项。

混入时的合并操作：

1. 数据对象在内部会进行递归合并，并在发生冲突时以组件数据优先。
2. 同名钩子函数将都将被调用，但混入对象的钩子将在组件自身钩子之前调用。
3. `methods、components 和directives`合并时，若两个对象键名发生冲突，以组件对象优先。

##### $nextTick

```vue
<template>
    <div>
        <label>我的输入框：</label>
        <input v-if="editFlag" ref="myInputRef" v-model="myInputValue" />
        <span v-else>{{ myInputValue }}</span>
        <button @click="onClick">修改</button>
    </div>
</template>

<script>
export default {
    name: 'myInput',
    data() {
        return {
            editFlag: false,
            myInputValue: 'defaultText'
        }
    },
    methods: {
        onClick() {
            this.editFlag = true;
            // 报错：由于dom元素未完成加载，该方法无法生效
            this.$refs.myInputRef.focus();
        }
    }
}
</script>
```

修改`editFlag`后，并不会立即重新解析模板，而是等代码全部执行完毕。

有三种方式解决该问题。

方式一：生命周期函数`updated`。

```javascript
updated() {
    this.$refs.myInputRef.focus();
}
```

方式二：放入异步函数中。

```javascript
onClick() {
    this.editFlag = true;
    setTimeout(() => {
        this.$refs.myInputRef.focus();
    }, 0);
}
```

方式三：使用`$nextTick`。

```javascript
onClick() {
    this.editFlag = true;
    this.$nextTick(() => {
        this.$refs.myInputRef.focus();
    })
}
```

`$nextTick`的作用是，在下一次`DOM`更新结束后执行其指定的回调。

##### 过渡

`Vue`中有6种过渡类名，具体使用方式如下：

```vue
<transition name="fade" mode="out-in">
    <router-view :key="key" />
</transition>
<style>
.fade-leave-active,
.fade-enter-active {
  transition: all 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
```

`Vue`中有2种过渡模式。`in-out`：新元素先进行过渡，完成之后当前元素过渡离开。`out-in`：当前元素先进行过渡，完成之后新元素过渡进入。

##### Vuex

<div style="margin:0 auto;">
    <img src=".\Vuex构成.jpg">
</div>

`state`是存储的单一状态，是存储的基本数据。

`getters`是`store`的计算属性，对`state`的加工，是派生出来的数据。就像`computed`计算属性一样，`getter`返回的值会根据它的依赖被缓存起来，且只有当它的依赖值发生改变才会被重新计算。

`mutations`提交更改数据，使用`store.commit`方法更改`state`存储的状态。

`actions`像一个装饰器，提交`mutation`，而不是直接变更状态，可以包含任何**异步操作**。

`Module`是`store`分割的模块，每个模块拥有自己的`state、getters、mutations、actions`。

##### activated、deactivated

这两个钩子（激活、失活），只有使用了`keep-alive`时才起作用。

使用场景：页面中有计数器，但是页面被缓存了，因此使用`beforeDestory`，无法销毁计时器，而使用`deactivated`可以解决这个问题。

##### 路由守卫

不同组件之间路由跳转的执行顺序：

1. 导航被触发（A–>B）
2. 调用A组件内路由守卫`beforeRouteLeave(to,from,next)`
3. 调用全局路由前置守卫`router.beforeEach(to,from,next)`
4. 调用B路由独享守卫 `beforeEnter(to,from,next)`
5. 解析异步路由组件B
6. 调用B的组件内路由守卫`beforeRouteEnter(to,from,next)`
7. 调用全局路由解析守卫` router.beforeResolve(to,from,next)`
8. 导航被确认
9. 调用全局路由钩子`router.afterEach(to,from)`
10. 渲染B组件`DOM`

#### Tips

##### 编写函数

1. 被`Vue`管理的函数，应当写成普通函数，这样`this`的指向为`vm`或组件实例对象。
2. 不被`Vue`管理的函数（定时器回调、`ajax`回调），应当写成箭头函数，这样`this`的指向为`vm`或组件实例对象。

##### Vue3的改变

1. 全局API的转移，如`Vue.prototype > app.config.globalProperties`。
2. `data`都必须声明为函数，即使不是组件中的。
3. 过度类名，更加语义化。
4. 移除`keyCode`作为`v-on`的修饰符，如`@keyup.13`。
5. 移除事件修饰符`.native`（为了避免组件上的方法被视为自定义事件，如`@click.native`）。
6. 移除过滤器，因为其具有实现成本，打破了`{{}}`内只有`js`的假设，推荐使用计算属性。
7. ...