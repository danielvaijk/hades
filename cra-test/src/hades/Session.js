import Table from "./Table";

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
     * @param {Model} Model
     * @param {Object} properties
     */
    static applyStateMutationCreate(Model, properties) {
        const passedBouncerChecks = this.runMutationBouncer(Model, properties);

        if (!passedBouncerChecks) {
            return;
        }

        // TODO: Validate properties against field definitions.

        Model.session.state[Table.createModelTableName(Model)].rows.push({
            ...properties,
        });
    }
}

export default Session;
