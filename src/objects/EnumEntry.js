// @flow strict
/**
 * @author Daniel van Dijk <daniel@invidiacreative.net>
 * @since 20201007 Initial creation.
 */
class EnumEntry {
    _key: string;
    _value: string;

    /**
     * @param {string} key
     * @param {string} value
     */
    constructor(key: string, value: string): void {
        this._key = key;
        this._value = value;
    }

    /**
     * @returns {string}
     */
    getValue(): string {
        return this._value;
    }

    /**
     * @param {EnumEntry} entry
     *
     * @returns {boolean}
     */
    equals(entry: EnumEntry): boolean {
        return entry.getValue() === this._value;
    }
}

export { EnumEntry };
