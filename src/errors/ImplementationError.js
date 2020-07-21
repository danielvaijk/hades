class ImplementationError extends Error {
    /**
     * @param {string} message
     */
    constructor(message) {
        super(message);

        this.name = "HadesImplementationError";
    }
}

export { ImplementationError };
