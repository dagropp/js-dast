/**
 * Custom error for capacity related errors.
 * @extends {Error}
 */
class ErrorCapacity extends Error {
    /**
     * Calls parent Error and sets the modified message.
     * @param error {string} ErrorCapacity type [add, assign, initialize].
     * @param size {number} This collection current size.
     * @param maxSize {number} This collection max size.
     */
    constructor(error, size, maxSize) {
        super()
        this.base = ["CapacityError"];
        this.message = this._setMessage(error, size, maxSize);
    }

    /**
     * Sets the custom ErrorTypeSafe message.
     * @param error {string} ErrorCapacity type [add, assign, initialize].
     * @param size {number} This collection current size.
     * @param maxSize {number} This collection max size.
     * @return {string} This error message.
     * @private
     */
    _setMessage(error, size, maxSize) {
        const ERROR_TYPES = {
            set: this._set,
        }
        return this.base.concat(ERROR_TYPES[error](size, maxSize)).join("\n");
    }

    /**
     * @param size {number} This collection current size.
     * @param maxSize {number} This collection max size.
     * @return {string[]} Custom ErrorCapacity message regarding setting max size.
     * @private
     */
    _set(size, maxSize) {
        return [
            `-- Unable to set max capacity to collection --`,
            `The set capacity is smaller than the current size.`,
            `This collection current size is: ${size}.`,
            `Attempted to set max capacity: ${maxSize}.`
        ];
    }
}

export default ErrorCapacity;