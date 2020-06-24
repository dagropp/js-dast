import LinkedListNode from "./LinkedListNode";
import {COMPARE, isInitialized} from "../common/utils";

/**
 * Implementation of a doubly linked list. A linear collection, in which the elements are not stored
 * at contiguous memory locations. The elements in a linked list are linked using pointers.
 * Provides improved insertion efficiency, at O(1).
 * @extends {Object}
 */
class LinkedList {
    /**
     * Initializes linked list, and sets items.
     * @param items {*} Items to set to linked list.
     */
    constructor(...items) {
        /**
         * This list head.
         * @type {LinkedListNode|null}
         */
        this.head = null;
        /**
         * This list tail.
         * @type {LinkedListNode|null}
         */
        this.tail = null;
        /**
         * This list size.
         * @type {number}
         */
        this.size = 0;
        isInitialized(items) && this.push(...items);
    }

    /**
     * Creates a new linked list with all elements that pass the test implemented by the provided function.
     * @param callback {Function} To test each element of the linked list.
     * Return true to keep the element, false otherwise.
     * @return {LinkedList} A new linked list with the elements that pass the test. If no elements pass the test,
     * an empty linked list will be returned.
     */
    filter(callback) {
        const list = new LinkedList();
        for (const [index, node] of this.entries()) {
            const test = callback(node.value, index, this);
            test && list.push(node.value);
        }
        return list;
    }

    /**
     * Returns the value of the first element in the linked list that satisfies the provided testing function.
     * @param callback {Function} A function to execute on each value in the linked list
     * until the function returns true, indicating that the satisfying element was found.
     * @return {*|undefined} The value of the first element in the linked list that satisfies the provided testing
     * function, undefined otherwise.
     */
    find(callback) {
        const node = this.findNodeByCallback(callback);
        return node?.node.value ?? undefined;
    }

    /**
     * Returns the index of the first element in the linked list that satisfies the provided testing function.
     * @param callback {Function} A function to execute on each value in the linked list
     * until the function returns true, indicating that the satisfying element was found.
     * @return {number} The index of the first element in the linked list that passes the test, otherwise, -1.
     */
    findIndex(callback) {
        const node = this.findNodeByCallback(callback);
        return node?.index ?? -1;
    }


    /**
     * Finds the first element in the linked list that satisfies the provided testing function.
     * @param callback {Function} A function to execute on each value in the linked list
     * until the function returns true, indicating that the satisfying element was found.
     * @return {{node: LinkedListNode, index: number}|undefined} Object with the node and its index if found,
     * undefined otherwise.
     */
    findNodeByCallback(callback) {
        for (const [node, index] of this.traverse()) {
            if (callback(node.value, index)) {
                return {node, index};
            }
        }
        return undefined;
    }

    /**
     * Finds the first element in the linked list with specified value.
     * @param value {*} The value to find in the linked list.
     * @return {{node: LinkedListNode, index: number}|undefined} Object with the node and its index if found,
     * undefined otherwise.
     */
    findNodeByValue(value) {
        for (const [node, index] of this.traverse()) {
            if (node.value === value) {
                return {node, index};
            }
        }
        return undefined;
    }

    /**
     * Executes a provided function once for each linked list element.
     * @param callback {Function} Function to execute on each element.
     */
    forEach(callback) {
        for (const [value, index] of this.entries()) {
            callback(value, index);
        }
    }

    /**
     * Gets a value by its index in the linked list.
     * @param index {number} Index to get value from.
     * @return {*|undefined} The value if found, undefined otherwise.
     */
    get(index) {
        const node = this.getNodeByIndex(index);
        return node?.value ?? undefined;
    }

    /**
     * Gets a node by its index in the linked list.
     * @param index {number} Index to get node from.
     * @return {LinkedListNode|undefined} The node if found, undefined otherwise.
     */
    getNodeByIndex(index) {
        if (index >= 0 && index < this.size) {
            let node = this.head;
            let i = 0;
            while (isInitialized(node)) {
                if (i === index) {
                    return node;
                } else {
                    node = node.next;
                    i++;
                }
            }
        }
        return undefined;
    }

