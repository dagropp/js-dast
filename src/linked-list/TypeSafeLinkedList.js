import {getArrayType, getType, isInitialized, isType} from "../common/utils";
import LinkedList from "./LinkedList";
import ErrorTypeSafe from "../error/ErrorTypeSafe";

/**
 * A type safe extension of LinkedList. Implementation of a type safe doubly linked list. A linear collection, in which
 * the elements are not stored at contiguous memory locations. The elements in a linked list are linked using pointers.
 * Provides improved insertion efficiency, at O(1).
 * @extends {LinkedList}
 */
class TypeSafeLinkedList extends LinkedList {
    /**
     * Initializes TypeSafeLinkedList, sets type and items.
     * @param type {string} Type to use for this linked list.
     * @param items {T} Items to set to linked list.
     * @throws {ErrorTypeSafe} If some items are not of type <T>.
     * @template T
     */
    constructor(type, ...items) {
        if (isInitialized(items) && getArrayType(items) !== type) {
            throw new ErrorTypeSafe("initialize", items, type);
        }
        super()
        /**
         * This list type.
         * @type {string}
         */
        this.type = type;
        this.push(...items);
    }

    /**
     * Creates a new TypeSafeLinkedList populated with the results of calling a provided function on every element in
     * the calling TypeSafeLinkedList.
     * @param callback {Function} Function that is called for every element of the TypeSafeLinkedList.
     * Each time callback executes, the returned value is added to the new TypeSafeLinkedList.
     * @return {TypeSafeLinkedList|LinkedList} A new linked list with each element being the result of the
     * callback function. Returns TypeSafeLinkedList if result is of the same type, otherwise a standard LinkedList.
     * @override
     */
    map(callback) {
        const attempt = [];
        for (const [index, node] of this.entries()) {
            attempt.push(callback(node.value, index, this));
        }
        const type = getArrayType(attempt);
        if (isInitialized(type)) {
            return new TypeSafeLinkedList(type, ...attempt)
        } else {
            return new LinkedList(...attempt);
        }
    }

    /**
     * Adds one or more elements to the end of a TypeSafeLinkedList.
     * @param items {T} The element(s) to add to the end of the TypeSafeLinkedList.
     * @return {number} The new size property of this TypeSafeLinkedList.
     * @throws {ErrorTypeSafe} If some items are not of type <T>.
     * @override
     */
    push(...items) {
        if (getArrayType(items) === this.type) {
            return super.push(...items);
        } else {
            throw new ErrorTypeSafe("add", items, this.type);
        }
    }

    /**
     * Sets a value to an index in the TypeSafeLinkedList.
     * @param index {number} Index to set value for.
     * @param value {T} Value to assign to node.
     * @return {T|undefined} The assigned value if set, undefined otherwise.
     * @throws {ErrorTypeSafe} If the value of the property to set is not of type <T>.
     * @override
     */
    set(index, value) {
        if (isType(value, this.type)) {
            return super.set(index, value);
        } else {
            throw new ErrorTypeSafe("assign", value, this.type);
        }
    }

    /**
     * Sets a value to a node in the TypeSafeLinkedList.
     * @param node {LinkedListNode} Node to assign value for.
     * @param value {T} Value to assign to node.
     * @return {T|undefined} The assigned value if set, undefined otherwise.
     * @throws {ErrorTypeSafe} If the value of the property to set is not of type <T>.
     * @override
     */
    setByNode(node, value) {
        if (isType(value, this.type)) {
            return super.setByNode(node, value);
        } else {
            throw new ErrorTypeSafe("assign", value, this.type);
        }
    }

    /**
     * Adds one or more elements to the beginning of a TypeSafeLinkedList.
     * @param items {T} The elements to add to the front of the TypeSafeLinkedList.
     * @return {number} The new size property of this TypeSafeLinkedList.
     * @throws {ErrorTypeSafe} If some items are not of type <T>.
     * @override
     */
    unshift(...items) {
        if (getArrayType(items) === this.type) {
            return super.unshift(...items);
        } else {
            throw new ErrorTypeSafe("add", items, this.type);
        }
    }

    /**
     * Creates a new, shallow-copied TypeSafeLinkedList instance from an array-like or iterable object.
     * @param arrayLike {*} An array-like or iterable object to convert to TypeSafeLinkedList.
     * @return {TypeSafeLinkedList} A new TypeSafeLinkedList instance.
     * @throws {ErrorTypeSafe} If some items are not of the same type.
     * @override
     */
    static from(arrayLike) {
        const type = getArrayType(arrayLike);
        if (isInitialized(type)) {
            return new TypeSafeLinkedList(type, ...arrayLike);
        } else {
            throw new ErrorTypeSafe("initialize", arrayLike, getType(arrayLike[0]));
        }
    }

    /**
     * Creates a new TypeSafeLinkedList instance from a variable number of arguments.
     * @param items {*} Elements used to create the TypeSafeLinkedList.
     * @return {TypeSafeLinkedList} A new TypeSafeLinkedList instance.
     * @throws {ErrorTypeSafe} If some items are not of the same type.
     * @override
     */
    static of(...items) {
        const type = getArrayType(items);
        if (isInitialized(type)) {
            return new TypeSafeLinkedList(type, ...items);
        } else {
            throw new ErrorTypeSafe("initialize", items, getType(items[0]));
        }
    }
}

export default TypeSafeLinkedList;