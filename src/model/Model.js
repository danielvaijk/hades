// @flow strict
import type { Schema } from "./Schema";
import { Mutation } from "../objects/Mutation";
import type { Table } from "../database/Table";
import type { Session } from "../database/Session";
import { MutationTypeEnum } from "../objects/enums/MutationTypeEnum";
import { HadesValidationError } from "../objects/errors/HadesValidationError";

/**
 * @author Daniel van Dijk <daniel@invidiacreative.net>
 * @since 20200718 Initial creation.
 */
class Model {
    _session: Session;
    _tableKey: string;
    _fields: ModelFieldsType;
    _ModelClass: Class<Model>;
    _modelId: ModelIdentifierType;
    _identifierKey: ModelIdentifierType;

    static session: Session;
    static tableKey: string;
    static identifierKey: ModelIdentifierType;

    static fields: () => Schema;
    static toString: () => string;
    static reducer: (action: ActionType) => void;

    /**
     * @param {Class<Model>} ModelClass
     * @param {ModelIdentifierType} modelId
     */
    constructor(ModelClass: Class<Model>, modelId: ModelIdentifierType): void {
        this._modelId = modelId;
        this._ModelClass = ModelClass;
        this._session = this._ModelClass.session;
        this._tableKey = this._ModelClass.tableKey;
        this._identifierKey = this._ModelClass.identifierKey;

        const modelSchemaDefinition: Schema = this._ModelClass.fields();
        const fieldValuesOrNull: Model | null = this._getFieldValuesFromTableOrNull();

        if (fieldValuesOrNull) {
            this._fields = modelSchemaDefinition.castValuesAgainstDefinition(
                fieldValuesOrNull
            );
        } else {
            throw new HadesValidationError(
                `No data exists for Model instance with ID '${modelId}'.`
            );
        }
    }

    /**
     * @param {TableRowType} fields
     */
    update(fields: TableRowType): void {
        this._session.applyMutation(
            new Mutation({
                fields,
                ModelClass: this._ModelClass,
                type: MutationTypeEnum.UPDATE(),
                modelId: this._fields[this._identifierKey],
            })
        );
    }

    /**
     */
    delete(): void {
        this._session.applyMutation(
            new Mutation({
                ModelClass: this._ModelClass,
                type: MutationTypeEnum.DELETE(),
                modelId: this._fields[this._identifierKey],
            })
        );
    }

    /**
     * @param {TableRowType} fields
     */
    static create(fields: TableRowType): void {
        this.session.applyMutation(
            new Mutation({
                fields,
                ModelClass: this,
                type: MutationTypeEnum.INSERT(),
            })
        );
    }

    /**
     * @param {TableRowType} fields
     */
    static upsert(fields: TableRowType): void {
        this.session.applyMutation(
            new Mutation({
                fields,
                ModelClass: this,
                type: MutationTypeEnum.UPSERT(),
            })
        );
    }

    /**
     */
    static deleteAll(): void {
        this.session.applyMutation(
            new Mutation({
                ModelClass: this,
                willApplyToEntireTable: true,
                type: MutationTypeEnum.DELETE(),
            })
        );
    }

    /**
     * @param {ModelIdentifierType} modelId
     *
     * @returns {Model}
     */
    static withId(modelId: ModelIdentifierType): Model {
        return new Model(this, modelId);
    }

    /**
     * @returns {string|null}
     */
    static getTableKeyOrNull(): string | null {
        return this.tableKey || null;
    }

    /**
     * @param {string} tableKey
     */
    static addTableKey(tableKey: string): void {
        this.tableKey = tableKey;
    }

    /**
     * @param {ModelIdentifierType} identifierKey
     */
    static addIdentifierKey(identifierKey: ModelIdentifierType): void {
        this.identifierKey = identifierKey;
    }

    /**
     * @param {Session} session
     */
    static addSession(session: Session): void {
        this.session = session;
    }

    /**
     * @returns {Table|null}
     */
    _getTableInstanceOrNull(): Table | null {
        return this?._session.getState()[this._tableKey ?? ""] || null;
    }

    /**
     * @returns {Model|null}
     * @throws {HadesValidationError}
     */
    _getFieldValuesFromTableOrNull(): Model | null {
        const tableOrNull: Table | null = this._getTableInstanceOrNull();

        if (tableOrNull) {
            return tableOrNull.getRows()[this._modelId] || null;
        } else {
            throw new HadesValidationError(
                "Cannot get Model instance with missing Table."
            );
        }
    }
}

export { Model };
