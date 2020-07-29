/**
 * @author Daniel van Dijk <daniel@invidiacreative.net>
 * @since 22072020 Clean up.
 */
class ErrorValidation extends Error {
    /**
     * @param {string} message
     */
    constructor(message) {
        super(message);

        this.name = "HadesErrorValidation";
    }
}

export { ErrorValidation };
