/**
 * @fileOverview Implementation of useful data-structures in vanilla JavaScript.
 * @name js-dast
 * @version 1.0
 * @author Daniel Gropp
 * @copyright 2020
 */

/**
 * Common types dictionary constant.
 * Keys: BOOLEAN, BIGINT, NUMBER, STRING, SYMBOL, UNDEFINED, NULL, OBJECT, ARRAY.
 * @type {Object}
 */
export const TYPE = {
    BOOLEAN: "Boolean",
    BIGINT: "BigInt",
    NUMBER: "Number",
    STRING: "String",
    SYMBOL: "Symbol",
    UNDEFINED: "Undefined",
    NULL: "Null",
    OBJECT: "Object",
    ARRAY: "Array"
};

/**
 * Common compare functions dictionary constant.
 * Keys: DEFAULT, DEFAULT_DESCENDING, NUMBER, NUMBER_DESCENDING, STRING, STRING_DESCENDING.
 * @type {Object}
 */
export const COMPARE = {
    DEFAULT: (a, b) => a.toString().localeCompare(b.toString()),
    DEFAULT_DESCENDING: (a, b) => b.toString().localeCompare(a.toString()),
    NUMBER: (a, b) => a - b,
    NUMBER_DESCENDING: (a, b) => b - a,
    STRING: (a, b) => a.localeCompare(b),
    STRING_DESCENDING: (a, b) => b.localeCompare(a)
}

/**
 * @param subject {*} Subject to get type of.
 * @return {string} Subject type, converted to string.
 */
export function getType(subject) {
    return Object.prototype.toString.call(subject).slice(8, -1);
}

/**
 * @param array {Array} Array to get type of.
 * @return {string|undefined} Array type, if array is of uniform type, undefined otherwise.
 */
export function getArrayType(array) {
    const type = getType(array[0]);
    return array.every(item => isType(item, type)) ? type : undefined;
}

/**
 * Tests whether an item is of a certain type.
 * @param subject {*} Test subject.
 * @param type {string} Test type.
 * @return {boolean} True if subject item passed test, false otherwise.
 */
export function isType(subject, type) {
    return getType(subject) === type;
}

/**
 * Checks if item is initialized (i.e. not null, undefined, "", NaN, [], {}).
 * @param subject {*} Test subject.
 * @return {boolean} True if is initialized, false otherwise.
 */
export function isInitialized(subject) {
    if (subject !== null && subject !== undefined) {
        switch (getType(subject)) {
            case TYPE.NUMBER:
                return !isNaN(subject);
            case TYPE.STRING:
                return subject !== "";
            case TYPE.ARRAY:
                return subject.length > 0;
            case TYPE.OBJECT:
                return Object.keys(subject).length > 0;
            default:
                return true;
        }
    }
    return false;
}

/**
 * Sets a default compare function, based on given type.
 * @param type {string} Compare function type.
 * @return {Function} The type specific compare function, or default.
 */
export function setDefaultCompare(type) {
    const functions = {
        [TYPE.NUMBER]: COMPARE.NUMBER,
        [TYPE.STRING]: COMPARE.STRING,
    }
    return functions[type] || COMPARE.DEFAULT;
}

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

/**
 * A type safe array wrapper. Includes all Array.prototype methods, with type safe validation.
 * @extends {TypeSafeReadonlyArray}
 */
export class TypeSafeArray extends TypeSafeReadonlyArray {
    /**
     * Sets array type and items.
     * @param type {string} Type to use for this array.
     * @param items {T} Items to set to array.
     * @template T
     */
    constructor(type, ...items) {
        super(type, ...items);
    }

    /**
     * Calls Array.prototype.concat method, with type safe validation. Used to merge two or more arrays or items of
     * type <T>. This method does not change the existing arrays, but instead returns a new TypeSafeArray.
     * @param items {T|T[]|TypeSafeArray<T>} Arrays and/or values to concatenate into a new TypeSafeArray.
     * @return {TypeSafeArray<T>} A new TypeSafeArray instance.
     * @throws {ErrorTypeSafe} If some items are not of type <T>.
     */
    concat(...items) {
        // Attempts to call parent method, and checks the result's type.
        const attempt = this._array.concat(...items);
        const type = getArrayType(attempt);
        if (isInitialized(type)) {
            return new TypeSafeArray(type, ...attempt);
        } else {
            throw new ErrorTypeSafe("add", items, this.type);
        }
    }

