// @flow strict
import { Model } from "./";
import type { TableRowType } from "../database";
import { HadesValidationError } from "../objects/errors";

/* eslint-disable flowtype/no-weak-types */
type SchemaDefinitionType = {|
    /* eslint-disable-next-line flowtype/no-primitive-constructor-types */
    [fieldName: string]: Number | Class<any>,
|};

type ModelFieldsType = {|
    id: number,
    [fieldName: string]: any,
|};

type FieldInstancesType = [string, Class<any>];
/* eslint-enable flowtype/no-weak-types */

/**
 * Field name constants.
 */
const FIELD_NAME_IDENTIFIER: string = "id";

/**
 * Type constants.
 */
const TYPE_UNDEFINED: string = "undefined";

/**
 * Separator constants.
 */
const SEPARATOR_SPACE: string = " ";

/**
 * @author Daniel van Dijk <daniel@invidiacreative.net>
 * @since 20200722 Initial creation.
 */
class Schema {
    schemaDefinition: SchemaDefinitionType;

    /**
     * @param {SchemaDefinitionType} schemaDefinition
     */
    constructor(schemaDefinition: SchemaDefinitionType): void {
        this.schemaDefinition = schemaDefinition;
    }

    /**
     * @param {TableRowType} fieldValues
     *
     * @returns {ModelFieldsType}
     * @throws {HadesValidationError}
     */
    castValuesAgainstDefinition(fieldValues: TableRowType): ModelFieldsType {
        if (fieldValues[FIELD_NAME_IDENTIFIER]) {
            // ID field is set.
        } else {
            throw new HadesValidationError(
                "ID is a required field for Model schema definition."
            );
        }

        /**
         * @param {SchemaDefinitionType} fieldInstances
         * @param {FieldInstancesType} currentField
         *
         * @returns {SchemaDefinitionType}
         */
        function reduceSchemaDefinition(
            fieldInstances: SchemaDefinitionType,
            [fieldName, FieldClass]: FieldInstancesType
        ): SchemaDefinitionType {
            return {
                ...fieldInstances,
                [fieldName]: new FieldClass(fieldValues[fieldName]),
            };
        }

        const schemaDefinitionBase: SchemaDefinitionType = {
            // ID is omitted from schema definition — it's always included.
            [FIELD_NAME_IDENTIFIER]: Number(fieldValues[FIELD_NAME_IDENTIFIER]),
        };

        // $FlowIssue
        return Object.entries(this.schemaDefinition).reduce(
            reduceSchemaDefinition,
            schemaDefinitionBase
        );
    }

    /**
     * @param {Class<Model>} ModelClass
     * @param {TableRowType} fields
     *
     * @throws {HadesValidationError}
     */
    assertSchemaAllowsFieldsForMutation(
        ModelClass: Class<Model>,
        fields: TableRowType
    ): void {
        const fieldWhitelist: Array<string> = [FIELD_NAME_IDENTIFIER];

        /**
         * @param {string} key
         *
         * @returns {boolean}
         *
         * @this Schema
         */
        function isFieldSuperfluous(key: string): boolean {
            return (
                fieldWhitelist.includes(key) === false &&
                typeof this.schemaDefinition[key] === TYPE_UNDEFINED
            );
        }

        Object.keys(fields).forEach((key: string): void => {
            if (isFieldSuperfluous.call(this, key)) {
                throw new HadesValidationError(
                    [
                        `Cannot apply mutation to ${ModelClass.toString()} model,`,
                        `found superfluous property '${key}'.`,
                    ].join(SEPARATOR_SPACE)
                );
            } else {
                // Field is allowed.
            }
        });
    }
}

export { Schema };
export type { ModelFieldsType };
