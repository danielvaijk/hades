import { Table } from "./Table";
import { Session } from "./Session";

class Model {
    /**
     * @param {Model} Model
     * @param {string} modelId
     */
    constructor(Model, modelId) {
        this.session = Model.session;
        this.tableKey = Model.tableKey;
        this.sessionReference = Model.sessionReference;
        this.fields = this.session.state[this.tableKey].rows[modelId];
    }

    /**
     */
    delete() {
        Session.applyStateMutationDelete(this);
    }

    /**
     * @param {Object} properties
     */
    static create(properties) {
        Session.applyStateMutationCreate(this, properties);
    }

    /**
     * @param {string} modelId
     *
     * @returns {Model}
     */
    static withId(modelId) {
        return new Model(this, modelId);
    }

    /**
     * @returns {string|null}
     */
    static getTableKey() {
        return this.tableKey || null;
    }

    /**
     * @param {Object} session
     */
    static withSession(session) {
        this.sessionReference = session;
        this.session = JSON.parse(JSON.stringify(session));
        this.tableKey = Table.createModelTableName(this);

        return this;
    }
}

// TODO: Make static toString() method required abstract.

export { Model };
