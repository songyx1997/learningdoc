<script setup lang="ts">
import Header from '@/components/header.vue';
</script>

<template>
  <div class="container">
    <Header />
    <div class="main">
      <!-- 页面占位 -->
      <RouterView></RouterView>
    </div>
  </div>
</template>

<style lang="less">
#app {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0;
  padding: 0;
}

.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
  padding: 20px;
}
</style>