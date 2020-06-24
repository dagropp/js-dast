import {getArrayType, getType, isInitialized, setDefaultCompare} from "../common/utils";
import TypeSafeReadonlyArray from "./TypeSafeReadonlyArray";
import ErrorTypeSafe from "../error/ErrorTypeSafe";

/**
 * A type safe sorted array wrapper.
 * Provides improved search efficiency, at O(log n), implemented with binary search.
 * @extends {TypeSafeReadonlyArray}
 */
class TypeSafeSortedArray extends TypeSafeReadonlyArray {
    /**
     * Sets array type, compare function and items.
     * @param type {string} Type to use for this array.
     * @param compareFunc {Function} Specifies a function that defines the sort order.
     * @param items {T} Items to set to array.
     * @template T
     */
    constructor(type, compareFunc = undefined, ...items) {
        compareFunc = compareFunc || setDefaultCompare(type);
        super(type);
        /**
         * This array compare function.
         * @type {Function}
         */
        this.compare = compareFunc;
        this.add(...items);
    }

    /**
     * Adds one or more elements of type <T> at the sorted position in TypeSafeSortedArray.
     * @param items {T} The element(s) to add to the TypeSafeSortedArray.
     * @return {number} The new length property of this TypeSafeArray.
     */
    add(...items) {
        for (const item of items) {
            const index = this._findInsertionIndex(item);
            super.splice(index, 0, item);
        }
        return this.length;
    }

    /**
     * Creates a new TypeSafeSortedArray with all elements that pass the test implemented by the provided function.
     * @param callback {Function} Tests each element of the array. Return true to keep the element, false otherwise.
     * @param thisArg {*} Value to use as this when executing callback.
     * @return {TypeSafeSortedArray<T>} A new TypeSafeSortedArray with the elements that pass the test.
     * If no elements pass the test, an empty array will be returned.
     * @override
     */
    filter(callback, thisArg = undefined) {
        const filter = this._array.filter(callback, thisArg);
        return new TypeSafeSortedArray(this.type, this.compare, ...filter);
    }

    /**
     * Determines whether a TypeSafeSortedArray includes a certain value among its entries.
     * Implemented with binary search.
     * @param valueToFind {T} The value to search for.
     * @param fromIndex {number} The position in this array at which to begin searching for valueToFind.
     * @return {boolean} True if the value is found within the TypeSafeSortedArray, false otherwise.
     * @override
     */
    includes(valueToFind, fromIndex = undefined) {
        const array = fromIndex ? this._array.slice(fromIndex) : this._array;
        return this._binarySearch(valueToFind, array) !== -1;
    }

    /**
     * Implemented with binary search.
     * @param searchElement {T} Element to locate in the TypeSafeSortedArray.
     * @param fromIndex {number} The index to start the search at.
     * @return {number} The first index at which a given element can be found in the TypeSafeSortedArray,
     * -1 if not found.
     * @override
     */
    indexOf(searchElement, fromIndex = undefined) {
        return this._fineTuneBinarySearch(findFirstIndex, searchElement, fromIndex);

        function findFirstIndex(array, current) {
            if (array[current - 1] !== searchElement) {
                return current;
            } else {
                return findFirstIndex(array, current - 1);
            }
        }
    }

    /**
     * Implemented with binary search.
     * @param searchElement {T} Element to locate in the TypeSafeSortedArray.
     * @param fromIndex {number} The index at which to start searching backwards.
     * @return {number} The last index of the element in the TypeSafeSortedArray, -1 if not found.
     * @override
     */
    lastIndexOf(searchElement, fromIndex = undefined) {
        return this._fineTuneBinarySearch(findLastIndex, searchElement, fromIndex);

        function findLastIndex(array, current) {
            if (array[current + 1] !== searchElement) {
                return current;
            } else {
                return findLastIndex(array, current + 1);
            }
        }
    }

    /**
     * Resets the compare function and sorts the existing array accordingly in place.
     * @param compare {Function} Specifies a new function that defines the sort order.
     * @return {TypeSafeSortedArray<T>} The resorted TypeSafeSortedArray.
     */
    setCompareFunction(compare) {
        this.compare = compare;
        this._array.sort(compare);
        return this;
    }

    /**
     * Returns a shallow copy of a portion of a TypeSafeSortedArray into a new TypeSafeSortedArray.
     * @param start {number} Zero-based index at which to start extraction.
     * @param end {number} Zero-based index before which to end extraction.
     * @return {TypeSafeSortedArray<T>} A new TypeSafeSortedArray containing the extracted elements.
     * @override
     */
    slice(start, end = undefined) {
        const slice = this._array.slice(start, end);
        return new TypeSafeSortedArray(this.type, this.compare, ...slice);
    }

    /**
     * Changes the contents of a TypeSafeSortedArray by removing elements. Replacing existing elements
     * and/or adding new elements is disabled in TypeSafeSortedArray.
     * @param start {number} The index at which to start changing the TypeSafeSortedArray.
     * @param deleteCount {number} The number of elements in the TypeSafeSortedArray to remove from start.
     * @param items {T} Disabled in TypeSafeSortedArray.
     * @return {T[]} An array containing the deleted elements.
     * @override
     */
    splice(start, deleteCount = undefined, ...items) {
        return super.splice(start, deleteCount);
    }

