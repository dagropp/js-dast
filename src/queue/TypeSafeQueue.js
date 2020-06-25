import Queue from "./Queue";
import TypeSafeLinkedList from "../linked-list/TypeSafeLinkedList";
import {getArrayType, getType, isInitialized} from "../common/utils";
import ErrorTypeSafe from "../error/ErrorTypeSafe";

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

    /**
     * Creates a new, shallow-copied TypeSafeQueue instance from an array-like or iterable object.
     * @param arrayLike {*} An array-like or iterable object to convert to TypeSafeQueue.
     * @return {TypeSafeQueue} A new TypeSafeQueue instance.
     * @throws {ErrorTypeSafe} If some items are not of the same type.
     * @override
     */
    static from(arrayLike) {
        const type = getArrayType(arrayLike);
        if (isInitialized(type)) {
            return new TypeSafeQueue(type, ...arrayLike);
        } else {
            throw new ErrorTypeSafe("initialize", arrayLike, getType(arrayLike[0]));
        }
    }

    /**
     * Creates a new TypeSafeQueue instance from a variable number of arguments.
     * @param items {*} Elements used to create the TypeSafeQueue.
     * @return {TypeSafeQueue} A new TypeSafeQueue instance.
     * @throws {ErrorTypeSafe} If some items are not of the same type.
     * @override
     */
    static of(...items) {
        const type = getArrayType(items);
        if (isInitialized(type)) {
            return new TypeSafeQueue(type, ...items);
        } else {
            throw new ErrorTypeSafe("initialize", items, getType(items[0]));
        }
    }
}

export default TypeSafeQueue;