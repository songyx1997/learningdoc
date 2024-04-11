<template>
  <div id="app">
    <myInput />
    <productDetail />
    <p>购物车页面一</p>
    <shoppingCart />
    <p>购物车页面二</p>
    <shoppingCart />
  </div>
</template>

<script>
import myInput from '@/components/my-input.vue';
import productDetail from '@/components/product-detail.vue';
import shoppingCart from '@/components/shopping-cart.vue';
export default {
  name: 'App',
  components: {
    myInput,
    productDetail,
    shoppingCart
  }
}
</script>