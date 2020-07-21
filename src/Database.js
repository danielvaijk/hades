import { Table } from "./Table";
import { Session } from "./Session";

class Database {
    /**
     * @param {Model[]} models
     */
    constructor(...models) {
        this.registerModels(models);
    }

    /**
     * @param {Model[]} models
     */
    registerModels(models) {
        this.registeredModels = models.reduce((uniqueModels, Model) => {
            if (uniqueModels.includes(Model)) {
                this.createWarningDuplicateModel(Model.toString());
            } else {
                uniqueModels.push(Model);
            }

            return uniqueModels;
        }, []);
    }

    /**
     * TODO: Add try/catch, and throw all errors/warnings.
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
            const session = this.createSession(state);

            this.forModelsInSessionCreateTablesIfNeeded(session);
            this.forModelsInSessionApplyReducers(session, action);

            return session.state;
        };
    }

    /**
     * @param {Object} state
     *
     * @returns {Session}
     */
    createSession(state) {
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
    forModelsInSessionCreateTablesIfNeeded(session) {
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
    forModelsInSessionApplyReducers(session, action) {
        session.models.forEach((Model) => {
            if (typeof Model.reducer === "function") {
                Model.reducer.call(Model, action);
            } else {
                // No reducer defined for this model.
            }
        });
    }

    /**
     * @param {string} modelName
     */
    createWarningDuplicateModel(modelName) {
        console.warn(`Tried to register duplicate Model: '${modelName}'.`);
    }
}

export { Database };
