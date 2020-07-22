import { Session } from "./Session";
import { ImplementationError } from "./errors";

// TODO: Add 'identifier' field type, so we know if there's a specific field value
// that should be used as the identifier (like a uuid, instead of id).
// TODO: Also, make sure there are no ID collisions (trying to create model with non-unique identifier).
class Model {
    /**
     * @param {Model} Model
     * @param {string} modelId
     */
    constructor(Model, modelId) {
        this.Model = Model;
        this.modelId = modelId;
        this.session = Model.session;
        this.tableKey = Model.tableKey;
        this.sessionReference = Model.sessionReference;

        // TODO: Write a test for scenario where you query with withId and there are no results.
        this.fields = this.Model.fields().castValuesAgainstDefinition(
            this._getInstanceRowFromState() || {}
        );
    }

    /**
     * @param {Object} fields
     */
    update(fields) {
        this.session.applyMutation({
            fields,
            type: "UPDATE",
            ...this._getPropertiesForInstanceMutation(),
        });
    }

    /**
     */
    delete() {
        this.session.applyMutation({
            type: "DELETE",
            ...this._getPropertiesForInstanceMutation(),
        });
    }

    /**
     * @returns {Model|null}
     */
    _getInstanceRowFromState() {
        return this.session.state[this.tableKey].rows[this.modelId] || null;
    }

    /**
     * @returns {Object}
     */
    _getPropertiesForInstanceMutation() {
        return {
            Model: this.Model,
            modelId: this.fields.id,
        };
    }

    /**
     * @throws {ImplementationError}
     */
    static toString() {
        throw new ImplementationError("Model#toString must be implemented.");
    }

    /**
     * @throws {ImplementationError}
     */
    static fields() {
        throw new ImplementationError("Model#fields must be implemented.");
    }

    /**
     * @throws {ImplementationError}
     */
    static reducer() {
        throw new ImplementationError("Model#reducer must be implemented.");
    }

    /**
     * @param {Object} fieldsForMutation
     */
    static runMutationBouncer(fieldsForMutation) {
        this.fields().runSchemaMutationBouncer(this, fieldsForMutation);
    }

    /**
     * @param {Object} fields
     */
    static create(fields) {
        this.session.applyMutation({
            fields,
            Model: this,
            type: "INSERT",
        });
    }

    /**
     * @param {Object} fields
     */
    static upsert(fields) {
        this.session.applyMutation({
            fields,
            Model: this,
            type: "UPSERT",
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
     * @param {string} tableKey
     */
    static addTableKey(tableKey) {
        this.tableKey = tableKey;
    }

    /**
     * @param {Session} session
     */
    static addSession(session) {
        this.session = session;
    }
}

export { Model };
