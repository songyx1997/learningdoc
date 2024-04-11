class EventHub {
    constructor() {
        this._events = {};
    }

    /**
     * 订阅事件
     * @param {string} eventType 事件类型
     * @param {function} handler 事件处理器
     */
    on(eventType, handler) {
        if (this._events[eventType]) {
            this._events[eventType].push(handler);
        } else {
            this._events[eventType] = [handler];
        }
    }

    /**
     * 取消订阅事件
     * @param {string} eventType 事件类型
     * @param {function} handler 事件处理器（可选，如果不传，则取消该类型的所有订阅）
     */
    off(eventType, handler) {
        if (!handler) {
            delete this._events[eventType];
            return;
        }
        if (this._events[eventType]) {
            this._events[eventType] = this._events[eventType].filter(item => item !== handler);
        }
    }

    /**
     * 发布事件
     * @param {string} eventType 事件类型
     * @param {...*} args 传递给事件处理器的参数
     */
    emit(eventType, ...args) {
        if (this._events[eventType]) {
            this._events[eventType].forEach(handler => handler(...args));
        }
    }

    /**
     * 一次性订阅事件（订阅一次后自动取消）
     * @param {string} eventType 事件类型
     * @param {function} handler 事件处理器
     */
    once(eventType, handler) {
        const onceHandler = (...args) => {
            // 1.全部取消
            this.off(eventType, onceHandler);
            // 2.执行一次
            handler.apply(this, args);
        };
        this.on(eventType, onceHandler);
    }
}

// 使用示例
const eventHub = new EventHub();

// 订阅事件
eventHub.on('productAdded', (productId, productName) => {
    console.log(`产品 ${productId} (${productName}) 加入购物车`);
});

// 一次性订阅事件
eventHub.once('productRemoved', (productId, productName) => {
    console.log(`产品 ${productId} (${productName}) 移出购物车`);
});

// 发布事件
eventHub.emit('productAdded', 3, '可乐');
eventHub.emit('productRemoved', 3, '可乐');
// 再次发布相同的事件，不再输出，因为之前的一次性订阅已经取消
eventHub.emit('productRemoved', 3, '可乐');