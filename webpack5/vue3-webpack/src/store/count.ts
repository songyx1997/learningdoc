import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useCountStore = defineStore('count', () => {
    // 数据
    let num = ref(0);
    let des = ref('默认描述')
    // 数据（计算属性）
    let bigSum = computed(() => {
        return num.value * 10;
    })
    // 方法
    function test(num: number, des: string) {
        // 添加封装逻辑
        console.log('调用动作函数');
    }
    return { num, des, bigSum, test };
})