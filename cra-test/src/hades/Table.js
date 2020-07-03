class Table {
    /**
     * @param {Model} Model
     *
     * @returns {Object}
     */
    static createFromModel(Model) {
        return {
            [this.createModelTableName(Model)]: {
                rows: [],
            },
        };
    }

    /**
     * @param {Model} Model
     *
     * @returns {string}
     */
    static createModelTableName(Model) {
        return `table_${Model.toString().toLowerCase()}s`;
    }
}

export default Table;
