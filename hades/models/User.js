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
     */
    static reducer(session, action) {
        switch (action.type) {
            case "CREATE USER":
                User.create(action.payload);
                break;

            default:
                // Ignore this action.
                break;
        }
    }
}

export default User;
