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
            }

            return uniqueModels;
        }, []);
    }

    reducer() {
        return (state, action) => {
            // TODO: Create a copy of <state>?
            const session = this.createSession(state || {});
            this.mutator(session, action);

            return session.state;
        };
    }

    createSession(state) {
        return {
            state,
            Models: this.RegisteredModels,
        };
    }

    mutator(session, action) {
        session.Models.forEach((Model) => {
            if (typeof Model.reducer === "function") {
                Model.reducer(session, action);
            }
        });
    }
}

export default Database;
