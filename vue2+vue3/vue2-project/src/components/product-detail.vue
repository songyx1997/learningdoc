<template>
    <div class="product-detail">
        <div>
            商品名称：{{ productName }}
        </div>
        <div>
            价格{{ price }}
        </div>
        <button @click="onAddToCart">添加至购物车</button>
    </div>
</template>

<script>
export default {
    name: 'product-detail',
    data() {
        return {
            productName: '百事可乐',
            price: '3元'
        }
    },
    methods: {
        // 发布事件
        onAddToCart() {
            this.$bus.$emit('addToCart', { productName: this.productName, price: this.price });
        }
    }
}
</script>

<style scoped>
.product-detail {
    background-color: beige;
}
</style>