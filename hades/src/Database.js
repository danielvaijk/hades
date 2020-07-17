import { Table } from "./Table";
import { Session } from "./Session";

class Database {
    /**
     * @param {Model[]} models
     */
    constructor(...models) {
        this.RegisteredModels = models.reduce((uniqueModels, model) => {
            const hasModel = uniqueModels.some((uniqueModel) => {
                return uniqueModel === model;
            });

            if (hasModel) {
                console.warn(
                    `Tried to register duplicate Model: '${model.toString()}'.`
                );
            } else {
                uniqueModels.push(model);
            }

            return uniqueModels;
        }, []);
    }

    /**
     * TODO: Add try/catch, and throw all errors/warnings.
     * @returns {Function}
     */
    reducer() {
        return (state = {}, action) => {
            const session = this.createSession(state);

            this.createTablesForModelsInSession(session);
            this.applyReducersFromModelsInSession(session, action);

            return session.state;
        };
    }

    /**
     * @param {Object} state
     *
     * @returns {Session}
     */
    createSession(state) {
        const session = new Session(JSON.parse(JSON.stringify(state)));
        const processedModelClasses = this.RegisteredModels.map((Model) => {
            return Model.withSession(session);
        });

        return session.withModelClasses(processedModelClasses);
    }

    /**
     * @param {Object} session
     */
    createTablesForModelsInSession(session) {
        session.models.forEach((Model) => {
            if (session.state[Model.tableKey]) {
                // Table already exists. Ignore.
            } else {
                session.mergeIntoState(Table.createFromModel(Model));
            }
        });
    }

    /**
     * @param {Object} session
     * @param {Object} action
     */
    applyReducersFromModelsInSession(session, action) {
        session.models.forEach((Model) => {
            if (typeof Model.reducer === "function") {
                Model.reducer.call(Model, action);
            } else {
                // No reducer defined for this model. Ignore.
            }
        });
    }
}

export { Database };
