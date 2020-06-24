import LinkedList from "../linked-list/LinkedList";
import ErrorCapacity from "../error/ErrorCapacity";

/**
 * Implementation of a linear collection which follows a particular order in which the operations are performed.
 * The order is LIFO (Last In First Out).
 * @extends {Object}
 */
class Stack {
    /**
     * Sets this stack's list and items.
     * @param items {*} Items to add to this stack upon initialization
     */
    constructor(...items) {
        /**
         * This stack's list.
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
     * Sets the max capacity for this stack.
     * @param maxCapacity {number} The max capacity for this stack.
     * @throws {ErrorCapacity}
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
     * Returns the number of values in this stack.
     * @return {number}
     * @type {number}
     */
    get size() {
        return this._list.size;
    }

    /**
     * Returns a boolean indicating whether an element with the specified value exists in this stack.
     * @param value {*} The value to test for presence in the this stack.
     * @return {boolean} True if an element with the specified value exists in this stack, false otherwise.
     */
    includes(value) {
        return this._list.includes(value);
    }

    /**
     * @return {boolean} True if this stack is empty, false otherwise.
     */
    isEmpty() {
        return this.size <= 0;
    }

    /**
     * @return {*} The value of the head of this stack.
     */
    peek() {
        return this._list.tail.value;
    }

    /**
     * Removes the last element from the stack.
     * @return {*} The removed element from the stack, undefined if the stack is empty.
     */
    pop() {
        return this._list.pop();
    }

    /**
     * Adds one or more elements to the end of the stack.
     * If reached max capacity, for each new items removes the last element from the stack.
     * @param items {*} The elements to add to the back of the stack.
     * @return {number} The new size property of this stack.
     */
    push(...items) {
        for (let i = 0; i < items.length; i++) {
            if (this.size >= this.capacity) {
                this.pop();
            }
            this._list.push(items[i]);
        }
        return this.size;
    }

    /**
     * @return {string} String representation of this stack.
     * @override
     */
    toString() {
        return this._list.toString();
    }

    /**
     * Specifies the default iterator for stack.
     * @return {Generator} A new Iterator object that contains the values for each index in the stack.
     */
    [Symbol.iterator]() {
        return this._list[Symbol.iterator]();
    }
}

export default Stack;