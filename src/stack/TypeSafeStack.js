import Stack from "./Stack";
import TypeSafeLinkedList from "../linked-list/TypeSafeLinkedList";

/**
 * A type safe extension of Stack. Implementation of a linear type safe collection which follows a particular order in
 * which the operations are performed.
 * The order is LIFO (Last In First Out).
 */
class TypeSafeStack extends Stack {
    /**
     * Sets this stack's list, type and items.
     * @param type {string} Type to use for this stack.
     * @param items {T} Items to add to this stack upon initialization
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
     * Returns this stack type.
     * @return {string}
     * @type {string}
     */
    get type() {
        return this._list.type;
    }
}

export default TypeSafeStack;