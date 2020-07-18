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
     * @param {Object} modelFields
     */
    insertRow(modelFields) {
        const modelId = this.getNextId();
        const { id, ...modelFieldsFiltered } = modelFields;

        this.rows[modelId] = {
            id: modelId,
            ...modelFieldsFiltered,
        };

        this.getMeta().lastId++;
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
