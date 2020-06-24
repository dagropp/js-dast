import Queue from "./Queue";
import TypeSafeLinkedList from "../linked-list/TypeSafeLinkedList";

/**
 * A type safe extension of Queue. Implementation of a linear type safe collection which follows a particular order in
 * which the operations are performed.
 * The order is First In First Out (FIFO).
 * @extends {Queue}
 */
class TypeSafeQueue extends Queue {
    /**
     * Sets this queue's list, type and items.
     * @param type {string} Type to use for this queue.
     * @param items {T} Items to add to this queue upon initialization.
     * @template T
     */
    constructor(type, ...items) {
        super();
        /**
         * This queue's type safe list.
         * @type {TypeSafeLinkedList}
         * @protected
         */
        this._list = new TypeSafeLinkedList(type, ...items);
    }

    /**
     * Returns this queue's type.
     * @return {string}
     * @type {string}
     */
    get type() {
        return this._list.type;
    }
}

export default TypeSafeQueue;