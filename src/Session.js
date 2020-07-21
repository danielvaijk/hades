import { ValidationError, UnexpectedValueError } from "./errors";

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
                this.createErrorUnexpectedMutationType();
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
        const propertyNameSuperfluous = Object.keys(fields).find((key) => {
            return isFieldSuperfluous(key);
        });

        if (propertyNameSuperfluous) {
            this.createErrorModelPropertySuperfluous(
                Model.toString(),
                propertyNameSuperfluous
            );
        } else {
            // Passed bouncer checks.
        }

        // TODO: Validate fields against definitions.
    }

    /**
     * @param {string} mutationType
     *
     * @throws {UnexpectedValueError}
     */
    createErrorUnexpectedMutationType(mutationType) {
        throw new UnexpectedValueError(
            `Unexpected mutation type: '${mutationType}'`
        );
    }

    /**
     * @param {string} modelName
     * @param {string} propertyNameSuperfluous
     *
     * @throws {ValidationError}
     */
    createErrorModelPropertySuperfluous(modelName, propertyNameSuperfluous) {
        throw new ValidationError(
            [
                `Cannot apply create mutation via ${modelName} model,`,
                `found superfluous property '${propertyNameSuperfluous}'.`,
            ].join(" ")
        );
    }
}

export { Session };
