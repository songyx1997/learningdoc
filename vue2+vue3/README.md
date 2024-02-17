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

<div style="display:flex;width:50%">
    <img src=".\webpack构建.png">
    <img src=".\vite构建.png">
</div>

##### OptionsAPI、CompositionAPI

`Vue2`采用的是`OptionsAPI`（配置项式）。

`Vue3`采用的是`CompositionAPI`（组合式）。采用函数的方式，更加优雅的组织代码，将相关功能的代码更加有有序的组织在一起。

<div style="display:flex;width:50%">
    <img src=".\OptionsAPI与CompositionAPI_1.gif">
    <img src=".\OptionsAPI与CompositionAPI_2.gif">
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