import { sum, success } from './common/util'
import '@/assets/css/reset.css'
import '@/assets/less/base.less'

console.log(sum(1, 2));
console.log(success());

const el = document.getElementById('demand-loading-one') as HTMLButtonElement;
el.onclick = function () {
    // webpack魔法命名
    import(
        /* webpackChunkName: 'method' */
        /* webpackPrefetch: true */
        './common/method'
    ).then((value) => {
        const { onDemandLoadingOne } = value;
        onDemandLoadingOne();
    }).catch(() => {
        console.log('模块加载失败~');
    })
}