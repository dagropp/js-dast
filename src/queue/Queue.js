import LinkedList from "../linked-list/LinkedList";
import ErrorCapacity from "../error/ErrorCapacity";

/**
 * Implementation of a linear collection which follows a particular order in which the operations are performed.
 * The order is First In First Out (FIFO).
 * @extends {Object}
 */
class Queue {
    /**
     * Sets this queue's list and items.
     * @param items {*} Items to add to this queue upon initialization.
     */
    constructor(...items) {
        /**
         * This queue's list.
         * @type {LinkedList}
         * @protected
         */
        this._list = new LinkedList(...items);
        /**
         * This queue capacity if set.
         * @type {number|Infinity}
         * @default Infinity
         * @private
         */
        this._capacity = Infinity;
    }

    /**
     * Sets the max capacity for this queue.
     * @param maxCapacity {number} The max capacity for this queue.
     * @throws {ErrorCapacity} If the set capacity is smaller than the current size
     */
    set capacity(maxCapacity) {
        if (maxCapacity >= this.size) {
            this._capacity = maxCapacity;
        } else {
            throw new ErrorCapacity("set", this.size, maxCapacity);
        }
    }

    /**
     * Returns the max capacity for this queue is set, Infinity otherwise.
     * @return {number|Infinity}
     * @type {number|Infinity}
     */
    get capacity() {
        return this._capacity;
    }

    /**
     * Returns the number of values in this queue.
     * @return {number}
     * @type {number}
     */
    get size() {
        return this._list.size;
    }

    /**
     * Removes the last element from the queue.
     * @return {*} The removed element from the queue, undefined if the queue is empty.
     */
    dequeue() {
        return this._list.pop();
    }

    /**
     * Adds one or more elements to the beginning of the queue.
     * If reached max capacity, for each new items removes the last element from the queue.
     * @param items {*} The elements to add to the front of the queue.
     * @return {number} The new size property of this queue.
     */
    enqueue(...items) {
        for (let i = items.length - 1; i >= 0; i--) {
            if (this.size >= this.capacity) {
                this.dequeue();
            }
            this._list.unshift(items[i]);
        }
        return this.size;
    }

    /**
     * Calls LinkedList.prototype.forEach method. Executes a provided function once for each queue element.
     * @param callback {Function} Function to execute on each element.
     */
    forEach(callback) {
        this._list.forEach(callback);
    }

    /**
     * Returns a boolean indicating whether an element with the specified value exists in this queue.
     * @param value {*} The value to test for presence in the this queue.
     * @return {boolean} True if an element with the specified value exists in this queue, false otherwise.
     */
    includes(value) {
        return this._list.includes(value);
    }

    /**
     * @return {boolean} True if this queue is empty, false otherwise.
     */
    isEmpty() {
        return this.size <= 0;
    }

    /**
     * @return {*} The value of the head of this queue.
     */
    peek() {
        return this._list.head.value;
    }

    /**
     * @return {string} String representation of this queue.
     * @override
     */
    toString() {
        return this._list.toString();
    }

    /**
     * Specifies the default iterator for queue.
     * @return {Generator} A new Iterator object that contains the values for each index in the queue.
     */
    [Symbol.iterator]() {
        return this._list[Symbol.iterator]();
    }

    /**
     * Creates a new, shallow-copied queue instance from an array-like or iterable object.
     * @param arrayLike {*} An array-like or iterable object to convert to queue.
     * @return {Queue} A new queue instance.
     */
    static from(arrayLike) {
        return new Queue(...arrayLike);
    }

    /**
     * Creates a new queue instance from a variable number of arguments.
     * @param items {*} Elements used to create the queue.
     * @return {Queue} A new queue instance.
     */
    static of(...items) {
        return new Queue(...items);
    }
}

export default Queue;