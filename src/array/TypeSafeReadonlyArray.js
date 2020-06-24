import {getArrayType, isInitialized, isType} from "../common/utils";
import ErrorTypeSafe from "../error/ErrorTypeSafe";

/**
 * A type safe read only array wrapper. Includes all non-mutating Array.prototype methods, with type safe validation.
 * @extends {Object}
 */
class TypeSafeReadonlyArray {
    /**
     * Sets array type and items.
     * @param type {string} Type to use for this array.
     * @param items {T} Items to set to array.
     * @throws {ErrorTypeSafe} If some items are not of type <T>.
     * @template T
     */
    constructor(type, ...items) {
        if (isInitialized(items) && getArrayType(items) !== type) {
            throw new ErrorTypeSafe("initialize", items, type);
        }
        /**
         * This array type.
         * @type {string}
         */
        this.type = type;
        /**
         * This array representation.
         * @type T[]
         * @protected
         */
        this._array = [...items];
    }

    /** A shallow copy of the array.
     * @return {T[]}
     */
    get items() {
        return [...this._array];
    }

    /**
     * Shadows Array.length property. The number of elements in the TypeSafeReadonlyArray.
     * @return {number}
     */
    get length() {
        return this._array.length;
    }

    /**
     * Calls Array.prototype.entries method.
     * @return {Generator<Array>} A new Array Iterator object that contains the key/value pairs for
     * each index in the TypeSafeReadonlyArray.
     */
    entries() {
        return this._array.entries();
    }

    /**
     * Calls Array.prototype.every method.
     * Tests whether all elements in the TypeSafeReadonlyArray pass the test implemented by the provided function.
     * @param callback {Function} A function to test for each element.
     * @param thisArg {*} A value to use as this when executing callback.
     * @return {boolean} True if the callback function returns a truthy value for every TypeSafeReadonlyArray element,
     * false otherwise.
     */
    every(callback, thisArg = undefined) {
        return this._array.every(callback, thisArg);
    }

    /**
     * Calls Array.prototype.fill method, with type safe validation. Changes all elements in a TypeSafeReadonlyArray
     * to a static value of type <T>, from a start index (default 0) to an end index (default array.length).
     * @param value {T} Value to fill the array with.
     * @param start {number} Start index, default 0.
     * @param end {number} End index, default array.length.
     * @return {this} The modified TypeSafeReadonlyArray, filled with value.
     * @throws {ErrorTypeSafe} if value is not of type <T>.
     */
    fill(value, start = undefined, end = undefined) {
        if (isType(value, this.type)) {
            this._array.fill(value, start, end);
            return this;
        } else {
            throw new ErrorTypeSafe("assign", value, this.type);
        }
    }

    /**
     * Calls Array.prototype.filter method. Creates a new TypeSafeReadonlyArray with all elements that pass the test
     * implemented by the provided function.
     * @param callback {Function} Tests each element of the array. Return true to keep the element, false otherwise.
     * @param thisArg {*} Value to use as this when executing callback.
     * @return {this} A new TypeSafeReadonlyArray with the elements that pass the test.
     * If no elements pass the test, an empty array will be returned.
     */
    filter(callback, thisArg = undefined) {
        const filter = this._array.filter(callback, thisArg);
        return new this.constructor(this.type, ...filter);
    }

    /**
     * Calls Array.prototype.find method. Returns the value of the first element in the TypeSafeReadonlyArray that
     * satisfies the provided testing function.
     * @param callback {Function} Function to execute on each value in the TypeSafeReadonlyArray.
     * @param thisArg {*} Object to use as this inside callback.
     * @return {T|undefined} The value of the first element in the TypeSafeReadonlyArray that satisfies the provided
     * testing function, undefined otherwise.
     */
    find(callback, thisArg = undefined) {
        return this._array.find(callback, thisArg);
    }

    /**
     * Calls Array.prototype.findIndex method. Returns the index of the first element in the TypeSafeReadonlyArray that
     * satisfies the provided testing function
     * @param callback {Function} A function to execute on each value in the TypeSafeReadonlyArray until the function returns
     * true, indicating that the satisfying element was found.
     * @param thisArg {*} Object to use as this inside callback.
     * @return {number} The index of the first element in the TypeSafeReadonlyArray that passes the test, -1 otherwise.
     */
    findIndex(callback, thisArg = undefined) {
        return this._array.findIndex(callback, thisArg);
    }

    /**
     * Calls Array.prototype.flat method, with type safe validation. Creates a new TypeSafeReadonlyArray with all
     * sub-array elements concatenated into it recursively up to the specified depth.
     * @param depth {number} The depth level specifying how deep a nested array structure should be flattened.
     * Defaults to 1.
     * @return {this|Array} A new array with the sub-array elements concatenated into it.
     * Returns TypeSafeReadonlyArray if result is of the same type, otherwise a standard array.
     */
    flat(depth = undefined) {
        return this._mapMethods(this._array.flat, depth);
    }

