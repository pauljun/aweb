export default class Queue {
    constructor() {
        this.list = []
    }

    /**
     * 批量加入队列
     * @param {Array} queues
     */
    concat(queues) {
        this.list.concat(queues)
    }

    /**
     * 加入队列
     * @param {string|num,Promise}
     *
     */
    push({ id, action, data }) {
        this.list.push({ id, action, data })
    }

    /**
     * 删除队列
     * @param {string} id
     */
    delete(id) {
        let index = this.list.findIndex(v => v.id === id)
        index > -1 && this.list.splice(index,1)
    }
    /**
     * 执行队列
     * @return 如果action是promise 回自动递归执行，否则需要手动执行队列
     */
    run() {
        if (!this.list[0]) {
            console.warn('当前队列已执行完成！')
            return false
        }
        let item = this.list[0]
        let promiseFn = item.action(item.data)
        if (Object.prototype.toString.call(promiseFn) === '[object Promise]') {
            promiseFn.then(() => {
                this.next()
            })
        }
    }

    /**
     * 非promise时手动执行下一个
     */
    next() {
        this.list.splice(0, 1)
        this.run()
    }
}
