import { ValidationError } from "./errors";

class Table {
    /**
     * @param {Model} Model
     */
    constructor(Model) {
        this.rows = this._createStorageForRows();

        this.propertySymbolKey = Symbol("key");
        this.propertySymbolMeta = Symbol("meta");

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
        // FIXME: Using a random modelId is bad, since we'll end up colliding
        // with the meta lastId value at some point.
        const modelId = columns.id || this._getNextId();

        if (this.rows[modelId]) {
            this._createErrorNonUniqueRowIdForInsertion();
        } else {
            this.rows[modelId] = {
                ...columns,
                id: modelId,
            };

            this._getMeta().lastId++;
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
     * @param {string} rowId
     */
    deleteRow(rowId) {
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
        return { lastId: 0 };
    }

    /**
     * @returns {number}
     */
    _getNextId() {
        return this._getMeta().lastId + 1;
    }

    /**
     * @param {Model} Model
     *
     * @returns {string}
     */
    _getModelTableName(Model) {
        return `table_${Model.toString().toLowerCase()}`;
    }

    /**
     * @throws {ValidationError}
     */
    _createErrorNonUniqueRowIdForInsertion() {
        throw new ValidationError("Cannot insert new row with non-unique ID.");
    }
}

export { Table };
