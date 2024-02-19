<script setup lang="ts">
import { useRouter, type RouteRecordRaw } from 'vue-router';
let router = useRouter();
let { routes } = router.options;

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
</script>

<template>
    <div class="header-container">
        <div v-for="(route, index) in routes" :key="index" @click="onPush(route)">{{ route.name }}</div>
    </div>
</template>

<style lang="less" scoped>
.header-container {
    width: 100%;
    display: flex;
    justify-content: space-around;
    height: 60px;
    align-items: center;
    background: @base-grey;
    font-size: 20px;

    div {
        cursor: pointer;
    }
}
</style>
