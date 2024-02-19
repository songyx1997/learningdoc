<script setup lang="ts">
import { useCountStore } from '@/store/count';
import { storeToRefs } from 'pinia';

const countStore = useCountStore();
// num是ObjectRefImpl实例。但是进行解构赋值，将丧失响应式。
// let { num, des } = countStore;
// storeToRefs仅将其中的state数据转换为响应式。
let { num, des, bigSum } = storeToRefs(countStore);

function add() {
    // 不同于Vue2中的store，数据只能通过action进行修改。pinia可以直接修改。
    num.value++;
}

function divide() {
    num.value--;
}

function reset() {
    // 调用patch方法进行部分更新，或者全部更新
    countStore.$patch({
        num: 100,
        des: '重新赋值'
    })
    // 调用动作函数
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

<style scoped>
button {
    width: 80px;
    margin-right: 10px;
}
</style>