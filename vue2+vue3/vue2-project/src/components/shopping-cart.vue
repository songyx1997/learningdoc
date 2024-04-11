<template>
    <div class="shopping-cart">
        <p>购物车清单</p>
        <div v-for="(item, index) in products" :key="index">
            商品名称：{{ item.productName }}、价格：{{ item.price }}<button @click="onDelete(item)">删除</button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'my-student',
    data() {
        return {
            products: []
        }
    },
    mounted() {
        // 订阅事件
        this.$bus.$on('addToCart', (item) => {
            this.products.push(item)
        });
        this.$bus.$on('deleteFromCart', (item) => {
            let index = this.products.indexOf(item);
            this.products.splice(index, 1);
        });
    },
    beforeDestroy() {
        // 解除订阅
        this.$bus.$off('addToCart');
        this.$bus.$off('deleteFromCart');
    },
    methods: {
        onDelete(item) {
            // 发布
            this.$bus.$emit('deleteFromCart', item);
        }
    }
}
</script>

<style scoped>
.shopping-cart {
    background-color: burlywood;
}
</style>