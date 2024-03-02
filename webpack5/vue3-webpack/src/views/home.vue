<script setup lang="ts">
import Son from '@/components/son.vue';
import { ref, reactive } from 'vue';
import MyInput from '@/components/myInput.vue'
import LoginForm from '@/components/loginForm.vue'
let str = ref('');
function saveValue(a: number, b: number) {
    str.value = `[a:${a}、b:${b}]`
}
let userName = ref('');
let loginForm = reactive({ name: '', password: '' })
import MyList from '@/components/myList.vue'

let list = ref(
    [
        { id: 1, name: '张三' },
        { id: 2, name: '李四' },
        { id: 3, name: '王五' }
    ]
)

function onClickRow(record: any) {
    record.name += '~';
}
</script>

<template>
    <div>2.组件通信：自定义事件</div>
    <div class="father">
        <div>父组件</div>
        <div>从子组件获取数据为{{ str }}</div>
        <!-- 父组件中绑自定义事件 -->
        <!-- 事件的命名为kebab-case。当子组件中该事件调用时，即执行回调saveValue） -->
        <Son @get-value="saveValue" />
    </div>
    <div>4.组件通信：v-model</div>
    <div>
        <MyInput v-model="userName" />
        <!-- 该语句等同于 -->
        <!-- <MyInput :modelValue="userName" @update:modelValue="userName = $event" /> -->
    </div>
    <div>4.组件通信：多个v-model，实现登陆表单</div>
    <div>
        <LoginForm v-model:name="loginForm.name" v-model:password="loginForm.password" />
    </div>
    <div>5.作用域插槽</div>
    <div>
        <MyList :dataSource="list">
            <template #option="{ record }">
                <a-button type="primary" @click="onClickRow(record)">查看</a-button>
            </template>
        </MyList>
    </div>
</template>

<style scoped>
.father {
    background-color: red;
    padding-bottom: 10px;
}
</style>