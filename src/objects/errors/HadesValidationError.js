// @flow strict
/**
 * Error constants.
 */
const ERROR_NAME: string = "HadesValidationError";

/**
 * @author Daniel van Dijk <daniel@invidiacreative.net>
 * @since 22072020 Clean up.
 */
class HadesValidationError extends Error {
    /**
     * @returns {string}
     */
    get name(): string {
        return ERROR_NAME;
    }

    /**
     * @param {string} value
     *
     * @returns {void}
     */
    set name(value: string): void {
        // Do nothing.
    }
}

export { HadesValidationError };
