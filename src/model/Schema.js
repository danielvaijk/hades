// @flow strict
/* global GLOBAL_DEFAULT_KEY_NAME_ID */
import { Model } from "./";
import type { TableRowType } from "../database";
import { HadesValidationError } from "../objects/errors";

/* eslint-disable flowtype/no-weak-types */
opaque type SchemaDefinitionType = {|
    /* eslint-disable-next-line flowtype/no-primitive-constructor-types */
    [fieldName: string]: Number | Class<any>,
|};

opaque type FieldInstancesType = [string, Class<any>];

type ModelFieldsType = {|
    [fieldName: string]: any,
|};
/* eslint-enable flowtype/no-weak-types */

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
        if (fieldValues[GLOBAL_DEFAULT_KEY_NAME_ID]) {
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
            [GLOBAL_DEFAULT_KEY_NAME_ID]: Number(
                fieldValues[GLOBAL_DEFAULT_KEY_NAME_ID]
            ),
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
        const fieldWhitelist: Array<string> = [GLOBAL_DEFAULT_KEY_NAME_ID];

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
