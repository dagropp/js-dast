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