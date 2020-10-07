// @flow strict
import { Model } from "../";
import { EnumEntry } from "../objects";
import type { TableRowType } from "../Table";

type MutationOptionsType = {|
    type: EnumEntry,
    modelId?: number,
    ModelClass: Class<Model>,
    fields?: TableRowType,
|};

/**
 * @author Daniel van Dijk <daniel@invidiacreative.net>
 * @since 20200919 Initial creation.
 */
class Mutation {
    _type: EnumEntry;
    _ModelClass: Class<Model>;
    _modelIdOrNull: number | null;
    _fieldsOrNull: TableRowType | null;

    /**
     * @param {MutationOptionsType} options
     */
    constructor(options: MutationOptionsType): void {
        this._type = options.type;
        this._ModelClass = options.ModelClass;
        this._fieldsOrNull = options.fields || null;
        this._modelIdOrNull = options.modelId || null;
    }

    /**
     * @returns {EnumEntry}
     */
    getType(): EnumEntry {
        return this._type;
    }

    /**
     * @returns {FieldsForMutation|null}
     */
    getFieldsOrNull(): TableRowType | null {
        return this._fieldsOrNull;
    }

    /**
     * @returns {number|null}
     */
    getModelIdOrNull(): number | null {
        return this._modelIdOrNull;
    }

    /**
     * @returns {Class<Model>}
     */
    getModelClass(): Class<Model> {
        return this._ModelClass;
    }
}

export { Mutation };
