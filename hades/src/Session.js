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
     * @param {Model} Model
     *
     * @returns {Table}
     */
    getPointerForModelTable(Model) {
        return this.state[Model.getTableKey()];
    }

    /**
     * @param {Object} options
     */
    applyMutation(options) {
        const { Model, fields, modelId } = options;

        /**
         * @returns {Table}
         */
        const getPointerModelTable = () => {
            return this.getPointerForModelTable(Model);
        };

        switch (options.type) {
            case "CREATE":
                this.runPropertyMutationBouncer(Model, fields);
                getPointerModelTable().insertRow(fields);
                break;

            case "UPDATE":
                this.runPropertyMutationBouncer(Model, fields);
                getPointerModelTable().updateRow(modelId, fields);
                break;

            case "DELETE":
                getPointerModelTable().deleteRow(modelId);
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
