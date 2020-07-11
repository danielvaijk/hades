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
        } else {
            return true;
        }

        // TODO: Validate properties against field definitions.
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

        if (passedBouncerChecks) {
            // Passed bouncer validation checks. Allowed to continue.
        } else {
            return;
        }

        // TODO: Add 'identifier' field type, so we know if there's a specific field value
        // that should be used as the identifier (like a uuid, instead of id).
        // TODO: Also, make sure there are no ID collisions (trying to create model with non-unique identifier).

        const modelTable = Model.session.state[Model.getTableKey()];
        const modelId = Object.keys(modelTable.rows).length + 1;

        modelTable.rows[modelId] = {
            id: modelId,
            ...properties,
        };

        this.passOverStateMutationsFromLocalCopyToSessionState(Model);
    }
}

export { Session };
