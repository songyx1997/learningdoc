<script setup lang="ts">
// 1.声明自定义事件
const emit = defineEmits(['get-value']);
function sendData() {
    let a = Math.random();
    let b = Math.random();
    // 2.调用自定义事件，a和b为reset参数
    emit('get-value', a, b);
}
</script>

<template>
    <div class="son">子组件</div>
    <button @click="sendData">给父组件传递数据</button>
</template>

<style lang="less" scoped>
.son {
    background-color: aqua;
}
</style>