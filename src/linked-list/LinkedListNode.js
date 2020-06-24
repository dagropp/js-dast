/**
 * Represents a node in a linked list.
 */
class LinkedListNode {
    /**
     * Creates a new node and sets its value. Pointers are set to null.
     * @param value {*} This node value.
     */
    constructor(value) {
        /**
         * This node value.
         * @type {*}
         */
        this.value = value;
        /** @private */
        this._prev = null;
        /** @private */
        this._next = null;
    }

    /**
     * Sets the next node.
     * @param node {LinkedListNode|null} The next node.
     */
    set next(node) {
        this._next = node;
    }

    /** Returns the next node if set, null otherwise.
     * @return {LinkedListNode|null}
     * @type {LinkedListNode|null}
     */
    get next() {
        return this._next;
    }

    /**
     * Sets the previous node.
     * @param node {LinkedListNode|null} The previous node.
     * @type {LinkedListNode|null}
     */
    set prev(node) {
        this._prev = node;
    }

    /**
     * Returns the previous node if set, null otherwise.
     * @return {LinkedListNode|null}
     */
    get prev() {
        return this._prev;
    }
}

export default LinkedListNode;