    /**
     * Returns a boolean indicating whether an element with the specified value exists in a linked list.
     * @param value {*} The value to test for presence in the linked list.
     * @return {boolean} True if an element with the specified value exists in the linked list, false otherwise.
     */
    includes(value) {
        return isInitialized(this.findNodeByValue(value));
    }

    /**
     * @param value {*} Element to locate in the linked list.
     * @return {number} The first index of the element in the linked list, -1 if not found.
     */
    indexOf(value) {
        const node = this.findNodeByValue(value);
        return node?.index ?? -1;
    }

    /**
     * Creates a new linked list populated with the results of calling a provided function on every element in
     * the calling linked list.
     * @param callback {Function} Function that is called for every element of the linked list.
     * Each time callback executes, the returned value is added to the new linked list.
     * @return {LinkedList} A new linked list with each element being the result of the callback function.
     */
    map(callback) {
        const list = new LinkedList();
        for (const [value, index] of this.entries()) {
            list.push(callback(value, index, this));
        }
        return list;
    }

    /**
     * Removes the last element from a linked list.
     * @return {*|undefined} The removed element from the linked list, undefined if the array is empty.
     */
    pop() {
        return this.removeByNode(this.tail);
    }

    /**
     * Adds one or more elements to the end of a linked list.
     * @param items {*} The element(s) to add to the end of the linked list.
     * @return {number} The new size property of this linked list.
     */
    push(...items) {
        for (const item of items) {
            const node = new LinkedListNode(item);
            if (!isInitialized(this.head)) {
                this.head = node;
            } else {
                this.tail.next = node;
                node.prev = this.tail;
            }
            this.tail = node;
            this.size++;
        }
        return this.size;
    }

    /**
     * Removes an element from the linked list by index.
     * @param index {number} Index to remove node of.
     * @return {*|undefined} The value that was removed if found index, undefined otherwise.
     */
    remove(index) {
        const node = this.getNodeByIndex(index);
        return this.removeByNode(node);
    }

    /**
     * Removes a node from the linked list.
     * @param node {LinkedListNode} Node to remove.
     * @return {*|undefined} The value that was removed if node is set, undefined otherwise.
     */
    removeByNode(node) {
        if (isInitialized(node)) {
            if (node === this.head) {
                this.head = node.next;
            } else {
                node.prev.next = node.next;
            }
            if (node === this.tail) {
                this.tail = node.prev;
            } else {
                node.next.prev = node.prev;
            }
            this.size--;
            return node.value;
        }
        return undefined;
    }

    /**
     * Finds the first element in the linked list that satisfies the provided testing function, and removes it.
     * @param callback {Function} A function to execute on each value in the linked list
     * until the function returns true, indicating that the satisfying element was found.
     * @return {*|undefined} The value that was removed if found, undefined otherwise.
     */
    removeByCallback(callback) {
        const node = this.findNodeByCallback(callback);
        if (isInitialized(node)) {
            return this.removeByNode(node.node);
        }
        return undefined;
    }

    /**
     * Finds the first element in the linked list with specified value, and removes it.
     * @param value {*} The value to find and remove from the linked list.
     * @return {*|undefined} The value that was removed if found, undefined otherwise.
     */
    removeByValue(value) {
        const node = this.findNodeByValue(value);
        if (isInitialized(node)) {
            return this.removeByNode(node.node);
        }
        return undefined;
    }

    /**
     * Sets a value to an index in the linked list.
     * @param index {number} Index to set value for.
     * @param value {*} Value to assign to node.
     * @return {*|undefined} The assigned value if set, undefined otherwise.
     */
    set(index, value) {
        const node = this.getNodeByIndex(index);
        return this.setByNode(node, value);
    }

    /**
     * Sets a value to a node in the linked list.
     * @param node {LinkedListNode} Node to assign value for.
     * @param value {*} Value to assign to node.
     * @return {*|undefined} The assigned value if set, undefined otherwise.
     */
    setByNode(node, value) {
        if (isInitialized(node)) {
            node.value = value;
            return value;
        } else {
            return undefined;
        }
    }

