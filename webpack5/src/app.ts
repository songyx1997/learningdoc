import { sum } from './common/util'

console.log(sum(3, 4));

const el = document.getElementById('demand-loading-two') as HTMLButtonElement;
el.onclick = function () {
    import(
        /* webpackPrefetch: true */
        './common/method'
    ).then((value) => {
        const { onDemandLoadingTwo } = value;
        onDemandLoadingTwo();
    }).catch(() => {
        console.log('模块加载失败~');
    })
}