    /**
     * Calls Array.prototype.copyWithin method, with type safe validation. Shallow copies part of a TypeSafeArray to
     * another location in the same TypeSafeArray and returns it without modifying its length.
     * @param target {number} Zero-based index at which to copy the sequence to. If negative, target will be counted
     * from the end.
     * @param start {number} Zero-based index at which to start copying elements from. If negative, start will be
     * counted from the end.
     * @param end {number} Zero-based index at which to end copying elements from. copyWithin copies up to but not
     * including end. If negative, end will be counted from the end.
     * @return {TypeSafeArray} The modified TypeSafeArray.
     */
    copyWithin(target, start = undefined, end = undefined) {
        this._array.copyWithin(target, start, end);
        return this;
    }

    /**
     * Calls Array.prototype.push method, with type safe validation. Adds one or more elements of type <T> to the
     * end of a TypeSafeArray.
     * @param items {T} The element(s) to add to the end of the TypeSafeArray.
     * @return {number} The new length property of this TypeSafeArray.
     * @throws {ErrorTypeSafe} If some items are not of type <T>.
     */
    push(...items) {
        if (this.itemsAreOfThisArrayType(...items)) {
            return this._array.push(...items);
        } else {
            throw new ErrorTypeSafe("add", items, this.type);
        }
    }

    /**
     * Calls Array.prototype.reverse method. Reverses a TypeSafeArray in place.
     * @return {TypeSafeArray<T>} The reversed TypeSafeArray.
     */
    reverse() {
        this._array.reverse();
        return this;
    }

    /**
     * Mimics array[index] = value set operation. Sets a value to an index in the TypeSafeArray.
     * @param index {number} Index to set value for.
     * @param value {T} Value to assign to node.
     * @return {T|undefined} The assigned value if set, undefined otherwise.
     * @throws {ErrorTypeSafe} If the value of the property to set is not of type <T>.
     */
    set(index, value) {
        if (isType(value, this.type)) {
            return this._array[index] = value;
        } else {
            throw new ErrorTypeSafe("assign", value, this.type);
        }
    }

    /**
     * Calls Array.prototype.sort method, with type safe validation. Sorts the elements of an TypeSafeArray in place.
     * If compareFunction is omitted, provides type specific callback.
     * @param compareFunction {Function} Specifies a function that defines the sort order.
     * @return {this} The sorted TypeSafeArray.
     */
    sort(compareFunction = undefined) {
        compareFunction = compareFunction || setDefaultCompare(this.type);
        this._array.sort(compareFunction);
        return this;
    }

    /**
     * Calls Array.prototype.unshift method, with type safe validation. Adds one or more elements to the beginning of a
     * TypeSafeArray.
     * @param items {T} The elements to add to the front of the TypeSafeArray.
     * @return {number} The new length property of this TypeSafeArray.
     * @throws {ErrorTypeSafe} If some items are not of type <T>.
     */
    unshift(...items) {
        if (this.itemsAreOfThisArrayType(...items)) {
            return this._array.unshift(...items);
        } else {
            throw new ErrorTypeSafe("add", items, this.type);
        }
    }

    /**
     * Mimics Array.from static method. Creates a new, shallow-copied TypeSafeArray instance from an array-like or
     * iterable object of the same type.
     * @param arrayLike {*} An array-like or iterable object to convert to a TypeSafeArray.
     * @param mapFn {Function} Map function to call on every element of the TypeSafeArray.
     * @param thisArg {*} Value to use as this when executing mapFn.
     * @return {TypeSafeArray} A new TypeSafeArray instance.
     * @throws {ErrorTypeSafe} If some items are not of the same type.
     */
    static from(arrayLike, mapFn = undefined, thisArg = undefined) {
        const array = Array.from(arrayLike, mapFn, thisArg);
        const type = getArrayType(array);
        if (isInitialized(type)) {
            return new TypeSafeArray(type, ...array);
        } else {
            throw new ErrorTypeSafe("initialize", array, getType(array[0]));
        }
    }

    /**
     * Mimics Array.of static method. creates a new TypeSafeArray instance from a variable number of arguments of the
     * same type.
     * @param items {*} Elements used to create the array.
     * @return {TypeSafeArray} A new TypeSafeArray instance.
     * @throws {ErrorTypeSafe} If some items are not of the same type.
     */
    static of(...items) {
        const array = Array.of(...items);
        const type = getArrayType(array);
        if (isInitialized(type)) {
            return new TypeSafeArray(type, ...array);
        } else {
            throw new ErrorTypeSafe("initialize", items, getType(array[0]));
        }
    }
}

