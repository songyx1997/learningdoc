<script setup lang="ts">
// 对props进行实现
const props = defineProps({
    name: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: ''
    }
})
// 对emit进行实现
const emit = defineEmits(['update:name', 'update:password']);
function onInputName(event: Event) {
    let el = event.target as HTMLInputElement;
    emit('update:name', el.value);
}
function onInputPassword(event: Event) {
    let el = event.target as HTMLInputElement;
    emit('update:password', el.value);
}
</script>

<template>
    <div>
        <input :value="name" @input="onInputName" />
    </div>
    <div>
        <input :value="password" @input="onInputPassword" />
    </div>
</template>

<style lang="less" scoped>
div {
    margin-top: 5px;
}
</style>