import Table from "./Table";
import Session from "./Session";

class Model {
    /**
     * @param {Object} properties
     */
    static create(properties) {
        Session.applyStateMutationCreate(this, properties);
    }

    /**
     * @param {Object} session
     */
    static withSession(session) {
        this.session = session;
        this.tableKey = Table.createModelTableName(this);

        return this;
    }
}

// TODO: Make static toString() method required abstract.

export default Model;
