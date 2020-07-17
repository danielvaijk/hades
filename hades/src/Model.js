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
        this.fields = this.session.state[this.tableKey].rows[modelId] || {};
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
        this.session.applyMutation({
            properties,
            type: "CREATE",
            modelClass: this,
        });
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
     * @param {Session} session
     */
    static withSession(session) {
        this.session = session;
        this.tableKey = Table.createModelTableName(this);

        return this;
    }
}

// TODO: Make static toString() method required abstract.

export { Model };
