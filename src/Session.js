import { MUTATION_TYPES } from "./constants";
import { ErrorValueUnexpected } from "./errors";

/**
 * @author Daniel van Dijk <daniel@invidiacreative.net>
 * @since 22072020 Clean up.
 */
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
     * @param {Object} object
     */
    mergeIntoState(object) {
        Object.assign(this.state, object);
    }

    /**
     * @param {Object} options
     */
    applyMutation(options) {
        const { type, Model, fields, modelId } = options;
        const pointerModelTable = this._getPointerForModelTable(Model);

        if (fields) {
            Model.assertMutationFieldsAreAllowed(fields);
        } else {
            // No fields given.
        }

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
        return this.state[Model.getTableKeyOrNull()];
    }

    /**
     * @param {string} mutationType
     *
     * @throws {ErrorValueUnexpected}
     */
    _createErrorUnexpectedMutationType(mutationType) {
        throw new ErrorValueUnexpected(
            `Unexpected mutation type: '${mutationType}'`
        );
    }
}

export { Session };
