class Session {
    /**
     * @param {Object} state
     */
    constructor(state) {
        this.state = state;
    }

    /**
     * @param {Model[]} models
     */
    addModels(models) {
        this.models = models;
    }

    /**
     * @param {Object} state
     */
    mergeIntoState(state) {
        Object.assign(this.state, state);
    }

    /**
     * @param {Object} options
     *
     * @returns {Table}
     * @throws {ReferenceError}
     */
    getPointerForModelTable(options) {
        if (options.model) {
            return this.state[options.model.tableKey];
        } else if (options.Model) {
            return this.state[options.Model.getTableKey()];
        } else {
            throw new ReferenceError("Cannot get model table pointer.");
        }
    }

    /**
     * @param {Object} options
     */
    applyMutation(options) {
        /**
         * @returns {Table}
         */
        const getPointerModelTable = () => {
            return this.getPointerForModelTable(options);
        };

        switch (options.type) {
            case "CREATE":

                this.runPropertyMutationBouncer(options.Model, options.fields);
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

        // TODO: Validate fields against definitions.
    }
}

export { Session };
