function calculatePrice(price, taxRate, discount) {
    return price * (1 + taxRate) * (1 - discount);
}

// 柯里化后，语义更加直观
function curriedCalculatePrice(price) {
    return function (taxRate) {
        return function (discount) {
            return price * (1 + taxRate) * (1 - discount);
        }
    }
}

function curry(f) {
    return function curried(...args) {
        if (args.length >= f.length) {
            // f.length表示函数的参数个数
            // 收集到的参数，已经多于原本函数的参数
            return f.apply(this, args)
        } else {
            // 函数还未收集完，继续递归收集
            return function (...moreArgs) {
                curried.apply(this, args.concat(moreArgs));
            }
        }
    }
}

curry(calculatePrice(100, 0.9, 0.5));