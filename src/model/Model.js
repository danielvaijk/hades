// @flow strict
import type { Schema } from "./Schema";
import { Mutation } from "../objects/Mutation";
import type { Session } from "../database/Session";
import { MutationTypeEnum } from "../objects/enums/MutationTypeEnum";
import { HadesValidationError } from "../objects/errors/HadesValidationError";

/**
 * @author Daniel van Dijk <daniel@invidiacreative.net>
 * @since 20200718 Initial creation.
 */
class Model {
    modelId: number;
    session: Session;
    tableKey: string;
    identifierKey: string;
    fields: ModelFieldsType;
    ModelClass: Class<Model>;

    static session: Session;
    static tableKey: string;
    static identifierKey: string;

    static fields: () => Schema;
    static toString: () => string;
    static reducer: (action: ActionType) => void;

    /**
     * @param {Class<Model>} ModelClass
     * @param {number} modelId
     */
    constructor(ModelClass: Class<Model>, modelId: number): void {
        this.modelId = modelId;
        this.ModelClass = ModelClass;
        this.session = this.ModelClass.session;
        this.tableKey = this.ModelClass.tableKey;
        this.identifierKey = this.ModelClass.identifierKey;

        const modelSchemaDefinition: Schema = this.ModelClass.fields();
        const fieldValuesOrNull: Model | null = this._getInstanceRowFromStateOrNull();

        if (fieldValuesOrNull) {
            this.fields = modelSchemaDefinition.castValuesAgainstDefinition(
                fieldValuesOrNull
            );
        } else {
            throw new HadesValidationError(
                "No data exists for this Model instance."
            );
        }
    }

    /**
     * @param {TableRowType} fields
     */
    update(fields: TableRowType): void {
        this.session.applyMutation(
            new Mutation({
                fields,
                ModelClass: this.ModelClass,
                type: MutationTypeEnum.UPDATE(),
                modelId: this.fields[this.identifierKey],
            })
        );
    }

    /**
     */
    delete(): void {
        this.session.applyMutation(
            new Mutation({
                ModelClass: this.ModelClass,
                type: MutationTypeEnum.DELETE(),
                modelId: this.fields[this.identifierKey],
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
     * @param {string} modelId
     *
     * @returns {Model}
     */
    static withId(modelId: number): Model {
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
     * @param {string} identifierKey
     */
    static addIdentifierKey(identifierKey: string): void {
        this.identifierKey = identifierKey;
    }

    /**
     * @param {Session} session
     */
    static addSession(session: Session): void {
        this.session = session;
    }

    /**
     * @returns {Model|null}
     */
    _getInstanceRowFromStateOrNull(): Model | null {
        return this.session.state[this.tableKey].rows[this.modelId] || null;
    }
}

export { Model };
