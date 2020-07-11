import { Table } from "./Table";

class Database {
    /**
     * @param {Model[]} models
     */
    constructor(...models) {
        this.RegisteredModels = models.reduce((uniqueModels, model) => {
            const hasModel = uniqueModels.some((uniqueModel) => {
                return uniqueModel === model;
            });

            if (!hasModel) {
                uniqueModels.push(model);
            } else {
                console.warn(
                    `Tried to register duplicate Model: '${model.toString()}'.`
                );
            }

            return uniqueModels;
        }, []);
    }

    /**
     * TODO: Add try/catch, and throw all errors/warnings.
     * @returns {Function}
     */
    reducer() {
        return (state, action) => {
            const session = this.createSession(state || {});

            this.createTablesForModelsInSession(session);
            this.applyReducersFromModelsInSession(session, action);

            return session.state;
        };
    }

    /**
     * @param {Object} state
     *
     * @returns {Object}
     */
    createSession(state) {
        const session = { state };
        const processedModels = this.RegisteredModels.map((Model) => {
            return Model.withSession(session);
        });

        session.Models = processedModels;

        return session;
    }

    /**
     * @param {Object} session
     */
    createTablesForModelsInSession(session) {
        session.Models.forEach((Model) => {
            session.state = {
                ...session.state,
                ...Table.createFromModel(Model),
            };
        });
    }

    /**
     * @param {Object} session
     * @param {Object} action
     */
    applyReducersFromModelsInSession(session, action) {
        session.Models.forEach((Model) => {
            if (typeof Model.reducer === "function") {
                Model.reducer.call(Model, session, action);
            } else {
                // No reducer defined for this model. Ignore.
            }
        });
    }
}

export { Database };
