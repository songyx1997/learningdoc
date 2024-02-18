import { ref, computed, onMounted } from 'vue';

// 默认暴露，使用函数包裹，并提供自定义返回值
export default function () {
    // 数据
    let person = ref({
        name: 'songyx',
        age: 26,
        car: { one: '奔驰', two: '奥迪' }
    })
    // 数据（计算属性）
    let domainName = computed(() => {
        return person.value.name.substring(0, 2).toUpperCase() + (Math.random() * 1000).toFixed(0);
    })

    // 方法（钩子函数）
    onMounted(() => {
        // 进入页面，就调用一次
        changeName();
        changeAge();
    })
    // 方法
    function changeName() {
        person.value.name += '~';
    }
    function changeAge() {
        person.value.age++;
    }
    function changeCarOne() {
        person.value.car.one = '雅迪';
    }
    function changeCarTwo() {
        person.value.car.two = '爱玛';
    }
    function changeAllCar() {
        person.value.car = { one: 'f1', two: 'f4' };
    }

    return { person, domainName, changeName, changeAge, changeCarOne, changeCarTwo, changeAllCar }
}