<script setup lang="ts">
import { ref } from 'vue';
let person = ref({
  name: 'songyx',
  age: 26,
  car: { one: '奔驰', two: '奥迪' }
})
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
</script>

<template>
  <div class="person">
    <div>姓名:{{ person.name }}</div>
    <div>年龄:{{ person.age }}</div>
    <div>汽车:{{ person.car.one }}、{{ person.car.two }}</div>
    <button @click="changeName">修改名字</button>
    <button @click="changeAge">修改年龄</button>
    <button @click="changeCarOne">修改第一辆汽车</button>
    <button @click="changeCarTwo">修改第二辆汽车</button>
    <button @click="changeAllCar">修改全部汽车</button>
  </div>
</template>

<style scoped>
.person {
  background-color: #f5f5f5;
  padding: 20px;
}

button {
  margin-top: 10px;
  margin-right: 10px;
}
</style>