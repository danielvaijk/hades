import Model from "../Model";

class User extends Model {
    /**
     * @returns {string}
     */
    static toString() {
        return "User";
    }

    static fields() {
        return {
            name: String,
            age: Number,
        };
    }

    /**
     * @param {Object} session
     * @param {Object} action
     *
     * @returns {Object}
     */
    static reducer(session, action) {
        switch (action.type) {
            case "CREATE USER":
                User.create(action.payload);
                break;
        }

        session.state.users = session.state.users ? session.state.users + 1 : 1;
    }
}

export default User;
