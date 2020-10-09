// @flow strict
import { Mutation } from "../objects";
import type { Schema, ModelFieldsType } from "./";
import { MutationTypeEnum } from "../objects/enums";
import type { Session, ActionType, TableRowType } from "../database";

/**
 * @author Daniel van Dijk <daniel@invidiacreative.net>
 * @since 20200718 Initial creation.
 */
class Model {
    modelId: number;
    session: Session;
    tableKey: string;
    fields: ModelFieldsType;
    ModelClass: Class<Model>;

    static session: Session;
    static tableKey: string;

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
        this.fields = this.ModelClass.fields().castValuesAgainstDefinition(
            this._getInstanceRowFromStateOrEmpty()
        );
    }

    /**
     * @param {TableRowType} fields
     */
    update(fields: TableRowType): void {
        this.session.applyMutation(
            new Mutation({
                fields,
                modelId: this.fields.id,
                ModelClass: this.ModelClass,
                type: MutationTypeEnum.UPDATE(),
            })
        );
    }

    /**
     */
    delete(): void {
        this.session.applyMutation(
            new Mutation({
                modelId: this.fields.id,
                ModelClass: this.ModelClass,
                type: MutationTypeEnum.DELETE(),
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
     * @param {Session} session
     */
    static addSession(session: Session): void {
        this.session = session;
    }

    /**
     * @returns {Model|TableRowType}
     */
    _getInstanceRowFromStateOrEmpty(): Model | TableRowType {
        return this.session.state[this.tableKey].rows[this.modelId] || {};
    }
}

export { Model };
