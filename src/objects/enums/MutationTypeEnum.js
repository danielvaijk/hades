// @flow strict
import { EnumEntry } from "../EnumEntry";

/**
 * Mutation type constants.
 */
const MUTATION_TYPE_INSERT: string = "INSERT";
const MUTATION_TYPE_UPDATE: string = "UPDATE";
const MUTATION_TYPE_UPSERT: string = "UPSERT";
const MUTATION_TYPE_DELETE: string = "DELETE";

/**
 * @author Daniel van Dijk <daniel@invidiacreative.net>
 * @since 20201007 Initial creation.
 */
class MutationTypeEnum {
    /**
     * @returns {EnumEntry}
     */
    static INSERT(): EnumEntry {
        return new EnumEntry(MUTATION_TYPE_INSERT, MUTATION_TYPE_INSERT);
    }

    /**
     * @returns {EnumEntry}
     */
    static UPDATE(): EnumEntry {
        return new EnumEntry(MUTATION_TYPE_UPDATE, MUTATION_TYPE_UPDATE);
    }

    /**
     * @returns {EnumEntry}
     */
    static UPSERT(): EnumEntry {
        return new EnumEntry(MUTATION_TYPE_UPSERT, MUTATION_TYPE_UPSERT);
    }

    /**
     * @returns {EnumEntry}
     */
    static DELETE(): EnumEntry {
        return new EnumEntry(MUTATION_TYPE_DELETE, MUTATION_TYPE_DELETE);
    }
}

export { MutationTypeEnum };
