import Table from "./Table";

class Database {
    /**
     * @param  {Model[]} models
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
     * @returns {Function}
     */
    reducer() {
        return (state, action) => {
            const session = this.createSession(state || {});

            this.createTablesFromRegisteredModels(session);
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
        return {
            state,
            Models: this.RegisteredModels,
        };
    }

    /**
     * @param {Object} session
     */
    createTablesFromRegisteredModels(session) {
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
                Model.reducer(session, action);
            }
        });
    }
}

export default Database;
