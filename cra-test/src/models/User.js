import { Model } from "hades";

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

            case "DELETE USER":
                const user = User.withId(action.payload.id);
                user.delete();
                break;

            default:
                // Ignore this action.
                break;
        }
    }
}

export default User;
