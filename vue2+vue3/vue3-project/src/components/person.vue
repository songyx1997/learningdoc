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

<template>
  <div class="person">
    <div>姓名:{{ person.name }}</div>
    <div>年龄:{{ person.age }}</div>
    <div>汽车:{{ person.car.one }}、{{ person.car.two }}</div>
    <div>域名:{{ domainName }}</div>
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