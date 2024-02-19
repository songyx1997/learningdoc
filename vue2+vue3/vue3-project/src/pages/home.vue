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
        <!-- 父组件中绑自定义事件 -->
        <!-- 事件的命名为kebab-case。当子组件中该事件调用时，即执行回调saveValue） -->
        <Son @get-value="saveValue" />
    </div>
</template>

<style scoped>
.father {
    background-color: red;
    height: 100px;
}
</style>