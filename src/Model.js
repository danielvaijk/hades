import { MUTATION_TYPES } from "./constants";
import { ErrorImplementation } from "./errors";

/**
 * @author Daniel van Dijk <daniel@invidiacreative.net>
 * @since 22072020 Clean up.
 */
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

        this.fields = this.Model.fields().castValuesAgainstDefinition(
            this._getInstanceRowFromStateOrNull() || {}
        );
    }

    /**
     * @param {Object} fields
     */
    update(fields) {
        this.session.applyMutation({
            fields,
            type: MUTATION_TYPES.UPDATE,
            ...this._getPropertiesForInstanceMutation(),
        });
    }

    /**
     */
    delete() {
        this.session.applyMutation({
            type: MUTATION_TYPES.DELETE,
            ...this._getPropertiesForInstanceMutation(),
        });
    }

    /**
     * @throws {ErrorImplementation}
     */
    static toString() {
        throw new ErrorImplementation("Model#toString must be implemented.");
    }

    /**
     * @throws {ErrorImplementation}
     */
    static fields() {
        throw new ErrorImplementation("Model#fields must be implemented.");
    }

    /**
     * @throws {ErrorImplementation}
     */
    static reducer() {
        throw new ErrorImplementation("Model#reducer must be implemented.");
    }

    /**
     * @param {Object} fieldsForMutation
     */
    static assertMutationFieldsAreAllowed(fieldsForMutation) {
        this.fields().assertSchemaAllowsFieldsForMutation(
            this,
            fieldsForMutation
        );
    }

    /**
     * @param {Object} fields
     */
    static create(fields) {
        this.session.applyMutation({
            fields,
            Model: this,
            type: MUTATION_TYPES.INSERT,
        });
    }

    /**
     * @param {Object} fields
     */
    static upsert(fields) {
        this.session.applyMutation({
            fields,
            Model: this,
            type: MUTATION_TYPES.UPSERT,
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
    static getTableKeyOrNull() {
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

    /**
     * @returns {Model|null}
     */
    _getInstanceRowFromStateOrNull() {
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
}

export { Model };
