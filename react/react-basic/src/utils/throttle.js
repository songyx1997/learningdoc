function throttle(func, delay) {
  let lastExecutionTime = 0;
  let timer = null;
  return function (...args) {
    const now = Date.now();
    const remainingTime = delay - (now - lastExecutionTime);
    if (remainingTime <= 0) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      func.apply(this, args);
      lastExecutionTime = now;
    } else if (!timer) {
      timer = setTimeout(() => {
        func.apply(this, args);
        lastExecutionTime = Date.now();
        timer = null;
      }, remainingTime);
    }
  };
}
export default throttle;