    /**
     * Removes the first element from a linked list.
     * @return {*} The removed element from the linked list, undefined if the linked list is empty.
     */
    shift() {
        return this.removeByNode(this.head);
    }

    /**
     * Sorts the elements of a linked list in place and returns the linked list. Implemented with Bubble Sort algorithm.
     * @param compareFunction {Function} Specifies a function that defines the sort order. If omitted, the linked list
     * elements are converted to strings, then sorted according to each character's Unicode code point value.
     * @return {LinkedList} The sorted linked list. Note that the linked list is sorted in place, and no copy is made.
     */
    sort(compareFunction = undefined) {
        const compare = compareFunction || COMPARE.DEFAULT;
        return bubbleSort.call(this);

        /**
         * Bubble Sort algorithm implementation.
         * @return {LinkedList} The sorted linked list.
         */
        function bubbleSort() {
            let swapped = true;
            let largest = null;
            if (isInitialized(this.head)) {
                while (swapped) {
                    swapped = false;
                    let current = this.head;
                    while (current.next !== largest) {
                        if (compare(current.value, current.next.value) > 0) {
                            let temp = current.value;
                            current.value = current.next.value;
                            current.next.value = temp;
                            swapped = true;
                        }
                        current = current.next;
                    }
                    largest = current;
                }
            }
            return this;
        }
    }


    /**
     * @return {string} String representation of this linked list.
     * @override
     */
    toString() {
        return Array.from(this).toString();
    }

    /**
     * Adds one or more elements to the beginning of a linked list.
     * @param items {*} The elements to add to the front of the linked list.
     * @return {number} The new size property of this linked list.
     */
    unshift(...items) {
        for (let i = items.length - 1; i >= 0; i--) {
            const node = new LinkedListNode(items[i]);
            if (!isInitialized(this.tail)) {
                this.tail = node;
            } else {
                this.head.prev = node;
                node.next = this.head;
            }
            this.head = node;
            this.size++;
        }
        return this.size;
    }

    /**
     * @return {Generator<Array>} A new Iterator object that contains the key/value pairs for
     * each index in the linked list.
     */
    * entries() {
        let node = this.head, index = 0;
        while (isInitialized(node)) {
            yield [node.value, index];
            node = node.next;
            index++;
        }
    }

    /**
     * @return {Generator<number>} A new Iterator object that contains the keys for each index in the linked list.
     */
    * keys() {
        let node = this.head, index = 0;
        while (isInitialized(node)) {
            yield index;
            node = node.next;
            index++;
        }
    }

    /**
     *
     * @return {Generator<*>} A new Iterator object that contains the reversed values for each index in the linked list.
     */
    * reverse() {
        let node = this.tail, index = this.size - 1;
        while (isInitialized(node)) {
            yield node.value;
            node = node.prev;
            index--;
        }
    }

    /**
     *
     * @return {Generator<Array>} A new Iterator object that contains the the key/node pairs for
     * each index in the linked list.
     */
    * traverse() {
        let node = this.head, index = 0;
        while (isInitialized(node)) {
            yield [node, index]
            node = node.next;
            index++;
        }
    }

    /**
     * @return {Generator<*>} A new Iterator object that contains the values for each index in the linked list.
     */
    * values() {
        let node = this.head;
        while (isInitialized(node)) {
            yield node.value;
            node = node.next;
        }
    }

    /**
     * Specifies the default iterator for linked list.
     * @return {Generator} A new Iterator object that contains the values for each index in the linked list.
     */
    [Symbol.iterator]() {
        return this.values();
    }

    /**
     * Creates a new, shallow-copied linked list instance from an array-like or iterable object.
     * @param arrayLike {*} An array-like or iterable object to convert to linked list.
     * @return {LinkedList} A new linked list instance.
     */
    static from(arrayLike) {
        return new LinkedList(...arrayLike);
    }

    /**
     * Creates a new linked list instance from a variable number of arguments.
     * @param items {*} Elements used to create the linked list.
     * @return {LinkedList} A new linked list instance.
     */
    static of(...items) {
        return new LinkedList(...items);
    }
}

export default LinkedList;