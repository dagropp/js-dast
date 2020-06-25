import Stack from "./Stack";
import TypeSafeLinkedList from "../linked-list/TypeSafeLinkedList";
import {getArrayType, getType, isInitialized} from "../common/utils";
import ErrorTypeSafe from "../error/ErrorTypeSafe";

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
         * This stack's type safe list.
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

    /**
     * Creates a new, shallow-copied TypeSafeStack instance from an array-like or iterable object.
     * @param arrayLike {*} An array-like or iterable object to convert to TypeSafeStack.
     * @return {TypeSafeStack} A new TypeSafeStack instance.
     * @throws {ErrorTypeSafe} If some items are not of the same type.
     * @override
     */
    static from(arrayLike) {
        const type = getArrayType(arrayLike);
        if (isInitialized(type)) {
            return new TypeSafeStack(type, ...arrayLike);
        } else {
            throw new ErrorTypeSafe("initialize", arrayLike, getType(arrayLike[0]));
        }
    }

    /**
     * Creates a new TypeSafeStack instance from a variable number of arguments.
     * @param items {*} Elements used to create the TypeSafeStack.
     * @return {TypeSafeStack} A new TypeSafeStack instance.
     * @throws {ErrorTypeSafe} If some items are not of the same type.
     * @override
     */
    static of(...items) {
        const type = getArrayType(items);
        if (isInitialized(type)) {
            return new TypeSafeStack(type, ...items);
        } else {
            throw new ErrorTypeSafe("initialize", items, getType(items[0]));
        }
    }
}

export default TypeSafeStack;