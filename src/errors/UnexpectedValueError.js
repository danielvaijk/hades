class UnexpectedValueError extends Error {
    /**
     * @param {string} message
     */
    constructor(message) {
        super(message);

        this.name = "HadesUnexpectedValueError";
    }
}

export { UnexpectedValueError };
