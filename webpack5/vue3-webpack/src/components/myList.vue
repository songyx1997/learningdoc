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

<style lang="less" scoped></style>