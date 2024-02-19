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

<div style="margin:0 auto;width:85%">
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
function getSubElement() {
  console.log(person.value.name)
  console.log(person.value.age)
  console.log(person.value.job)
  // 调用组件内部的方法
  person.value.changeJob();
}
</script>

<template>
  <Person ref="person" />
  <button @click="getSubElement">获取组件内部的数据与方法</button>
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

#### Vue2

##### 生命周期

| 创建-创建组件时触发                         | beforeCreate(){}  | created(){}   |
| ------------------------------------------- | ----------------- | ------------- |
| 挂载-将组件放置于页面中时触发               | beforeMount(){}   | mounted(){}   |
| 更新-钩子函数的调用次数取决于数据变化的次数 | beforeUpdate(){}  | updated(){}   |
| 销毁-组件销毁时触发                         | beforeDestory(){} | destoryed(){} |