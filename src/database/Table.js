// @flow strict
/* global GLOBAL_INDEX_INVALID */
/* global GLOBAL_TYPE_UNDEFINED */
/* global GLOBAL_SEPARATOR_SPACE */
/* global GLOBAL_DEFAULT_KEY_NAME_ID */
import type { Model } from "../model/Model";
import { HadesValidationError } from "../objects/errors/HadesValidationError";

type RowStorageType = {|
    // eslint-disable-next-line flowtype/no-weak-types
    [key: string | number]: any,
|};

opaque type MetaStorageType = {|
    lastIdIncremental: number,
    idBlacklist: Array<number>,
|};

/**
 * Table constants.
 */
const TABLE_NAME_PREFIX: string = "table_";

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
    _keyTable: string;
    _rows: RowStorageType;
    _meta: MetaStorageType;
    _keyIdentifierOrNull: string | null;

    /**
     * @param {Class<Model>} ModelClass
     */
    constructor(ModelClass: Class<Model>): void {
        this._rows = this._createStorageForRows();
        this._meta = this._createStorageForMeta();
        this._keyTable = this._getModelTableName(ModelClass);
        this._keyIdentifierOrNull = this._getModelIdentifierFieldNameOrNull(
            ModelClass
        );
    }

    /**
     * @returns {string}
     */
    getKey(): string {
        return this._keyTable;
    }

    /**
     * @returns {string}
     */
    getIdentifierKey(): string {
        return this._keyIdentifierOrNull || GLOBAL_DEFAULT_KEY_NAME_ID;
    }

    /**
     * @returns {RowStorageType}
     */
    getRows(): RowStorageType {
        return JSON.parse(JSON.stringify(this._rows));
    }

    /**
     * @param {TableRowType} columns
     */
    insertRow(columns: TableRowType): void {
        const identifierKey: string = this.getIdentifierKey();

        if (
            this._keyIdentifierOrNull &&
            typeof columns[this._keyIdentifierOrNull] === GLOBAL_TYPE_UNDEFINED
        ) {
            throw new HadesValidationError(
                [
                    "Cannot insert Table row with missing value for",
                    `defined identifier '${this._keyIdentifierOrNull}'.`,
                ].join(GLOBAL_SEPARATOR_SPACE)
            );
        } else {
            // We're using the default identifier. So, move on.
        }

        /**
         * @returns {number}
         *
         * @this Table
         */
        function determineModelId(): number {
            if (columns[identifierKey]) {
                return columns[identifierKey];
            } else {
                return this._getNextId();
            }
        }

        const modelId: number = determineModelId.call(this);

        if (this._rows[modelId]) {
            throw new HadesValidationError(
                `Cannot insert new Table row since given ID '${modelId}' is not unique.`
            );
        } else {
            this._rows[modelId] = {
                ...columns,
                [identifierKey]: modelId,
            };

            if (columns[identifierKey]) {
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
        Object.assign(this._rows[rowId], columns);
    }

    /**
     * @param {TableRowType} columns
     */
    upsertRow(columns: TableRowType): void {
        const identifierKey: string = this.getIdentifierKey();

        if (columns[identifierKey] && this._rows[columns[identifierKey]]) {
            this.updateRow(columns[identifierKey], columns);
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

        if (rowIdBlacklistIndex === GLOBAL_INDEX_INVALID) {
            // No need to clear this ID from the blacklist.
        } else {
            idBlacklist.splice(rowIdBlacklistIndex, 1);
        }

        delete this._rows[rowId.toString()];
    }

    /**
     */
    truncate(): void {
        this._rows = this._createStorageForRows();
        this._meta = this._createStorageForMeta();
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

            if (idBlacklistIndex === GLOBAL_INDEX_INVALID) {
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

    /**
     * @param {Class<Model>} ModelClass
     *
     * @returns {string|null}
     */
    _getModelIdentifierFieldNameOrNull(
        ModelClass: Class<Model>
    ): string | null {
        const fieldIdentifierNameOrNull:
            | string
            | null = ModelClass.fields().getDefinedIdentifierFieldNameOrNull();

        return fieldIdentifierNameOrNull;
    }
}

export { Table };
