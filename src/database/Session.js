// @flow strict
import { Table } from "./";
import { Model } from "../model";
import { EnumEntry, Mutation } from "../objects";
import { MutationTypeEnum } from "../objects/enums";
import { HadesUnexpectedValueError } from "../objects/errors";

/**
 * @author Daniel van Dijk <daniel@invidiacreative.net>
 * @since 20200718 Initial creation.
 */
class Session {
    state: StateType;
    models: Array<Class<Model>>;

    /**
     * @param {StateType} state
     */
    constructor(state: StateType): void {
        this.state = state;
    }

    /**
     * @param {Array<Class<Model>>} models
     */
    addModels(models: Array<Class<Model>>): void {
        this.models = models;
    }

    /**
     * @param {StateType} object
     */
    mergeIntoState(object: StateType): void {
        Object.assign(this.state, object);
    }

    /**
     * @param {Mutation} mutation
     *
     * @throws {HadesUnexpectedValueError}
     */
    applyMutation(mutation: Mutation): void {
        const type: EnumEntry = mutation.getType();
        const ModelClass: Class<Model> = mutation.getModelClass();
        const pointerModelTableOrNull: Table | null = this._getPointerForModelTableOrNull(
            ModelClass
        );

        if (pointerModelTableOrNull) {
            // Found pointer to model's table.
        } else {
            throw new HadesUnexpectedValueError(
                "Cannot apply mutation to Model without table pointer."
            );
        }

        const modelIdOrNull: number | null = mutation.getModelIdOrNull();
        const fieldsOrNull: TableRowType | null = mutation.getFieldsOrNull();
        const willApplyToEntireTable: boolean = mutation.getWillApplyToEntireTable();

        if (fieldsOrNull) {
            ModelClass.fields().assertSchemaAllowsFieldsForMutation(
                ModelClass,
                fieldsOrNull
            );
        } else {
            // No fields for this mutation type.
        }

        if (type.equals(MutationTypeEnum.INSERT())) {
            this._applyInsertMutation(pointerModelTableOrNull, fieldsOrNull);
        } else if (type.equals(MutationTypeEnum.UPSERT())) {
            this._applyUpsertMutation(pointerModelTableOrNull, fieldsOrNull);
        } else if (type.equals(MutationTypeEnum.DELETE())) {
            this._applyDeleteMutation(
                pointerModelTableOrNull,
                modelIdOrNull,
                willApplyToEntireTable
            );
        } else if (type.equals(MutationTypeEnum.UPDATE())) {
            this._applyUpdateMutation(
                pointerModelTableOrNull,
                fieldsOrNull,
                modelIdOrNull
            );
        } else {
            throw new HadesUnexpectedValueError(
                `Unexpected mutation type '${type.getValue()}'.`
            );
        }
    }

    /**
     * @param {Class<Model>} ModelClass
     *
     * @returns {Table|null}
     */
    _getPointerForModelTableOrNull(ModelClass: Class<Model>): Table | null {
        const tableKeyOrNull: string | null = ModelClass.getTableKeyOrNull();

        if (tableKeyOrNull) {
            return this.state[tableKeyOrNull];
        } else {
            return null;
        }
    }

    /**
     * @param {Table} pointerTable
     * @param {number|null} modelIdOrNull
     * @param {boolean} willApplyToEntireTable
     *
     * @throws {HadesUnexpectedValueError}
     */
    _applyDeleteMutation(
        pointerTable: Table,
        modelIdOrNull: number | null,
        willApplyToEntireTable: boolean
    ): void {
        if (willApplyToEntireTable) {
            pointerTable.truncate();
        } else if (modelIdOrNull) {
            pointerTable.deleteRow(modelIdOrNull);
        } else {
            throw new HadesUnexpectedValueError(
                "Model ID cannot be null for DELETE MutationType."
            );
        }
    }

    /**
     * @param {Table} pointerTable
     * @param {TableRowType|null} fieldsOrNull
     *
     * @throws {HadesUnexpectedValueError}
     */
    _applyInsertMutation(
        pointerTable: Table,
        fieldsOrNull: TableRowType | null
    ): void {
        if (fieldsOrNull) {
            pointerTable.insertRow(fieldsOrNull);
        } else {
            throw new HadesUnexpectedValueError(
                "Fields are required for INSERT MutationType."
            );
        }
    }

    /**
     * @param {Table} pointerTable
     * @param {TableRowType|null} fieldsOrNull
     *
     * @throws {HadesUnexpectedValueError}
     */
    _applyUpsertMutation(
        pointerTable: Table,
        fieldsOrNull: TableRowType | null
    ): void {
        if (fieldsOrNull) {
            pointerTable.upsertRow(fieldsOrNull);
        } else {
            throw new HadesUnexpectedValueError(
                "Fields are required for UPSERT MutationType."
            );
        }
    }

    /**
     * @param {Table} pointerTable
     * @param {TableRowType|null} fieldsOrNull
     * @param {number|null} modelIdOrNull
     *
     * @throws {HadesUnexpectedValueError}
     */
    _applyUpdateMutation(
        pointerTable: Table,
        fieldsOrNull: TableRowType | null,
        modelIdOrNull: number | null
    ): void {
        if (fieldsOrNull === null) {
            throw new HadesUnexpectedValueError(
                "Fields are required for UPDATE MutationType."
            );
        } else if (modelIdOrNull === null) {
            throw new HadesUnexpectedValueError(
                "Model ID cannot be null for UPDATE MutationType."
            );
        } else {
            pointerTable.updateRow(modelIdOrNull, fieldsOrNull);
        }
    }
}

export { Session };
