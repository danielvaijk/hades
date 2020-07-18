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
        const pointerModelTable = this.getPointerForModelTable(Model);

        switch (options.type) {
            case "INSERT":
                this.runPropertyMutationBouncer(Model, fields);
                pointerModelTable.insertRow(fields);
                break;

            case "UPDATE":
                this.runPropertyMutationBouncer(Model, fields);
                pointerModelTable.updateRow(modelId, fields);
                break;

            case "UPSERT":
                this.runPropertyMutationBouncer(Model, fields);
                pointerModelTable.upsertRow(fields);
                break;

            case "DELETE":
                pointerModelTable.deleteRow(modelId);
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
        const fieldWhitelist = ["id"];
        const fieldDefinition = Model.fields();

        /**
         * @param {string} key
         */
        const isFieldSuperfluous = (key) => {
            return (
                fieldDefinition[key] === undefined &&
                !fieldWhitelist.includes(key)
            );
        };

        /**
         * @type {string}
         */
        const superfluousPropertyName = Object.keys(fields).find((key) => {
            return isFieldSuperfluous(key);
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
