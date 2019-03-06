/**
 * 自定义事件
 * author hjj
 */
class EventEmitter {
    constructor() {
        this.events = {};
    }
    getEvents() {
        return this.events;
    }
    once(eventName, listener) {
        return this.on(eventName, listener, 0);
    }
    on(eventName, listener, timer = -1) {
        let listeners = this.getListeners(eventName);
        listeners.push({
            listener,
            timer
        });
    }
    emit(eventName, ...args) {
        return this.trigger(eventName, args);
    }
    remove(eventName) {
        this.events[eventName] && delete this.events[eventName];
    }
    off(eventName, listener) {
        let listeners = this.getListeners(eventName);
        let index = listeners.findIndex(item => item.listener === listener);
        index !== -1 && listeners.splice(index, 1);
    }
    trigger(eventName, args) {
        let listeners = this.getListeners(eventName);
        for (let i = 0; i < listeners.length; i++) {
            let listener = listeners[i];
            if (listener) {
                listener.listener.apply(this, args || []);
                listener.timer === 0 && listeners.splice(i, 1);
                listeners.length === 0 && delete this.events[eventName];
                listener.timer !== -1 && listener.timer--;
            }
        }
    }
    getListeners(eventName) {
        return this.events[eventName] || (this.events[eventName] = []);
    }
}

export default EventEmitter