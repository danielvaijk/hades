class Table {
    /**
     * @param {Model} Model
     */
    constructor(Model) {
        this.rows = this.createStorageForRows();

        this.propertySymbolKey = Symbol("key");
        this.propertySymbolMeta = Symbol("meta");

        this[this.propertySymbolMeta] = this.createStorageForMeta();
        this[this.propertySymbolKey] = this.createModelTableName(Model);
    }

    /**
     * @returns {Object}
     */
    getMeta() {
        return this[this.propertySymbolMeta];
    }

    /**
     * @returns {string}
     */
    getKey() {
        return this[this.propertySymbolKey];
    }

    /**
     * @returns {Object}
     */
    createStorageForRows() {
        return {};
    }

    /**
     * @returns {Object}
     */
    createStorageForMeta() {
        return { lastId: 0 };
    }

    /**
     * @returns {number}
     */
    getNextId() {
        return this.getMeta().lastId + 1;
    }

    /**
     * @param {Object} columns
     */
    insertRow(columns) {
        // FIXME: Using a random modelId is bad, since we'll end up colliding
        // with the meta lastId value at some point.
        const modelId = columns.id || this.getNextId();

        if (this.rows[modelId]) {
            throw new TypeError("Cannot insert new row with non-unique ID.");
        } else {
            this.rows[modelId] = {
                ...columns,
                id: modelId,
            };

            this.getMeta().lastId++;
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
     * @param {Model} Model
     *
     * @returns {string}
     */
    createModelTableName(Model) {
        return `table_${Model.toString().toLowerCase()}`;
    }
}

export { Table };
