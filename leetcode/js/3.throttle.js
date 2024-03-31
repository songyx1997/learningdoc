// 高频事件，如快速点击、鼠标滑动、scroll事件

// 定时器创建后，在定时器的时间内，若再次触发事件，则不生效。

const throttle = function (fun, t) {
    let timer;
    return function (...args) {
        if (timer) {
            return;
        } else {
            timer = setTimeout(() => {
                fun(args);
                clearTimeout(timer)
            }, t);
        }
    }
}