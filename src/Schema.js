import { ErrorValidation } from "./errors";

/**
 * Field name constants.
 */
const FIELD_NAME_IDENTIFIER = "id";

/**
 * @author Daniel van Dijk <daniel@invidiacreative.net>
 * @since 20200722 Initial creation.
 */
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
        if (fieldValues[FIELD_NAME_IDENTIFIER]) {
            // ID field is set.
        } else {
            this._createErrorFieldIdIsRequired();
        }

        /**
         * @type {[string, any][]}
         */
        const fieldEntries = Object.entries(this.schemaDefinition);

        /**
         * @param {Object} fieldInstances
         * @param {[string, any]} currentField
         *
         * @returns {Object}
         */
        const reduceSchemaDefinition = (
            fieldInstances,
            [fieldName, FieldClass]
        ) => ({
            ...fieldInstances,
            [fieldName]: new FieldClass(fieldValues[fieldName]),
        });

        return fieldEntries.reduce(reduceSchemaDefinition, {
            // ID is omitted from schema definition (it's always included).
            [FIELD_NAME_IDENTIFIER]: new Number(
                fieldValues[FIELD_NAME_IDENTIFIER]
            ),
        });
    }

    /**
     * @param {Model} Model
     * @param {Object} fields
     *
     * @throws {Error}
     */
    assertSchemaAllowsFieldsForMutation(Model, fields) {
        const fieldWhitelist = [FIELD_NAME_IDENTIFIER];

        /**
         * @param {string} key
         */
        const isFieldSuperfluous = (key) => {
            return (
                fieldWhitelist.includes(key) === false &&
                this.schemaDefinition[key] === undefined
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
     * @throws {ErrorValidation}
     */
    _createErrorModelPropertySuperfluous(modelName, propertyNameSuperfluous) {
        throw new ErrorValidation(
            [
                `Cannot apply mutation to ${modelName} model,`,
                `found superfluous property '${propertyNameSuperfluous}'.`,
            ].join(" ")
        );
    }

    /**
     * @throws {ErrorValidation}
     */
    _createErrorFieldIdIsRequired() {
        throw new ErrorValidation(
            "ID is a required field for Model schema definition."
        );
    }
}

export { Schema };
