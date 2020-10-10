// @flow strict
/* eslint-disable flowtype/no-weak-types */
/**
 * @author Daniel van Dijk <daniel@invidiacreative.net>
 * @since 20201007 Initial creation.
 */
class EnumEntry {
    _key: string;
    _value: any;

    /**
     * @param {string} key
     * @param {any} value
     */
    constructor(key: string, value: any): void {
        this._key = key;
        this._value = value;
    }

    /**
     * @returns {string}
     */
    getKey(): string {
        return this._key;
    }

    /**
     * @returns {any}
     */
    getValue(): any {
        return this._value;
    }

    /**
     * @param {EnumEntry} entry
     *
     * @returns {boolean}
     */
    equals(entry: EnumEntry): boolean {
        return entry.getKey() === this._key;
    }
}

export { EnumEntry };
