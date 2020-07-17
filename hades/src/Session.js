class Session {
    /**
     * @param {Object} state
     */
    constructor(state) {
        this.state = state;
    }

    /**
     * @param {Model[]} modelClasses
     *
     * @returns {Session}
     */
    withModelClasses(modelClasses) {
        this.models = modelClasses;

        return this;
    }

    /**
     * @param {Object} state
     */
    mergeIntoState(state) {
        Object.assign(this.state, state);
    }

    /**
     * @param {Model} modelClass
     */
    getPointerForModelTable(modelClass) {
        return this.state[modelClass.getTableKey()];
    }

    /**
     * @param {Object} options
     */
    applyMutation(options) {
        /**
         * @returns {Table}
         */
        const getPointerModelTable = () => {
            return this.getPointerForModelTable(options.modelClass);
        };

        switch (options.type) {
            case "CREATE":
                this.runPropertyMutationBouncer(
                    options.modelClass,
                    options.fields
                );

                getPointerModelTable().insertRow(options.fields);
                break;

            case "DELETE":
                getPointerModelTable().deleteRow(options.modelId);
                break;

            default:
                throw new RangeError(`Unexpected mutation type: '${type}'`);
        }
    }

    /**
     * @param {Model} Model
     * @param {Object} fields
     *
     * @throws {Error}
     */
    runPropertyMutationBouncer(Model, fields) {
        const fieldDefinition = Model.fields();
        const superfluousPropertyName = Object.keys(fields).find((key) => {
            return fieldDefinition[key] === undefined;
        });

        if (superfluousPropertyName) {
            throw new Error(
                [
                    `Cannot apply create mutation via ${Model.toString()} model, `,
                    `found superfluous property '${superfluousPropertyName}'.`,
                ].join("")
            );
        } else {
            // Passed bouncer checks.
        }

        // TODO: Validate properties against field definitions.
    }
}

export { Session };
