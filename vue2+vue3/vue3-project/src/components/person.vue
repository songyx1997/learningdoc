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
  // 整体赋值是不被允许的，将导致响应式失效
  // job = { work: '学生', seniority: 4 };
  // 使用该方法进行赋值
  Object.assign(job, { work: '学生', seniority: 4 });
}
</script>

<template>
  <div class="person">
    <div>姓名:{{ name }}</div>
    <div>年龄:{{ age }}</div>
    <div>工作信息(职业:{{ job.work }},工龄:{{ job.seniority }})</div>
    <button @click="changeName">修改姓名</button>
    <button @click="changeJob">修改职业</button>
  </div>
</template>

<style scoped></style>