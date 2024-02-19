import { defineStore } from 'pinia';

export const useCountStore = defineStore('count', {
    state() {
        return { num: 0, des: '默认描述' }
    },
    // 动作函数
    actions: {
        test(num: number, des: string) {
            // 添加封装逻辑
            console.log('调用动作函数');
        }
    },
    // 对数据进行二次加工
    getters: {
        bigSum(state) {
            return state.num * 10;
        }
    }
})