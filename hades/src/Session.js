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
     * @param {Object} options
     */
    applyMutation(options) {
        switch (options.type) {
            case "CREATE": {
                this.runPropertyMutationBouncer(
                    options.modelClass,
                    options.properties
                );

                const key = options.modelClass.getTableKey();
                const modelTable = this.state[key];

                const modelId = Object.keys(modelTable.rows).length + 1;

                modelTable.rows[modelId] = {
                    id: modelId,
                    ...options.properties,
                };
                break;
            }

            case "DELETE": {
                const key = options.modelClass.tableKey;
                const modelTable = this.state[key];

                delete modelTable.rows[options.modelId];
                break;
            }

            default: {
                throw new RangeError(`Unexpected mutation type: '${type}'`);
            }
        }
    }

    /**
     * @param {Model} Model
     * @param {Object} properties
     *
     * @throws {Error}
     */
    runPropertyMutationBouncer(Model, properties) {
        const fields = Model.fields();
        const superfluousPropertyName = Object.keys(properties).find((key) => {
            return fields[key] === undefined;
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
