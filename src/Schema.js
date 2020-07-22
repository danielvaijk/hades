import { ValidationError } from "./errors";

class Schema {
    /**
     * @param {Object} schemaDefinition
     */
    constructor(schemaDefinition) {
        this.schemaDefinition = schemaDefinition;
    }

    /**
     * @param {Object} fieldValues
     *
     * @returns {Object}
     */
    castValuesAgainstDefinition(fieldValues) {
        if (fieldValues.id) {
            // ID field is set.
        } else {
            this._createErrorFieldIdIsRequired();
        }

        /**
         * @type {[string, any][]}
         */
        const fieldEntries = Object.entries(this.schemaDefinition);

        /**
         * @param {Object} castDefinition
         * @param {[string, any]} currentField
         *
         * @returns {Object}
         */
        const reduceSchemaDefinition = (
            castDefinition,
            [fieldName, FieldClass]
        ) => ({
            ...castDefinition,
            [fieldName]: new FieldClass(fieldValues[fieldName]),
        });

        return fieldEntries.reduce(reduceSchemaDefinition, {
            // ID is omitted from schema definition (it's always included).
            id: new Number(fieldValues.id),
        });
    }

    /**
     * @param {Model} Model
     * @param {Object} fields
     *
     * @throws {Error}
     */
    runSchemaMutationBouncer(Model, fields) {
        const fieldWhitelist = ["id"];

        /**
         * @param {string} key
         */
        const isFieldSuperfluous = (key) => {
            return (
                this.schemaDefinition[key] === undefined &&
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
            this._createErrorModelPropertySuperfluous(
                Model.toString(),
                propertyNameSuperfluous
            );
        } else {
            // Passed bouncer checks.
        }
    }

    /**
     * @param {string} modelName
     * @param {string} propertyNameSuperfluous
     *
     * @throws {ValidationError}
     */
    _createErrorModelPropertySuperfluous(modelName, propertyNameSuperfluous) {
        throw new ValidationError(
            [
                `Cannot apply create mutation via ${modelName} model,`,
                `found superfluous property '${propertyNameSuperfluous}'.`,
            ].join(" ")
        );
    }

    /**
     * @throws {ValidationError}
     */
    _createErrorFieldIdIsRequired() {
        throw new ValidationError(
            "ID is a required field for Model schema definition."
        );
    }
}

export { Schema };
