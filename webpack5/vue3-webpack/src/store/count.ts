import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useCountStore = defineStore('count', () => {
    // 数据
    const num = ref(0);
    const des = ref('默认描述')
    // 数据（计算属性）
    const bigSum = computed(() => {
        return num.value * 10;
    })
    // 方法
    function test(num: number, des: string) {
        // 添加封装逻辑
        console.log(num);
        console.log(des);
        console.log('调用动作函数');
    }
    return { num, des, bigSum, test };
})