/**
 * A type safe sorted array wrapper.
 * Provides improved search efficiency, at O(log n), implemented with binary search.
 * @extends {TypeSafeReadonlyArray}
 */
export class TypeSafeSortedArray extends TypeSafeReadonlyArray {
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

/**
 * Implementation of a doubly linked list. A linear collection, in which the elements are not stored
 * at contiguous memory locations. The elements in a linked list are linked using pointers.
 * Provides improved insertion efficiency, at O(1).
 * @extends {Object}
 */
export class LinkedList {
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
        return node ? node.value : undefined;
    }

    /**
     * Returns the index of the first element in the linked list that satisfies the provided testing function.
     * @param callback {Function} A function to execute on each value in the linked list
     * until the function returns true, indicating that the satisfying element was found.
     * @return {number} The index of the first element in the linked list that passes the test, otherwise, -1.
     */
    findIndex(callback) {
        const node = this.findNodeByCallback(callback);
        return node ? node.index : -1;
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
        return node ? node.value : undefined;
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
        return node ? node.index : -1;
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

/**
 * A type safe extension of LinkedList. Implementation of a type safe doubly linked list. A linear collection, in which
 * the elements are not stored at contiguous memory locations. The elements in a linked list are linked using pointers.
 * Provides improved insertion efficiency, at O(1).
 * @extends {LinkedList}
 */
export class TypeSafeLinkedList extends LinkedList {
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

/**
 * Implementation of a linear collection which follows a particular order in which the operations are performed.
 * The order is First In First Out (FIFO).
 * @extends {Object}
 */
export class Queue {
    /**
     * Sets this queue's list and items.
     * @param items {*} Items to add to this queue upon initialization.
     */
    constructor(...items) {
        /**
         * This queue's list.
         * @type {LinkedList}
         * @protected
         */
        this._list = new LinkedList(...items);
        /**
         * This queue capacity if set.
         * @type {number|Infinity}
         * @default Infinity
         * @private
         */
        this._capacity = Infinity;
    }

    /**
     * Sets the max capacity for this queue.
     * @param maxCapacity {number} The max capacity for this queue.
     * @throws {ErrorCapacity} If the set capacity is smaller than the current size
     */
    set capacity(maxCapacity) {
        if (maxCapacity >= this.size) {
            this._capacity = maxCapacity;
        } else {
            throw new ErrorCapacity("set", this.size, maxCapacity);
        }
    }

    /**
     * Returns the max capacity for this queue is set, Infinity otherwise.
     * @return {number|Infinity}
     * @type {number|Infinity}
     */
    get capacity() {
        return this._capacity;
    }

    /**
     * Returns the number of values in this queue.
     * @return {number}
     * @type {number}
     */
    get size() {
        return this._list.size;
    }

    /**
     * Removes the last element from the queue.
     * @return {*} The removed element from the queue, undefined if the queue is empty.
     */
    dequeue() {
        return this._list.pop();
    }

    /**
     * Adds one or more elements to the beginning of the queue.
     * If reached max capacity, for each new items removes the last element from the queue.
     * @param items {*} The elements to add to the front of the queue.
     * @return {number} The new size property of this queue.
     */
    enqueue(...items) {
        for (let i = items.length - 1; i >= 0; i--) {
            if (this.size >= this.capacity) {
                this.dequeue();
            }
            this._list.unshift(items[i]);
        }
        return this.size;
    }

    /**
     * Returns a boolean indicating whether an element with the specified value exists in this queue.
     * @param value {*} The value to test for presence in the this queue.
     * @return {boolean} True if an element with the specified value exists in this queue, false otherwise.
     */
    includes(value) {
        return this._list.includes(value);
    }

    /**
     * @return {boolean} True if this queue is empty, false otherwise.
     */
    isEmpty() {
        return this.size <= 0;
    }

    /**
     * @return {*} The value of the head of this queue.
     */
    peek() {
        return this._list.head.value;
    }

    /**
     * @return {string} String representation of this queue.
     * @override
     */
    toString() {
        return this._list.toString();
    }

    /**
     * Specifies the default iterator for queue.
     * @return {Generator} A new Iterator object that contains the values for each index in the queue.
     */
    [Symbol.iterator]() {
        return this._list[Symbol.iterator]();
    }
}

/**
 * A type safe extension of Queue. Implementation of a linear type safe collection which follows a particular order in
 * which the operations are performed.
 * The order is First In First Out (FIFO).
 * @extends {Queue}
 */
export class TypeSafeQueue extends Queue {
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
}

/**
 * Implementation of a linear collection which follows a particular order in which the operations are performed.
 * The order is LIFO (Last In First Out).
 * @extends {Object}
 */
export class Stack {
    /**
     * Sets this stack's list and items.
     * @param items {*} Items to add to this stack upon initialization
     */
    constructor(...items) {
        /**
         * This stack's list.
         * @type {LinkedList}
         * @protected
         */
        this._list = new LinkedList(...items);
        /**
         * This queue capacity if set.
         * @type {number|Infinity}
         * @default Infinity
         * @private
         */
        this._capacity = Infinity;
    }

    /**
     * Sets the max capacity for this stack.
     * @param maxCapacity {number} The max capacity for this stack.
     * @throws {ErrorCapacity}
     */
    set capacity(maxCapacity) {
        if (maxCapacity >= this.size) {
            this._capacity = maxCapacity;
        } else {
            throw new ErrorCapacity("set", this.size, maxCapacity);
        }
    }

    /**
     * Returns the max capacity for this queue is set, Infinity otherwise.
     * @return {number|Infinity}
     * @type {number|Infinity}
     */
    get capacity() {
        return this._capacity;
    }

    /**
     * Returns the number of values in this stack.
     * @return {number}
     * @type {number}
     */
    get size() {
        return this._list.size;
    }

    /**
     * Returns a boolean indicating whether an element with the specified value exists in this stack.
     * @param value {*} The value to test for presence in the this stack.
     * @return {boolean} True if an element with the specified value exists in this stack, false otherwise.
     */
    includes(value) {
        return this._list.includes(value);
    }

    /**
     * @return {boolean} True if this stack is empty, false otherwise.
     */
    isEmpty() {
        return this.size <= 0;
    }

    /**
     * @return {*} The value of the head of this stack.
     */
    peek() {
        return this._list.tail.value;
    }

    /**
     * Removes the last element from the stack.
     * @return {*} The removed element from the stack, undefined if the stack is empty.
     */
    pop() {
        return this._list.pop();
    }

    /**
     * Adds one or more elements to the end of the stack.
     * If reached max capacity, for each new items removes the last element from the stack.
     * @param items {*} The elements to add to the back of the stack.
     * @return {number} The new size property of this stack.
     */
    push(...items) {
        for (let i = 0; i < items.length; i++) {
            if (this.size >= this.capacity) {
                this.pop();
            }
            this._list.push(items[i]);
        }
        return this.size;
    }

    /**
     * @return {string} String representation of this stack.
     * @override
     */
    toString() {
        return this._list.toString();
    }

    /**
     * Specifies the default iterator for stack.
     * @return {Generator} A new Iterator object that contains the values for each index in the stack.
     */
    [Symbol.iterator]() {
        return this._list[Symbol.iterator]();
    }
}

/**
 * A type safe extension of Stack. Implementation of a linear type safe collection which follows a particular order in
 * which the operations are performed.
 * The order is LIFO (Last In First Out).
 */
export class TypeSafeStack extends Stack {
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

/**
 * A type safe extension of built-in Set object, that stores unique values of type <T>.
 * @extends {Set}
 */
export class TypeSafeSet extends Set {
    /**
     * Sets Set object type and items.
     * @param type {string} Type to use for this Set.
     * @param items {T} Items to add to Set.
     * @throws {ErrorTypeSafe} If some items are not of type <T>.
     * @template T
     */
    constructor(type, ...items) {
        super();
        this.type = type;
        if (isInitialized(items) && getArrayType(items) !== type) {
            throw new ErrorTypeSafe("initialize", items, type);
        } else {
            items.forEach(item => this.add(item));
        }
    }

    /**
     * Appends a new element with a specified value to the end of a Set object.
     * @param value {T} The value of the element to add to the Set object.
     * @return {Set} The Set object.
     * @throws {ErrorTypeSafe} If the value of the property to set is not of type <T>.
     * @override
     */
    add(value) {
        if (isType(value, this.type)) {
            return super.add(value);
        } else {
            throw new ErrorTypeSafe("assign", value, this.type);
        }
    }
}