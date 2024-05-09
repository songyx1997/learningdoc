function throttle(func: Function, delay: number) {
  let lastExecutionTime = 0;
  let timer: NodeJS.Timeout | null;
  return function (...args: any[]) {
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

export { throttle };