import { MUTATION_TYPES } from "./constants";
import { UnexpectedValueError } from "./errors";

class Session {
    /**
     * @param {Object} state
     */
    constructor(state) {
        this.state = state;
    }

    /**
     * @param {Model[]} models
     */
    addModels(models) {
        this.models = models;
    }

    /**
     * @param {Object} state
     */
    mergeIntoState(state) {
        Object.assign(this.state, state);
    }

    /**
     * @param {Object} options
     */
    applyMutation(options) {
        const { type, Model, fields, modelId } = options;
        const pointerModelTable = this._getPointerForModelTable(Model);

        if (fields) {
            Model.runMutationBouncer(fields);
        } else {
            // No fields given.
        }

        // FIXME: Let's not pass fields in if it's undefined?
        switch (type) {
            case MUTATION_TYPES.INSERT:
                pointerModelTable.insertRow(fields);
                break;

            case MUTATION_TYPES.UPDATE:
                pointerModelTable.updateRow(modelId, fields);
                break;

            case MUTATION_TYPES.UPSERT:
                pointerModelTable.upsertRow(fields);
                break;

            case MUTATION_TYPES.DELETE:
                pointerModelTable.deleteRow(modelId);
                break;

            default:
                this._createErrorUnexpectedMutationType();
        }
    }

    /**
     * @param {Model} Model
     *
     * @returns {Table}
     */
    _getPointerForModelTable(Model) {
        return this.state[Model.getTableKey()];
    }

    /**
     * @param {string} mutationType
     *
     * @throws {UnexpectedValueError}
     */
    _createErrorUnexpectedMutationType(mutationType) {
        throw new UnexpectedValueError(
            `Unexpected mutation type: '${mutationType}'`
        );
    }
}

export { Session };
