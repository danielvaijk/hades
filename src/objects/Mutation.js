// @flow strict
import { Model } from "../model";
import { EnumEntry } from "../objects";

type MutationOptionsType = {|
    type: EnumEntry,
    modelId?: number,
    fields?: TableRowType,
    ModelClass: Class<Model>,
    willApplyToEntireTable?: boolean,
|};

/**
 * @author Daniel van Dijk <daniel@invidiacreative.net>
 * @since 20200919 Initial creation.
 */
class Mutation {
    _type: EnumEntry;
    _ModelClass: Class<Model>;
    _modelIdOrNull: number | null;
    _willApplyToEntireTable: boolean;
    _fieldsOrNull: TableRowType | null;

    /**
     * @param {MutationOptionsType} options
     */
    constructor(options: MutationOptionsType): void {
        this._type = options.type;
        this._ModelClass = options.ModelClass;
        this._fieldsOrNull = options.fields || null;
        this._modelIdOrNull = options.modelId || null;
        this._willApplyToEntireTable = options.willApplyToEntireTable || false;
    }

    /**
     * @returns {EnumEntry}
     */
    getType(): EnumEntry {
        return this._type;
    }

    /**
     * @returns {Class<Model>}
     */
    getModelClass(): Class<Model> {
        return this._ModelClass;
    }

    /**
     * @returns {number|null}
     */
    getModelIdOrNull(): number | null {
        return this._modelIdOrNull;
    }

    /**
     * @returns {boolean}
     */
    getWillApplyToEntireTable(): boolean {
        return this._willApplyToEntireTable;
    }

    /**
     * @returns {FieldsForMutation|null}
     */
    getFieldsOrNull(): TableRowType | null {
        return this._fieldsOrNull;
    }
}

export { Mutation };
