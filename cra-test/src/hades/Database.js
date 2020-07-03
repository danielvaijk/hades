class Database {
    /**
     * @param  {Model[]} allModel
     */
    constructor(...allModel) {
        // TODO: Only add unique models.
        this.RegisteredModels = allModel;
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
