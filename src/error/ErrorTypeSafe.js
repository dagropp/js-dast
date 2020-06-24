import {getType} from "../common/utils";

/**
 * Custom error for type related errors.
 * @extends {Error}
 */
class ErrorTypeSafe extends Error {
    /**
     * Calls parent Error and sets the modified message.
     * @param error {string} ErrorTypeSafe type [add, assign, initialize].
     * @param items {*} Items that failed the test.
     * @param type {string} The type of the type safe collection.
     */
    constructor(error, items, type) {
        super()
        this.base = ["TypeSafeError"];
        this.message = this._setMessage(error, items, type);
    }

    /**
     * Sets the custom ErrorTypeSafe message.
     * @param error {string} ErrorTypeSafe type [add, assign, initialize].
     * @param items {*} Items that failed the test.
     * @param type {string} The type of the type safe collection.
     * @return {string} This error message.
     * @private
     */
    _setMessage(error, items, type) {
        const ERROR_TYPES = {
            add: this._add,
            assign: this._assign,
            initialize: this._initialize
        }
        return this.base.concat(ERROR_TYPES[error](items, type)).join("\n");
    }

    /**
     * @param items {*} Items that failed the test.
     * @param type {string} The type of the type safe collection.
     * @return {string[]} Custom ErrorTypeSafe message regarding adding items.
     * @private
     */
    _add(items, type) {
        return [
            `-- Unable to add items to type-safe collection --`,
            `Some items are not of type {${type}}.`,
            `Attempted to add items: ${items.join(", ")}.`
        ];
    }

    /**
     * @param items {*} Items that failed the test.
     * @param type {string} The type of the type safe collection.
     * @return {string[]} Custom ErrorTypeSafe message regarding assigning items.
     * @private
     */
    _assign(items, type) {
        return [
            `-- Unable to assign value to type-safe collection --`,
            `Value <${items}> is of type {${getType(items)}}, should be of type {${type}}.`
        ]
    }

    /**
     * @param items {*} Items that failed the test.
     * @param type {string} The type of the type safe collection.
     * @return {string[]} Custom ErrorTypeSafe message regarding initializing collection with items.
     * @private
     */
    _initialize(items, type) {
        return [
            `-- Unable to initialize type-safe collection with items --`,
            `Some items are not of type {${type}}.`,
            `Attempted to push items: ${items.join(", ")}.`
        ];
    }
}

export default ErrorTypeSafe;