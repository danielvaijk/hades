// @flow strict
/* global TableRowType */
/* global ModelFieldsType */
/* global GLOBAL_INDEX_INVALID */
/* global GLOBAL_TYPE_UNDEFINED */
/* global GLOBAL_SEPARATOR_SPACE */
/* global GLOBAL_DEFAULT_KEY_NAME_ID */
import type { Model } from "./Model";
import { EnumEntry } from "../objects/EnumEntry";
import { FieldTypeEnum } from "../objects/enums/FieldTypeEnum";
import { HadesValidationError } from "../objects/errors/HadesValidationError";

opaque type FieldDefinitionType = FieldClassType | EnumEntry;
opaque type FieldInstancesType = [string, FieldDefinitionType];
opaque type SchemaDefinitionType = {|
    [fieldName: string]: FieldDefinitionType,
|};

/**
 * @author Daniel van Dijk <daniel@invidiacreative.net>
 * @since 20200722 Initial creation.
 */
class Schema {
    _schemaDefinition: SchemaDefinitionType;

    /**
     * @param {SchemaDefinitionType} schemaDefinition
     *
     * @returns {void}
     */
    constructor(schemaDefinition: SchemaDefinitionType): void {
        this._schemaDefinition = schemaDefinition;
    }

    /**
     * @param {FieldClassType} FieldClass
     *
     * @returns {EnumEntry}
     */
    static defineIdentifierField(FieldClass: FieldClassType): EnumEntry {
        return FieldTypeEnum.IDENTIFIER(FieldClass);
    }

    /**
     * @param {TableRowType} fieldValues
     * @param {boolean} isIdentifierRequired
     *
     * @returns {ModelFieldsType}
     * @throws {HadesValidationError}
     */
    castValuesAgainstDefinition(
        fieldValues: TableRowType,
        isIdentifierRequired: boolean
    ): ModelFieldsType {
        const definedIdentifierFieldNameOrNull:
            | string
            | null = this.getDefinedIdentifierFieldNameOrNull();
        const fieldNameIdentifier: string =
            definedIdentifierFieldNameOrNull || GLOBAL_DEFAULT_KEY_NAME_ID;

        if (fieldValues[fieldNameIdentifier]) {
            // Value for identifier field was provided.
        } else if (isIdentifierRequired && definedIdentifierFieldNameOrNull) {
            throw new HadesValidationError(
                `Value is required for identifier field '${fieldNameIdentifier}'.`
            );
        } else {
            // Value for identifier field was not provided but was also not required.
        }

        /**
         * @param {SchemaDefinitionType} fieldInstances
         * @param {FieldInstancesType} currentField
         *
         * @returns {SchemaDefinitionType}
         */
        function reduceSchemaDefinition(
            fieldInstances: SchemaDefinitionType,
            [fieldName, fieldValue]: FieldInstancesType
        ): SchemaDefinitionType {
            if (fieldValues[fieldName]) {
                const FieldClass: FieldClassType =
                    fieldValue instanceof EnumEntry
                        ? fieldValue.getValue()
                        : fieldValue;

                if (fieldValues[fieldName] instanceof FieldClass) {
                    return {
                        ...fieldInstances,
                        [fieldName]: fieldValues[fieldName],
                    };
                } else {
                    return {
                        ...fieldInstances,
                        [fieldName]: new FieldClass(fieldValues[fieldName]),
                    };
                }
            } else {
                return fieldInstances;
            }
        }

        /**
         * @returns {SchemaDefinitionType}
         *
         * @this Schema
         */
        function determineSchemaDefinitionBase(): SchemaDefinitionType {
            if (definedIdentifierFieldNameOrNull) {
                return {};
            } else {
                return {
                    [GLOBAL_DEFAULT_KEY_NAME_ID]: Number(
                        fieldValues[GLOBAL_DEFAULT_KEY_NAME_ID]
                    ),
                };
            }
        }

        // $FlowIssue
        return Object.entries(this._schemaDefinition).reduce(
            reduceSchemaDefinition,
            determineSchemaDefinitionBase.call(this)
        );
    }

    /**
     * @param {Class<Model>} ModelClass
     * @param {TableRowType} fields
     *
     * @returns {void}
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
                typeof this._schemaDefinition[key] === GLOBAL_TYPE_UNDEFINED
            );
        }

        Object.keys(fields).forEach((key: string): void => {
            if (isFieldSuperfluous.call(this, key)) {
                throw new HadesValidationError(
                    [
                        `Cannot apply mutation to ${ModelClass.toString()} model,`,
                        `found superfluous property '${key}'.`,
                    ].join(GLOBAL_SEPARATOR_SPACE)
                );
            } else {
                // Field is allowed.
            }
        });
    }

    /**
     * @returns {string|null}
     */
    getDefinedIdentifierFieldNameOrNull(): string | null {
        // $FlowIssue
        const fieldDefinitions: Array<FieldInstancesType> = Object.entries(
            this._schemaDefinition
        );
        const fieldIdentifierIndex: number = fieldDefinitions.findIndex(
            // $FlowIssue
            // eslint-disable-next-line no-unused-vars
            ([fieldName, fieldValue]: FieldInstancesType): boolean => {
                return (
                    fieldValue instanceof EnumEntry &&
                    fieldValue.equals(FieldTypeEnum.IDENTIFIER())
                );
            }
        );

        if (fieldIdentifierIndex === GLOBAL_INDEX_INVALID) {
            return null;
        } else {
            return fieldDefinitions[fieldIdentifierIndex][0];
        }
    }
}

export { Schema };
