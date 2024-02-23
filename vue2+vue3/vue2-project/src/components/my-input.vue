<template>
    <div>
        <label>我的输入框：</label>
        <input v-if="editFlag" ref="myInputRef" v-model="myInputValue" />
        <span v-else>{{ myInputValue }}</span>
        <button @click="onClick">修改</button>
    </div>
</template>

<script>
export default {
    name: 'myInput',
    data() {
        return {
            editFlag: false,
            myInputValue: 'defaultText'
        }
    },
    methods: {
        onClick() {
            this.editFlag = true;
            this.$nextTick(() => {
                this.$refs.myInputRef.focus();
            })
        }
    }
}
</script>

<style scoped>
button {
    margin-left: 5px;
}
</style>