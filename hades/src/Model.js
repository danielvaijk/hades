import { Table } from "./Table";
import { Session } from "./Session";

class Model {
    /**
     * @param {Object} properties
     */
    static create(properties) {
        Session.applyStateMutationCreate(this, properties);
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
