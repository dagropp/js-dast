import {getArrayType, isInitialized, isType} from "../common/utils";
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

export default TypeSafeSet;