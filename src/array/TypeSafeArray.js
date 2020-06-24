import {getArrayType, getType, isInitialized, isType, setDefaultCompare} from "../common/utils";
import ErrorTypeSafe from "../error/ErrorTypeSafe";
import TypeSafeReadonlyArray from "./TypeSafeReadonlyArray";

/**
 * A type safe array wrapper. Includes all Array.prototype methods, with type safe validation.
 * @extends {TypeSafeReadonlyArray}
 */
class TypeSafeArray extends TypeSafeReadonlyArray {
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

export default TypeSafeArray;