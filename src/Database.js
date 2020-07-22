import { Table } from "./Table";
import { Session } from "./Session";

/**
 * Type constants.
 */
const TYPE_FUNCTION = "function";

/**
 * @author Daniel van Dijk <daniel@invidiacreative.net>
 * @since 22072020 Clean up.
 */
class Database {
    /**
     * @param {Model[]} models
     */
    constructor(...models) {
        this._registerModels(models);
    }

    /**
     * @returns {Function}
     */
    reducer() {
        /**
         * @param {Object} [state]
         * @param {Object} action
         *
         * @returns {Object}
         */
        return (state = {}, action) => {
            const session = this._createSession(state);

            this._forModelsInSessionCreateTablesIfNeeded(session);
            this._forModelsInSessionApplyReducers(session, action);

            return session.state;
        };
    }

    /**
     * @param {Model[]} models
     */
    _registerModels(models) {
        this.registeredModels = models.reduce((uniqueModels, Model) => {
            if (uniqueModels.includes(Model)) {
                this._createWarningDuplicateModel(Model.toString());
            } else {
                uniqueModels.push(Model);
            }

            return uniqueModels;
        }, []);
    }

    /**
     * @param {Object} state
     *
     * @returns {Session}
     */
    _createSession(state) {
        const session = new Session(state);

        session.addModels(this.registeredModels);
        this.registeredModels.forEach((Model) => {
            Model.addSession(session);
        });

        return session;
    }

    /**
     * @param {Object} session
     */
    _forModelsInSessionCreateTablesIfNeeded(session) {
        session.models.forEach((Model) => {
            if (session.state[Model.getTableKey()]) {
                // Table already exists.
            } else {
                const table = new Table(Model);
                const tableKey = table.getKey();

                Model.addTableKey(tableKey);
                session.mergeIntoState({ [tableKey]: table });
            }
        });
    }

    /**
     * @param {Object} session
     * @param {Object} action
     */
    _forModelsInSessionApplyReducers(session, action) {
        session.models.forEach((Model) => {
            if (typeof Model.reducer === TYPE_FUNCTION) {
                Model.reducer.call(Model, action);
            } else {
                // No reducer defined for this model.
            }
        });
    }

    /**
     * @param {string} modelName
     */
    _createWarningDuplicateModel(modelName) {
        console.warn(`Tried to register duplicate Model: '${modelName}'.`);
    }
}

export { Database };