    /**
     * Calls Array.prototype.flatMap method, with type safe validation. First maps each element using a mapping function,
     * then flattens the result into a new TypeSafeReadonlyArray.
     * @param callback {Function} Function that produces an element of the new array.
     * @param thisArg {*} Value to use as this when executing callback.
     * @return {this|Array} A new array with each element being the result of the callback function and
     * flattened to a depth of 1. Returns TypeSafeReadonlyArray if result is of the same type, otherwise a standard array.
     */
    flatMap(callback, thisArg = undefined) {
        return this._mapMethods(this._array.flatMap, callback, thisArg);
    }

    /**
     * Calls Array.prototype.forEach method. Executes a provided function once for each TypeSafeReadonlyArray element.
     * @param callback {Function} Function to execute on each element.
     * @param thisArg {*} Object to use as this inside callback.
     */
    forEach(callback, thisArg = undefined) {
        return this._array.forEach(callback, thisArg);
    }

    /**
     * Mimics array[index] get operation. Gets a value by its index in the TypeSafeReadonlyArray.
     * @param index {number} Index to get value from.
     * @return {T|undefined} The value if found, undefined otherwise.
     */
    get(index) {
        return this._array[index];
    }

    /**
     * Calls Array.prototype.includes method. Determines whether a TypeSafeReadonlyArray includes a certain value among
     * its entries.
     * @param valueToFind {T} The value to search for.
     * @param fromIndex {number} The position in this array at which to begin searching for valueToFind.
     * @return {boolean} True if the value is found within the TypeSafeReadonlyArray, false otherwise.
     */
    includes(valueToFind, fromIndex = undefined) {
        return this._array.includes(valueToFind, fromIndex)
    }

    /**
     * Calls Array.prototype.indexOf method.
     * @param searchElement {T} Element to locate in the TypeSafeReadonlyArray.
     * @param fromIndex {number} The index to start the search at.
     * @return {number} The first index at which a given element can be found in the TypeSafeReadonlyArray, -1 if not found.
     */
    indexOf(searchElement, fromIndex = undefined) {
        return this._array.indexOf(searchElement, fromIndex);
    }

    /**
     * Checks if given items are of type <T>.
     * @param items {*} Items to test.
     * @return {boolean} True if of type <T>, false otherwise.
     * @protected
     */
    itemsAreOfThisArrayType(...items) {
        return getArrayType(items) === this.type;
    }

    /**
     * Calls Array.prototype.join method. Creates and returns a new string by concatenating all of the elements in a
     * TypeSafeReadonlyArray, separated by commas or a specified separator string.
     * @param separator {string} Specifies a string to separate each pair of adjacent elements of the
     * TypeSafeReadonlyArray.
     * @return {string} A string with all array TypeSafeReadonlyArray joined.
     */
    join(separator = undefined) {
        return this._array.join(separator);
    }

    /**
     * Calls Array.prototype.keys method.
     * @return {Generator<number>} A new Array Iterator object that contains the keys for each
     * index in the TypeSafeReadonlyArray.
     */
    keys() {
        return this._array.keys();
    }

    /**
     * Calls Array.prototype.lastIndexOf method.
     * @param searchElement {T} Element to locate in the TypeSafeReadonlyArray.
     * @param fromIndex {number} The index at which to start searching backwards.
     * @return {number} The last index of the element in the TypeSafeReadonlyArray, -1 if not found.
     */
    lastIndexOf(searchElement, fromIndex = undefined) {
        return this._array.lastIndexOf(searchElement, fromIndex);
    }

    /**
     * Calls Array.prototype.map method, with type safe validation. Creates a new array populated with the results of
     * calling a provided function on every element in the calling array.
     * @param callback {Function} Function that produces an element of the new array.
     * @param thisArg {*} Value to use as this when executing callback.
     * @return {this|Array} A new array with each element being the result of the callback function.
     * Returns TypeSafeReadonlyArray if result is of the same type, otherwise a standard array.
     */
    map(callback, thisArg = undefined) {
        return this._mapMethods(this._array.map, callback, thisArg);
    }

    /**
     * Calls Array.prototype.pop method. Removes the last element from a TypeSafeReadonlyArray and returns that element.
     * @return {T|undefined} The removed element from the TypeSafeReadonlyArray, undefined if the TypeSafeReadonlyArray
     * is empty.
     */
    pop() {
        return this._array.pop();
    }