    /**
     * Implements a binary search algorithm that locates an item in the TypeSafeSortedArray, and returns its index.
     * @param item {T} Element to locate in the TypeSafeSortedArray.
     * @param array {T[]} This array.
     * @param left {number} The current left part of the array, default is 0.
     * @param right {number} The current right part of the array, default is array.length.
     * @return {number} The index of the element in the TypeSafeSortedArray, -1 if not found.
     * @private
     */
    _binarySearch(item, array, left = 0, right = array.length - 1) {
        if (right >= left) {
            const middle = Math.floor(left + (right - left) / 2);
            if (array[middle] === item) {
                return middle;
            } else if (this.compare(array[middle], item) > 0) {
                return this._binarySearch(item, array, left, middle - 1);
            } else {
                return this._binarySearch(item, array, middle + 1, right);
            }
        }
        return -1;
    }

    /**
     * Finds the sorted insertion index, implemented with binary search.
     * @param item {T} The element to find insertion index for.
     * @param left {number} The current left part of the array, default is 0.
     * @param right {number} The current right part of the array, default is array.length.
     * @return {number} The index of the closest smaller (or equal) element to this item.
     * @private
     */
    _findInsertionIndex(item, left = 0, right = this.length) {
        if (left >= right) {
            return left;
        } else {
            const middle = Math.floor((left + right) / 2);
            if (this.compare(this._array[middle], item) > 0) {
                return this._findInsertionIndex(item, left, middle);
            } else {
                return this._findInsertionIndex(item, middle + 1, right);
            }
        }
    }

    /**
     * Finds either first or last index of a value in TypeSafeSortedArray, given as a result of a binary search.
     * @param callback {Function} After the index was found, traverses back/forth to find first/last index.
     * @param searchElement {T} Element to locate in the TypeSafeSortedArray.
     * @param fromIndex {number} The index to start the search at.
     * @return {number} The specified index at which a given element can be found in the TypeSafeSortedArray,
     * -1 if not found.
     * @private
     */
    _fineTuneBinarySearch(callback, searchElement, fromIndex = undefined) {
        const array = fromIndex ? this._array.slice(fromIndex) : this._array;
        const result = this._binarySearch(searchElement, array);
        return result !== -1 ? callback(array, result) : -1;
    }

    /**
     * Helper method for map methods. Attempts to perform map operation.
     * @param method {Function} Parent's map method.
     * @param callback {*} Function that produces an element of the new array.
     * @param thisArg {*} Value to use as this when executing callback.
     * @return {TypeSafeReadonlyArray|Array} The map result as a TypeSafeReadonlyArray if result is of the same type,
     * otherwise returns a standard array.
     * @override
     * @protected
     */
    _mapMethods(method, callback, thisArg = undefined) {
        const attempt = method.call(this._array, callback, thisArg);
        const type = getArrayType(attempt);
        if (isInitialized(type)) {
            return new TypeSafeSortedArray(type, setDefaultCompare(type), ...attempt);
        } else {
            return [...attempt];
        }
    }

    /**
     * Mimics Array.from static method. Creates a new, shallow-copied TypeSafeSortedArray instance from an array-like or
     * iterable object of the same type.
     * @param arrayLike {*} An array-like or iterable object to convert to a TypeSafeSortedArray.
     * @param compareFunction {Function} Specifies a function that defines the sort order.
     * @param mapFn {Function} Map function to call on every element of the TypeSafeSortedArray.
     * @param thisArg {*} Value to use as this when executing mapFn.
     * @return {TypeSafeSortedArray} A new TypeSafeSortedArray instance.
     * @throws {ErrorTypeSafe} If some items are not of the same type.
     */
    static from(arrayLike, compareFunction = undefined, mapFn = undefined, thisArg = undefined) {
        const array = Array.from(arrayLike, mapFn, thisArg);
        const type = getArrayType(array);
        if (isInitialized(type)) {
            compareFunction = compareFunction || setDefaultCompare(type);
            return new TypeSafeSortedArray(type, compareFunction, ...array);
        } else {
            throw new ErrorTypeSafe("initialize", array, getType(array[0]));
        }
    }

    /**
     * Mimics Array.of static method. creates a new TypeSafeSortedArray instance from a variable number of arguments of
     * the same type.
     * @param compareFunction {Function} Specifies a function that defines the sort order.
     * @param items {*} Elements used to create the array.
     * @return {TypeSafeSortedArray} A new TypeSafeSortedArray instance.
     * @throws {ErrorTypeSafe} If some items are not of the same type.
     */
    static of(compareFunction, ...items) {
        const array = Array.of(...items);
        const type = getArrayType(array);
        if (isInitialized(type)) {
            compareFunction = compareFunction || setDefaultCompare(type);
            return new TypeSafeSortedArray(type, compareFunction, ...array);
        } else {
            throw new ErrorTypeSafe("initialize", items, getType(array[0]));
        }
    }
}

export default TypeSafeSortedArray;