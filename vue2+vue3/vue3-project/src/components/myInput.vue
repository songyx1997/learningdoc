<script setup lang="ts">
// 对props进行实现
const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    }
})
// 对emit进行实现
const emit = defineEmits(['update:modelValue']);
function onInput(event: Event) {
    let el = event.target as HTMLInputElement;
    emit('update:modelValue', el.value);
}
</script>

<template>
    <input :value="modelValue" @input="onInput" />
</template>

<style lang="less" scoped></style>