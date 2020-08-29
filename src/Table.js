import { ErrorValidation } from "./errors";

/**
 * Table constants.
 */
const TABLE_NAME_BASE = "table_";

/**
 * Symbol constants.
 */
const SYMBOL_DESCRIPTION_KEY = "key";
const SYMBOL_DESCRIPTION_META = "meta";

/**
 * @author Daniel van Dijk <daniel@invidiacreative.net>
 * @since 22072020 Clean up.
 */
class Table {
    /**
     * @param {Model} Model
     */
    constructor(Model) {
        this.rows = this._createStorageForRows();

        this.propertySymbolKey = Symbol(SYMBOL_DESCRIPTION_KEY);
        this.propertySymbolMeta = Symbol(SYMBOL_DESCRIPTION_META);

        this[this.propertySymbolMeta] = this._createStorageForMeta();
        this[this.propertySymbolKey] = this._getModelTableName(Model);
    }

    /**
     * @returns {string}
     */
    getKey() {
        return this[this.propertySymbolKey];
    }

    /**
     * @param {Object} columns
     */
    insertRow(columns) {
        const metadata = this._getMeta();
        const hasOwnId = Boolean(columns.id);

        /**
         * @returns {number}
         */
        const determineModelId = () => {
            if (hasOwnId) {
                return columns.id;
            } else {
                return this._getNextId();
            }
        };

        const modelId = determineModelId();

        if (this.rows[modelId]) {
            this._createErrorNonUniqueRowIdForInsertion(modelId);
        } else {
            this.rows[modelId] = {
                ...columns,
                id: modelId,
            };

            if (hasOwnId) {
                metadata.idBlacklist.push(modelId);
                metadata.idBlacklist.sort((a, b) => a - b);
            } else {
                metadata.lastIdIncremental = modelId;
            }
        }
    }

    /**
     * @param {string} rowId
     * @param {Object} columns
     */
    updateRow(rowId, columns) {
        Object.assign(this.rows[rowId], columns);
    }

    /**
     * @param {Object} columns
     */
    upsertRow(columns) {
        if (this.rows[columns.id]) {
            this.updateRow(columns.id, columns);
        } else {
            this.insertRow(columns);
        }
    }

    /**
     * @param {Number} rowId
     */
    deleteRow(rowId) {
        const { idBlacklist } = this._getMeta();
        const rowIdBlacklistIndex = idBlacklist.indexOf(rowId.valueOf());

        if (rowIdBlacklistIndex === -1) {
            // No need to clear this ID from blacklist.
        } else {
            idBlacklist.splice(rowIdBlacklistIndex, 1);
        }

        delete this.rows[rowId];
    }

    /**
     * @returns {Object}
     */
    _getMeta() {
        return this[this.propertySymbolMeta];
    }

    /**
     * @returns {Object}
     */
    _createStorageForRows() {
        return {};
    }

    /**
     * @returns {Object}
     */
    _createStorageForMeta() {
        return { lastIdIncremental: 0, idBlacklist: [] };
    }

    /**
     * @returns {number}
     */
    _getNextId() {
        const { lastIdIncremental, idBlacklist } = this._getMeta();
        const nextIdIncremental = lastIdIncremental + 1;

        /**
         * @param {number} id
         *
         * @returns {number}
         */
        const findNextNonBlacklistedId = (id) => {
            const idBlacklistIndex = idBlacklist.indexOf(id);

            if (idBlacklistIndex === -1) {
                return id;
            } else if (idBlacklistIndex === idBlacklist.length - 1) {
                return id + 1;
            } else {
                return findNextNonBlacklistedId(id + 1);
            }
        };

        return findNextNonBlacklistedId(nextIdIncremental);
    }

    /**
     * @param {Model} Model
     *
     * @returns {string}
     */
    _getModelTableName(Model) {
        return `${TABLE_NAME_BASE}${Model.toString().toLowerCase()}`;
    }

    /**
     * @param {number} rowId
     *
     * @throws {ErrorValidation}
     */
    _createErrorNonUniqueRowIdForInsertion(rowId) {
        throw new ErrorValidation(
            `Cannot insert new row with non-unique ID '${rowId}'.`
        );
    }
}

export { Table };
