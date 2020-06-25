import {getArrayType, getType, isInitialized, isType} from "../common/utils";
import ErrorTypeSafe from "../error/ErrorTypeSafe";

/**
 * A type safe extension of built-in Set object, that stores unique values of type <T>.
 * @extends {Set}
 */
class TypeSafeSet extends Set {
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
     * Appends a new element with a specified value to the end of a TypeSafeSet object.
     * @param value {T} The value of the element to add to the TypeSafeSet object.
     * @return {TypeSafeSet} The TypeSafeSet object.
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

    /**
     * Creates a new, shallow-copied TypeSafeSet instance from an array-like or iterable object.
     * @param arrayLike {*} An array-like or iterable object to convert to TypeSafeSet.
     * @return {TypeSafeSet} A new TypeSafeSet instance.
     * @throws {ErrorTypeSafe} If some items are not of the same type.
     * @override
     */
    static from(arrayLike) {
        const type = getArrayType(arrayLike);
        if (isInitialized(type)) {
            return new TypeSafeSet(type, ...arrayLike);
        } else {
            throw new ErrorTypeSafe("initialize", arrayLike, getType(arrayLike[0]));
        }
    }

    /**
     * Creates a new TypeSafeSet instance from a variable number of arguments.
     * @param items {*} Elements used to create the TypeSafeSet.
     * @return {TypeSafeSet} A new TypeSafeSet instance.
     * @throws {ErrorTypeSafe} If some items are not of the same type.
     * @override
     */
    static of(...items) {
        const type = getArrayType(items);
        if (isInitialized(type)) {
            return new TypeSafeSet(type, ...items);
        } else {
            throw new ErrorTypeSafe("initialize", items, getType(items[0]));
        }
    }
}

export default TypeSafeSet;