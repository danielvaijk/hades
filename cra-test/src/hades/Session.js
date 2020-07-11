class Session {
    /**
     * @param {Model} Model
     * @param {Object} properties
     *
     * @returns {boolean}
     */
    static runMutationBouncer(Model, properties) {
        const fields = Model.fields();
        const superfluousPropertyName = Object.keys(properties).find((key) => {
            return fields[key] === undefined;
        });

        if (superfluousPropertyName) {
            console.error(
                [
                    `Cannot apply create mutation via ${Model.toString()} model, `,
                    `found superfluous property '${superfluousPropertyName}'.`,
                ].join("")
            );

            return false;
        }

        return true;
    }

    /**
     * @param {Model} model
     */
    static passOverStateMutationsFromLocalCopyToSessionState(Model) {
        Model.sessionReference.state = Model.session.state;
    }

    /**
     * @param {Model} Model
     * @param {Object} properties
     */
    static applyStateMutationCreate(Model, properties) {
        const passedBouncerChecks = this.runMutationBouncer(Model, properties);

        if (!passedBouncerChecks) {
            return;
        }

        const modelTable = Model.session.state[Model.getTableKey()];
        const modelId = Object.keys(modelTable.rows).length + 1;

        modelTable.rows[modelId] = {
            id: modelId,
            ...properties,
        };

        this.passOverStateMutationsFromLocalCopyToSessionState(Model);
    }
}

export default Session;
