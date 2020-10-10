// @flow strict
import { EnumEntry } from "../EnumEntry";

/**
 * Mutation type constants.
 */
const FIELD_TYPE_IDENTIFIER: string = "IDENTIFIER";

/**
 * @author Daniel van Dijk <daniel@invidiacreative.net>
 * @since 20201010 Initial creation.
 */
class FieldTypeEnum {
    /**
     * @param {FieldClassType} [FieldClass]
     *
     * @returns {EnumEntry}
     */
    static IDENTIFIER(FieldClass: ?FieldClassType): EnumEntry {
        return new EnumEntry(FIELD_TYPE_IDENTIFIER, FieldClass);
    }
}

export { FieldTypeEnum };
