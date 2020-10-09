// @flow strict
/* global GLOBAL_DEFAULT_KEY_NAME_ID */
import { Model } from "../model";
import { HadesValidationError } from "../objects/errors";

opaque type RowStorageType = { ... };

opaque type MetaStorageType = {|
    lastIdIncremental: number,
    idBlacklist: Array<number>,
|};

type TableRowType = {
    id?: number,
    ...
};

/**
 * Table constants.
 */
const TABLE_NAME_PREFIX: string = "table_";

/**
 * Index constants.
 */
const INDEX_INVALID: number = -1;

/**
 * Counter constants.
 */
const INCREMENT_STEP: number = 1;
const INCREMENT_START: number = 0;

/**
 * @author Daniel van Dijk <daniel@invidiacreative.net>
 * @since 20200718 Initial creation.
 */
class Table {
    rows: RowStorageType;

    _key: string;
    _meta: MetaStorageType;

    /**
     * @param {Class<Model>} ModelClass
     */
    constructor(ModelClass: Class<Model>): void {
        this.rows = this._createStorageForRows();

        this._meta = this._createStorageForMeta();
        this._key = this._getModelTableName(ModelClass);
    }

    /**
     * @returns {string}
     */
    getKey(): string {
        return this._key;
    }

    /**
     * @returns {RowStorageType}
     */
    getRows(): RowStorageType {
        return JSON.parse(JSON.stringify(this.rows));
    }

    /**
     * @param {TableRowType} columns
     */
    insertRow(columns: TableRowType): void {
        /**
         * @returns {number}
         *
         * @this Table
         */
        function determineModelId(): number {
            if (columns[GLOBAL_DEFAULT_KEY_NAME_ID]) {
                return columns[GLOBAL_DEFAULT_KEY_NAME_ID];
            } else {
                return this._getNextId();
            }
        }

        const modelId: number = determineModelId.call(this);

        if (this.rows[modelId]) {
            throw new HadesValidationError(
                `Cannot insert new row since given ID '${modelId}' is not unique.`
            );
        } else {
            this.rows[modelId] = {
                ...columns,
                [GLOBAL_DEFAULT_KEY_NAME_ID]: modelId,
            };

            if (columns[GLOBAL_DEFAULT_KEY_NAME_ID]) {
                this._meta.idBlacklist.push(modelId);
                this._meta.idBlacklist.sort(
                    (a: number, b: number): number => a - b
                );
            } else {
                this._meta.lastIdIncremental = modelId;
            }
        }
    }

    /**
     * @param {number} rowId
     * @param {TableRowType} columns
     */
    updateRow(rowId: number, columns: TableRowType): void {
        Object.assign(this.rows[rowId], columns);
    }

    /**
     * @param {TableRowType} columns
     */
    upsertRow(columns: TableRowType): void {
        if (
            columns[GLOBAL_DEFAULT_KEY_NAME_ID] &&
            this.rows[columns[GLOBAL_DEFAULT_KEY_NAME_ID]]
        ) {
            this.updateRow(columns[GLOBAL_DEFAULT_KEY_NAME_ID], columns);
        } else {
            this.insertRow(columns);
        }
    }

    /**
     * @param {number} rowId
     */
    deleteRow(rowId: number): void {
        const { idBlacklist }: MetaStorageType = this._meta;
        const rowIdBlacklistIndex: number = idBlacklist.indexOf(rowId);

        if (rowIdBlacklistIndex === INDEX_INVALID) {
            // No need to clear this ID from the blacklist.
        } else {
            idBlacklist.splice(rowIdBlacklistIndex, 1);
        }

        delete this.rows[rowId.toString()];
    }

    /**
     */
    truncate(): void {
        this.rows = this._createStorageForRows();
    }

    /**
     * @returns {RowStorageType}
     */
    _createStorageForRows(): RowStorageType {
        return {};
    }

    /**
     * @returns {MetaStorageType}
     */
    _createStorageForMeta(): MetaStorageType {
        return {
            idBlacklist: [],
            lastIdIncremental: INCREMENT_START,
        };
    }

    /**
     * @returns {number}
     */
    _getNextId(): number {
        const { idBlacklist, lastIdIncremental }: MetaStorageType = this._meta;
        const nextIdIncremental: number = lastIdIncremental + INCREMENT_STEP;

        /**
         * @param {number} id
         *
         * @returns {number}
         */
        function findNextNonBlacklistedId(id: number): number {
            const idBlacklistIndex: number = idBlacklist.indexOf(id);

            if (idBlacklistIndex === INDEX_INVALID) {
                return id;
            } else if (idBlacklistIndex === idBlacklist.length - 1) {
                return id + INCREMENT_STEP;
            } else {
                return findNextNonBlacklistedId(id + INCREMENT_STEP);
            }
        }

        return findNextNonBlacklistedId(nextIdIncremental);
    }

    /**
     * @param {Class<Model>} ModelClass
     *
     * @returns {string}
     */
    _getModelTableName(ModelClass: Class<Model>): string {
        return `${TABLE_NAME_PREFIX}${ModelClass.toString().toLowerCase()}`;
    }
}

export { Table };
export type { TableRowType };
