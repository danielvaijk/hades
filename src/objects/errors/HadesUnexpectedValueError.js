// @flow strict
/**
 * @author Daniel van Dijk <daniel@invidiacreative.net>
 * @since 22072020 Clean up.
 */
class HadesUnexpectedValueError extends Error {
    /**
     * @returns {string}
     */
    get name(): string {
        return "HadesUnexpectedValueError";
    }

    /**
     * @param {string} value
     */
    set name(value: string): void {
        // Do nothing.
    }
}

export { HadesUnexpectedValueError };