    /**
     * Calls Array.prototype.reduce method. Executes a reducer function (that you provide) on each element of the
     * TypeSafeReadonlyArray, resulting in single output value.
     * @param callback {Function} A function to execute on each element in the TypeSafeReadonlyArray
     * (except for the first, if no initialValue is supplied).
     * @param initialValue {*} A value to use as the first argument to the first call of the callback.
     * If no initialValue is supplied, the first element in the TypeSafeReadonlyArray will be used as the initial
     * accumulator value and skipped as currentValue.
     * @return {T} The single value that results from the reduction.
     */
    reduce(callback, initialValue = undefined) {
        return this._array.reduce(callback, initialValue);
    }

    /**
     * Calls Array.prototype.reduceRight method. Executes a reducer function (that you provide) on each element of the
     * TypeSafeReadonlyArray (right-to-left), resulting in single output value.
     * @param callback {Function} A function to execute on each element in the TypeSafeReadonlyArray
     * @param initialValue {*} A value to use as the first argument to the first call of the callback.
     * If no initialValue is supplied, the first element in the TypeSafeReadonlyArray will be used as the initial
     * accumulator value and skipped as currentValue.
     * @return {T} The single value that results from the reduction.
     */
    reduceRight(callback, initialValue = undefined) {
        return this._array.reduceRight(callback, initialValue);
    }

    /**
     * Calls Array.prototype.shift method. Removes the first element from a TypeSafeReadonlyArray and returns that
     * removed element.
     * @return {T} The removed element from the TypeSafeReadonlyArray, undefined if the TypeSafeReadonlyArray is empty.
     */
    shift() {
        return this._array.shift();
    }

    /**
     * Calls Array.prototype.slice method, with type safe validation. Returns a shallow copy of a portion of a
     * TypeSafeReadonlyArray into a new TypeSafeReadonlyArray.
     * @param start {number} Zero-based index at which to start extraction.
     * @param end {number} Zero-based index before which to end extraction.
     * @return {this} A new TypeSafeReadonlyArray containing the extracted elements.
     */
    slice(start, end = undefined) {
        const slice = this._array.slice(start, end);
        return new this.constructor(this.type, ...slice);
    }

    /**
     * Calls Array.prototype.some method. Tests whether at least one element in the TypeSafeReadonlyArray passes the
     * test implemented by the provided function.
     * @param callback {Function} A function to test for each element.
     * @param thisArg {*} A value to use as this when executing callback.
     * @return {boolean} True if the callback function returns a truthy value for at least one element in the
     * TypeSafeReadonlyArray, false otherwise.
     */
    some(callback, thisArg = undefined) {
        return this._array.some(callback, thisArg);
    }

    /**
     * Calls Array.prototype.splice method, with type safe validation. Changes the contents of a TypeSafeReadonlyArray
     * by removing or replacing existing elements and/or adding new elements of type <T> in place.
     * @param start {number} The index at which to start changing the TypeSafeReadonlyArray.
     * @param deleteCount {number} The number of elements in the TypeSafeReadonlyArray to remove from start.
     * @param items {T} The elements to add to the TypeSafeReadonlyArray, beginning from start.
     * @return {T[]} An array containing the deleted elements.
     * @throws {ErrorTypeSafe} If some items are not of type <T>.
     */
    splice(start, deleteCount = undefined, ...items) {
        if (!isInitialized(items) || this.itemsAreOfThisArrayType(...items)) {
            return this._array.splice(start, deleteCount, ...items);
        } else {
            throw new ErrorTypeSafe("add", items, this.type);
        }
    }

    /**
     * Calls Array.prototype.toString method.
     * @return {string} String representation of this TypeSafeReadonlyArray.
     * @override
     */
    toString() {
        return this._array.toString();
    }

    /**
     * Calls Array.prototype.values method.
     * @return {Generator<T>} A new Array Iterator object that contains the values for each
     * index in the TypeSafeReadonlyArray.
     */
    values() {
        return this._array.values();
    }

    /**
     * Specifies the default iterator for TypeSafeReadonlyArray.
     * @return {Generator} A new Iterator object that contains the values for each index in the TypeSafeReadonlyArray.
     */
    [Symbol.iterator]() {
        return this._array[Symbol.iterator]();
    }

    /**
     * Helper method for map methods. Attempts to perform map operation.
     * @param method {Function} Parent's map method.
     * @param callback {*} Function that produces an element of the new array.
     * @param thisArg {*} Value to use as this when executing callback.
     * @return {this|Array} The map result as a TypeSafeReadonlyArray if result is of the same type,
     * otherwise returns a standard array.
     * @protected
     */
    _mapMethods(method, callback, thisArg = undefined) {
        const attempt = method.call(this._array, callback, thisArg);
        const type = getArrayType(attempt);
        if (isInitialized(type)) {
            return new this.constructor(type, ...attempt);
        } else {
            return [...attempt];
        }
    }
}

export default TypeSafeReadonlyArray;